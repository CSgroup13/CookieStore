import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import cogoToast from "cogo-toast";
import clsx from "clsx";
import MenuCart from "./sub-components/MenuCart";
import { logoutUser, setAdmin } from "../../store/slices/user-slice";

const IconGroup = ({ iconWhiteClass }) => {
  const handleClick = (e) => {
    e.currentTarget.nextSibling.classList.toggle("active");
  };

  const triggerMobileMenu = () => {
    const offcanvasMobileMenu = document.querySelector(
      "#offcanvas-mobile-menu"
    );
    offcanvasMobileMenu.classList.add("active");
  };
  const dispatch = useDispatch();
  const { loggedUser, isAdmin, userOrders } = useSelector((state) => state.user);
  const { compareItems } = useSelector((state) => state.compare);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { cartItems } = useSelector((state) => state.cart);

  return (
    <div className={clsx("header-right-wrap", iconWhiteClass)}>
      <div className="same-style account-setting">
        <button
          className="account-setting-active"
          style={{ color: loggedUser.firstName ? "green" : "black" }}
          onClick={(e) => handleClick(e)}
        >
          <i className="pe-7s-user" />
        </button>
        <div className="account-dropdown">
          <ul>
            {loggedUser?.firstName ? (
              <>
                {isAdmin ? (
                  <li>
                    <Link to={process.env.PUBLIC_URL + "/adminDashboard"}>
                      Manage
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link to={process.env.PUBLIC_URL + "/my-account"}>
                      My Account
                    </Link>
                  </li>
                )}
                <li>
                  <Link
                    onClick={() => {
                      dispatch(logoutUser());
                      dispatch(setAdmin(false));
                      cogoToast.success(
                        `Bye ${loggedUser.firstName} ${loggedUser.lastName}`,
                        {
                          position: "top-center",
                        }
                      );
                    }}
                  >
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <Link to={process.env.PUBLIC_URL + "/login-register"}>
                  Login/Register
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="same-style header-compare">
        <Link to={process.env.PUBLIC_URL + "/compare"}>
          <i className="pe-7s-shuffle" />
          <span className="count-style">
            {compareItems && compareItems.length ? compareItems.length : 0}
          </span>
        </Link>
      </div>
      <div className="same-style header-wishlist">
        <Link to={process.env.PUBLIC_URL + "/wishlist"}>
          <i className="pe-7s-like" />
          <span className="count-style">
            {wishlistItems && wishlistItems.length ? wishlistItems.length : 0}
          </span>
        </Link>
      </div>
      <div className="same-style header-wishlist">
        <Link to={process.env.PUBLIC_URL + "/userOrders"}>
          <i className="pe-7s-ribbon" />
          <span className="count-style">
            {userOrders && userOrders.length ? userOrders.length : 0}
          </span>
        </Link>
      </div>
      <div className="same-style cart-wrap d-none d-lg-block">
        <button className="icon-cart" onClick={(e) => handleClick(e)}>
          <i className="pe-7s-cart" />
          <span className="count-style">
            {cartItems && cartItems.length ? cartItems.length : 0}
          </span>
        </button>
        {/* menu cart */}
        <MenuCart />
      </div>
      <div className="same-style cart-wrap d-block d-lg-none">
        <Link className="icon-cart" to={process.env.PUBLIC_URL + "/cart"}>
          <i className="pe-7s-shopbag" />
          <span className="count-style">
            {cartItems.reduce((total) => total + 1, 0)}
          </span>
        </Link>
      </div>
      <div className="same-style mobile-off-canvas d-block d-lg-none">
        <button
          className="mobile-aside-button"
          onClick={() => triggerMobileMenu()}
        >
          <i className="pe-7s-menu" />
        </button>
      </div>
    </div>
  );
};

IconGroup.propTypes = {
  iconWhiteClass: PropTypes.string,
};

export default IconGroup;
