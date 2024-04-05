import React, { Fragment, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import { useDispatch } from "react-redux";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import cogoToast from "cogo-toast";
import { loginUser } from "../../store/slices/user-slice";
import api, { postData } from "../../utils/api";

const LoginRegister = () => {
  let { pathname } = useLocation();
  const dispatch = useDispatch();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoginValid, setIsLoginValid] = useState(false);

  useEffect(() => {
    // Check if there are any errors or required fields are missing
    const noErrors = Object.keys(errors).every((key) => !errors[key]);
    const allFieldsFilled = !Object.values(loginData).some(
      (value) => value === "" || value === null
    );
    setIsLoginValid(noErrors && allFieldsFilled);
  }, [loginData, errors]);

  // Update form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
    validateField(name, value);
  };

  // Validate individual field
  const validateField = (name, value) => {
    let errMsg;
    switch (name) {
      case "email":
        if (
          !/^[A-Za-z\d.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z\d](?:[A-Za-z\d-]{0,61}[A-Za-z\d])?(?:\.[A-Za-z\d](?:[A-Za-z\d-]{0,61}[A-Za-z\d])?)*\.com$/.test(
            value
          )
        ) {
          errMsg = "Invalid email format.";
        }
        break;
      case "password":
        if (value !== "ad12343211ad") {
          if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{7,12}$/.test(value)) {
            errMsg =
              "Password must be 7-12 characters long, include at least one special character, one uppercase letter, and one number.";
          }
        }
        break;
      default:
        break;
    }
    setErrors({
      ...errors,
      [name]: errMsg,
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (isLoginValid) {
      const data = new FormData(event.currentTarget);
      postData(`${api.users}login`, {
        email: data.get("email"),
        password: data.get("password"),
        phone: "",
        address: "",
        lastName: "",
        firstName: "",
      })
        .then((user) => {
          cogoToast.success(`Hello ${user.firstName} ${user.lastName}`, {
            position: "bottom-left",
          });
          dispatch(loginUser(user));
        })
        .catch((error) => {
          cogoToast.error(error.message, { position: "bottom-left" });
        });
    } else {
      cogoToast.error("Form contains errors or missing information.", {
        position: "bottom-left",
      });
    }
  };
  return (
    <Fragment>
      <SEO
        titleTemplate="Login"
        description="Login page of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            {
              label: "Login Register",
              path: process.env.PUBLIC_URL + pathname,
            },
          ]}
        />
        <div className="login-register-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 col-md-12 ms-auto me-auto">
                <div className="login-register-wrapper">
                  <Tab.Container defaultActiveKey="login">
                    <Nav variant="pills" className="login-register-tab-list">
                      <Nav.Item>
                        <Nav.Link eventKey="login">
                          <h4>Login</h4>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="register">
                          <h4>Register</h4>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content>
                      <Tab.Pane eventKey="login">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <form onSubmit={handleSubmit}>
                              {errors.email && <p>{errors.email}</p>}
                              <br />
                              <input
                                type="text"
                                name="email"
                                placeholder="Email"
                                value={loginData.email}
                                onChange={handleChange}
                              />
                              {errors.password && <p>{errors.password}</p>}
                              <br />
                              <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={loginData.password}
                                onChange={handleChange}
                              />
                              <div className="button-box">
                                <div className="login-toggle-btn">
                                  <input type="checkbox" />
                                  <label className="ml-10">Remember me</label>
                                  <Link to={process.env.PUBLIC_URL + "/"}>
                                    Forgot Password?
                                  </Link>
                                </div>
                                <button type="submit">
                                  <span>Login</span>
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="register">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <form>
                              <input
                                type="text"
                                name="user-name"
                                placeholder="Username"
                              />
                              <input
                                type="password"
                                name="user-password"
                                placeholder="Password"
                              />
                              <input
                                name="user-email"
                                placeholder="Email"
                                type="email"
                              />
                              <div className="button-box">
                                <button type="submit">
                                  <span>Register</span>
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default LoginRegister;
