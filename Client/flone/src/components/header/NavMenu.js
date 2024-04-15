import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import clsx from "clsx";

const NavMenu = ({ menuWhiteClass, sidebarMenu }) => {
  return (
    <div
      className={clsx(
        sidebarMenu
          ? "sidebar-menu"
          : `main-menu ${menuWhiteClass ? menuWhiteClass : ""}`
      )}
    >
      <nav>
        <ul>
          <li>
            <Link to={process.env.PUBLIC_URL + "/"}>{"Home"}</Link>
          </li>
          <li>
            <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
              {"Shop"}
            </Link>
          </li>

          <li>
            <Link to={process.env.PUBLIC_URL + "/about"}>{"About us"}</Link>
          </li>
          {/* <ul className="submenu">
              <li>
                <Link to={process.env.PUBLIC_URL + "/not-found"}>
                  {"404_page"}
                </Link>
              </li>
            </ul> */}
          <li>
            <Link to={process.env.PUBLIC_URL + "/contact"}>{"Contact us"}</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

NavMenu.propTypes = {
  menuWhiteClass: PropTypes.string,
  sidebarMenu: PropTypes.bool,
};

export default NavMenu;
