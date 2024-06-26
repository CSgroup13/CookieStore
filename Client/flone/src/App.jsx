import { Suspense, lazy, useEffect } from "react";
import ScrollToTop from "./helpers/scroll-top";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import api, { getData } from "./utils/api";
import { store } from "./store/store";
import { setProducts } from "./store/slices/product-slice";
import { setWishlist } from "./store/slices/wishlist-slice";
import ThemeProvider from "./theme";
import DashboardLayout from "./layouts/dashboard";
import { useSelector, useDispatch } from "react-redux";
import { setUserOrders, setUsers } from "./store/slices/user-slice";
import { setOrders } from "./store/slices/order-slice";

export const IndexPage = lazy(() => import("./pages/manage/dashboard"));
export const UserPage = lazy(() => import("./pages/manage/user"));
export const ProductsPage = lazy(() => import("./pages/manage/products"));
export const OrdersPage = lazy(() => import("./pages/manage/orders"));

// home page
const HomeOrganicFood = lazy(() => import("./pages/home/HomeCookiesAddiction"));
// shop pages
const ShopGridStandard = lazy(() => import("./pages/shop/ShopGridStandard"));

// product pages
const Product = lazy(() => import("./pages/shop-product/Product"));
const ProductTabLeft = lazy(() =>
  import("./pages/shop-product/ProductTabLeft")
);
// other pages
const About = lazy(() => import("./pages/other/About"));
const Contact = lazy(() => import("./pages/other/Contact"));
const MyAccount = lazy(() => import("./pages/other/MyAccount"));
const LoginRegister = lazy(() => import("./pages/other/LoginRegister"));

const Cart = lazy(() => import("./pages/other/Cart"));
const Wishlist = lazy(() => import("./pages/other/Wishlist"));
const UserOrders = lazy(() => import("./pages/other/UserOrders"));
const Compare = lazy(() => import("./pages/other/Compare"));
const Checkout = lazy(() => import("./pages/other/Checkout"));

const NotFound = lazy(() => import("./pages/other/NotFound"));

const App = () => {
  const { loggedUser, isAdmin } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    getData(api.products)
      .then((products) => {
        store.dispatch(setProducts(products));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (loggedUser?.firstName) {
      getData(`${api.users}${loggedUser.id}/products`)
        .then((products) => {
          store.dispatch(setWishlist(products));
        })
        .catch((error) => {
          console.error(error);
        });
    }
    else {
      store.dispatch(setWishlist([]));
    }
    if (isAdmin) {
      getData(api.users)
        .then((users) => {
          dispatch(setUsers(users))
        })
        .catch((error) => {
          console.error(error);
        });

      getData(api.orders)
        .then((orders) => {
          dispatch(setOrders(orders))
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [loggedUser]);

  useEffect(() => {
    if (loggedUser?.firstName) {
      getData(`${api.users}${loggedUser.id}/orders`)
        .then((userOrders) => {
          store.dispatch(setUserOrders(userOrders));
        })
        .catch((error) => {
          console.error(error);
        });
    }
    else {
      store.dispatch(setUserOrders([]));
    }

  }, [loggedUser, orders]);

  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop>
          <Suspense
            fallback={
              <div className="flone-preloader-wrapper">
                <div className="flone-preloader">
                  <span></span>
                  <span></span>
                </div>
              </div>
            }
          >
            <Routes>
              <Route
                path={process.env.PUBLIC_URL + "/"}
                element={<HomeOrganicFood />}
              />

              {/* Shop pages */}
              <Route
                path={process.env.PUBLIC_URL + "/shop-grid-standard"}
                element={<ShopGridStandard />}
              />

              {/* Shop product pages */}
              <Route
                path={process.env.PUBLIC_URL + "/product/:id"}
                element={<Product />}
              />
              <Route
                path={process.env.PUBLIC_URL + "/product-tab-left/:id"}
                element={<ProductTabLeft />}
              />
              {/* Other pages */}
              <Route
                path={process.env.PUBLIC_URL + "/about"}
                element={<About />}
              />
              <Route
                path={process.env.PUBLIC_URL + "/contact"}
                element={<Contact />}
              />
              <Route
                path={process.env.PUBLIC_URL + "/my-account"}
                element={<MyAccount />}
              />
              <Route
                path={process.env.PUBLIC_URL + "/login-register"}
                element={<LoginRegister />}
              />

              <Route
                path={process.env.PUBLIC_URL + "/cart"}
                element={<Cart />}
              />
              <Route
                path={process.env.PUBLIC_URL + "/wishlist"}
                element={<Wishlist />}
              />
              <Route
                path={process.env.PUBLIC_URL + "/userOrders"}
                element={<UserOrders />}
              />
              <Route
                path={process.env.PUBLIC_URL + "/compare"}
                element={<Compare />}
              />
              <Route
                path={process.env.PUBLIC_URL + "/checkout"}
                element={<Checkout />}
              />
              {isAdmin ? (
                <>
                  <Route
                    path={process.env.PUBLIC_URL + "/adminDashboard"}
                    element={
                      <DashboardLayout>
                        <Suspense>
                          <IndexPage />
                        </Suspense>
                      </DashboardLayout>
                    }
                  />
                  <Route
                    path={process.env.PUBLIC_URL + "/adminUsers"}
                    element={
                      <DashboardLayout>
                        <Suspense>
                          <UserPage />
                        </Suspense>
                      </DashboardLayout>
                    }
                  />
                  <Route
                    path={process.env.PUBLIC_URL + "/adminProducts"}
                    element={
                      <DashboardLayout>
                        <Suspense>
                          <ProductsPage />
                        </Suspense>
                      </DashboardLayout>
                    }
                  />
                  <Route
                    path={process.env.PUBLIC_URL + "/adminOrders"}
                    element={
                      <DashboardLayout>
                        <Suspense>
                          <OrdersPage />
                        </Suspense>
                      </DashboardLayout>
                    }
                  />
                </>
              ) : null}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ScrollToTop>
      </Router>
    </ThemeProvider>
  );
};

export default App;
