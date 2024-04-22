import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import AppCurrentVisits from "../app-current-visits";
import StoreAnalytics from "../app-store-analytics";
import AppWidgetSummary from "../app-widget-summary";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api, { getData } from "src/utils/api";
import { getDatabase, onValue, ref } from "firebase/database";
import { app } from "src/firbaseConfig";
import { setNotifications } from "src/store/slices/notifications-slice";
import { setOrders } from "src/store/slices/order-slice";

export function listenToNotifications(dispatch) {
  const db = getDatabase(app);
  onValue(
    ref(db, `notifications/`),
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        let notifications = [];
        for (const orderId in data) {
          notifications.unshift(data[orderId]);
        }
        dispatch(setNotifications(notifications));
        getData(api.orders)
          .then((orders) => {
            dispatch(setOrders(orders));
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        dispatch(setNotifications([]));
      }
    },
    (error) => {
      console.error("Error listening for data changes:", error);
    }
  );
}
// ----------------------------------------------------------------------
export default function AppView() {
  const { orders } = useSelector((state) => state.order);
  const { users } = useSelector((state) => state.user);
  const [cookiesPerCategory, setCookiesPerCategory] = useState([]);
  const [dashboardData, setDashboardData] = useState({});
  const dispatch = useDispatch();

  function calculateNewUsers(startDate, endDate) {
    let totalUsers = 0;
    users.forEach((user) => {
      const regDate = new Date(user.regDate);
      if (regDate >= startDate && regDate <= endDate) {
        totalUsers++;
      }
    });
    return totalUsers;
  }

  function calculateOrdersAndIncome(startDate, endDate) {
    let totalOrders = 0;
    let totalIncome = 0;
    orders.forEach((order) => {
      const orderDate = new Date(order.date);
      if (orderDate >= startDate && orderDate <= endDate) {
        totalOrders++;
        totalIncome += order.totalPrice;
      }
    });
    return { totalOrders, totalIncome };
  }

  useEffect(() => {
    listenToNotifications(dispatch);
    const today = new Date();
    const lastWeekStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 7
    );
    const lastWeekEnd = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );
    const totalUsers = calculateNewUsers(lastWeekStart, lastWeekEnd);
    const { totalOrders, totalIncome } = calculateOrdersAndIncome(
      lastWeekStart,
      lastWeekEnd
    );
    setDashboardData({ totalIncome, totalUsers, totalOrders });
    getData(`${api.categories}GetCookiesSumCategory`)
      .then((categories) => {
        const transformedData = [];
        for (const category in categories) {
          if (categories.hasOwnProperty(category)) {
            transformedData.push({
              label: category,
              value: categories[category],
            });
          }
        }
        setCookiesPerCategory(transformedData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Function to get the start and end dates of each month of the current year
  function getMonthRange(year) {
    const months = [];
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      months.push({ startDate, endDate });
    }
    return months;
  }

  // Function to calculate metrics for each month
  function calculateMetricsForMonth(startDate, endDate) {
    const totalUsers = calculateNewUsers(startDate, endDate);
    const { totalOrders, totalIncome } = calculateOrdersAndIncome(
      startDate,
      endDate
    );
    return { income: totalIncome, users: totalUsers, orders: totalOrders };
  }

  // Function to generate data for the component
  function generateChartData(year) {
    const monthRange = getMonthRange(year);
    const chartData = monthRange.map(({ startDate, endDate }) => {
      const month = startDate.toLocaleString("en-us", { month: "short" });
      const { income, users, orders } = calculateMetricsForMonth(
        startDate,
        endDate
      );
      return {
        month,
        income,
        users,
        orders,
      };
    });
    return chartData;
  }

  // Generate data for the current year
  const currentYear = new Date().getFullYear();
  const chartData = generateChartData(currentYear);

  // Format the data for the component
  const labels = chartData.map((data) => `${data.month}/${currentYear}`);
  const series = [
    {
      name: "Income",
      type: "column",
      fill: "solid",
      data: chartData.map((data) => data.income),
    },
    {
      name: "Users",
      type: "area",
      fill: "gradient",
      data: chartData.map((data) => data.users),
    },
    {
      name: "Orders",
      type: "line",
      fill: "solid",
      data: chartData.map((data) => data.orders),
    },
  ];
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="Weekly Income"
            total={dashboardData.totalIncome}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="New Users"
            total={dashboardData.totalUsers ? dashboardData.totalUsers : 0}
            color="info"
            icon={
              <img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />
            }
          />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="Orders"
            total={dashboardData.totalOrders}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>
        <Grid xs={12} md={6} lg={8}>
          <StoreAnalytics
            title="Store Analytics"
            chart={{
              labels,
              series,
            }}
          />
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="Cookies Per Category"
            chart={{
              series: cookiesPerCategory,
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
