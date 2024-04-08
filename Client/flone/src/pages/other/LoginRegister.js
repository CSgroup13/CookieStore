import React, { Fragment, useEffect, useState} from "react";
import { useLocation ,useNavigate } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import emailjs from "emailjs-com";
import Nav from "react-bootstrap/Nav";
import { useDispatch } from "react-redux";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import cogoToast from "cogo-toast";
import { loginUser, setAdmin } from "../../store/slices/user-slice";
import api, { getData, postData } from "../../utils/api";

const LoginRegister = () => {
  const navigate = useNavigate();
  let { pathname } = useLocation();
  const dispatch = useDispatch();
  const [forgotPassword, setForgotPassword] = useState(false);
  //Registration state
  const [registrationData, setRegistrationData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });
  const [registrationErrors, setRegistrationErrors] = useState({});
  const [isRegistrationValid, setIsRegistrationValid] = useState(false);

  //Login state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoginValid, setIsLoginValid] = useState(false);

  //Registration form validation
  useEffect(() => {
    // Check if there are any errors or required fields are missing
    const noErrors = Object.keys(registrationErrors).every(
      (key) => !registrationErrors[key]
    );
    const allFieldsFilled = !Object.values(registrationData).some(
      (value) => value === "" || value === null
    );
    setIsRegistrationValid(noErrors && allFieldsFilled);
  }, [registrationData, registrationErrors]);

  //Login form validation
  useEffect(() => {
    // Check if there are any errors or required fields are missing
    const noErrors = Object.keys(errors).every((key) => !errors[key]);
    const allFieldsFilled = !Object.values(loginData).some(
      (value) => value === "" || value === null
    );
    setIsLoginValid(noErrors && allFieldsFilled);
  }, [loginData, errors]);

  // Update registration form data
  const handleRegistrationChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData({
      ...registrationData,
      [name]: value,
    });
    validateRegistrationField(name, value);
  };

  // Update login form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
    validateField(name, value);
  };

  // Validate individual registration field
  const validateRegistrationField = (name, value) => {
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
        if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{7,12}$/.test(value)) {
          errMsg =
            "Password must be 7-12 characters long, include at least one special character, one uppercase letter, and one number.";
        }
        break;
      case "confirmPassword":
        if (value !== registrationData.password) {
          errMsg = "Passwords do not match.";
        }
        break;
      default:
        break;
    }
    setRegistrationErrors({
      ...registrationErrors,
      [name]: errMsg,
    });
  };

  // Validate login individual field
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

  // Handle registration form submission
  const handleRegistrationSubmit = (event) => {
    event.preventDefault();
    if (isRegistrationValid) {
      const data = new FormData(event.currentTarget);
      postData(`${api.users}register`, {
        email: data.get("email"),
        password: data.get("password"),
        firstName: data.get("firstName"),
        lastName: data.get("lastName"),
        phone: data.get("phone"),
        address: data.get("address"),
        regDate: new Date(),
      })
        .then((user) => {
          cogoToast.success(`Hello ${user.firstName} ${user.lastName}`, {
            position: "top-right",
          });
          dispatch(loginUser(user));
          navigate("/");
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

  // Handle login form submission
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
            position: "top-right",
          });
          dispatch(loginUser(user));
          if (user.email === "cookiesaddiction1@gmail.com")
            dispatch(setAdmin());
          navigate("/");
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

  //Forgot password
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleForgetPasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    getData(`${api.users}${email}/userDetailsByEmail`)
      .then((user) => {
        emailjs
          .send(
            "service_toin4ud", // Your email service ID
            "template_pi1v48b", // Your email template ID
            {
              to_name: user.firstName + " " + user.lastName,
              to_email: email,
              from_name: "Cookies Addiction",
              message: `Your Password is: ${user.password}`,
            },
            "Ov1O19nU4lvvYar64"
          )
          .then(() => {
            cogoToast.success("Password email sent. Please check your email.");
            setEmail("");
          })
          .catch((error) => {
            console.error("Error sending email:", error);
          })
          .finally(() => {
            setIsLoading(false);
          });
      })
      .catch((err) => {
        cogoToast.error(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
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
                              {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
                              <br />
                              <input
                                type="text"
                                name="email"
                                placeholder="Email"
                                value={loginData.email}
                                onChange={handleChange}
                              />
                              {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
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
                                  <br />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setForgotPassword((state) => !state)
                                    }
                                  >
                                    Forgot Password?
                                  </button>
                                </div>
                                <button type="submit">
                                  <span>Login</span>
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </Tab.Pane>
                      {forgotPassword && (
                        <div>
                          <div className="login-form-container">
                            <div className="login-register-form">
                              <h2>Forgot Password</h2>
                              <form onSubmit={handleForgetPasswordSubmit}>
                                <label htmlFor="email">Email:</label>
                                <input
                                  type="email"
                                  id="email"
                                  value={email}
                                  onChange={handleEmailChange}
                                  placeholder="Enter your email"
                                  required
                                  disabled={isLoading}
                                />
                                <div className="button-box">
                                  <button type="submit" disabled={isLoading}>
                                    <span>Send Email</span>
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      )}
                      <Tab.Pane eventKey="register">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <form onSubmit={handleRegistrationSubmit}>
                              {registrationErrors.email && (
                                <p style={{ color: "red" }}>{registrationErrors.email}</p>
                              )}
                              <br />
                              <input
                                name="email"
                                placeholder="Email"
                                type="email"
                                onChange={handleRegistrationChange}
                                required
                              />
                              {registrationErrors.password && (
                                <p style={{ color: "red" }}>{registrationErrors.password}</p>
                              )}
                              <br />

                              <input
                                type="password"
                                name="password"
                                onChange={handleRegistrationChange}
                                placeholder="Password"
                                required
                              />
                              {registrationErrors.confirmPassword && (
                                <p style={{ color: "red" }}>{registrationErrors.confirmPassword}</p>
                              )}
                              <br />
                              <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                onChange={handleRegistrationChange}
                                required
                              />
                              <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                onChange={handleRegistrationChange}
                                required
                              />
                              <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                onChange={handleRegistrationChange}
                                required
                              />
                              <input
                                type="text"
                                name="phone"
                                placeholder="Phone"
                                onChange={handleRegistrationChange}
                                required
                              />
                              <input
                                type="text"
                                name="address"
                                placeholder="Address"
                                onChange={handleRegistrationChange}
                                required
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
