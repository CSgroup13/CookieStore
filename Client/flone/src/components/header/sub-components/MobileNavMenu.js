import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "src/store/slices/user-slice";

const MobileNavMenu = () => {
  const { loggedUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();


  return (
    <nav className="offcanvas-navigation" id="offcanvas-navigation">
      <ul>
        <li>
          <Link to={process.env.PUBLIC_URL + "/"}>{"home"}</Link>
        </li>

        <li>
          <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
            {"shop"}
          </Link>
        </li>
        <li>
              <Link to={process.env.PUBLIC_URL + "/cart"}>
                {"cart"}
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/checkout"}>
                {"checkout"}
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/wishlist"}>
                {"wishlist"}
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/compare"}>
                {"compare"}
              </Link>
            </li>
            {loggedUser?.firstName ?
            <li>
              <Link to={process.env.PUBLIC_URL + "/my-account"}>
                {"my account"}
              </Link>
            </li>:null}
            <li>
              {loggedUser?.firstName ?
              ( <Link onClick={() => dispatch(logoutUser())}>
              Log Out
            </Link>)
              :
              (<Link to={process.env.PUBLIC_URL + "/login-register"}>
                {"login / register"}
              </Link>)}
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/about"}>
                {"about us"}
              </Link>
            </li>
         
      
        <li>
          <Link to={process.env.PUBLIC_URL + "/contact"}>
            {"contact us"}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default MobileNavMenu;
