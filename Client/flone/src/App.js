import { Suspense, lazy, useEffect } from "react";
import ScrollToTop from "./helpers/scroll-top";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import api, { getData } from "./utils/api";
import { store } from "./store/store";
import { useSelector } from "react-redux";
import { setProducts } from "./store/slices/product-slice";
import { setWishlist } from "./store/slices/wishlist-slice";
import ThemeProvider from "./theme";
import DashboardLayout from "./layouts/dashboard";

export const IndexPage = lazy(() => import("./pages/app"));
export const UserPage = lazy(() => import("./pages/user"));
export const ProductsPage = lazy(() => import("./pages/products"));
export const OrdersPage = lazy(() => import("./pages/orders"));

// home page
const HomeOrganicFood = lazy(() => import("./pages/home/HomeOrganicFood"));
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
const Compare = lazy(() => import("./pages/other/Compare"));
const Checkout = lazy(() => import("./pages/other/Checkout"));

const NotFound = lazy(() => import("./pages/other/NotFound"));

const App = () => {
  const { loggedUser, isAdmin } = useSelector((state) => state.user);

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
          // store.dispatch
        })
        .catch((error) => {
          console.error(error);
        });
    } else store.dispatch(setWishlist([]));
  }, [loggedUser]);

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
