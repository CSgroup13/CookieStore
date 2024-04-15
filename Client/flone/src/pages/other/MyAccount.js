import { Fragment, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import SEO from "../../components/seo";
import LayoutThree from "../../layouts/LayoutThree";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import api, { putData } from "src/utils/api";
import { loginUser } from "src/store/slices/user-slice";
import cogoToast from "cogo-toast";

const MyAccount = () => {
  let { pathname } = useLocation();
  const { loggedUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [updateDetailsData, setUpdateDetailsData] = useState({
    email: loggedUser.email,
    password: loggedUser.password,
    // confirmPassword: loggedUser,
    firstName: loggedUser.firstName,
    lastName: loggedUser.lastName,
    phone: loggedUser.phone,
    address: loggedUser.address,
  });
  const [updateDetailsErrors, setUpdateDetailsErrors] = useState({});
  const [isUpdateDetailsValid, setIsUpdateDetailsValid] = useState(false);

  useEffect(() => {
    // Check if there are any errors or required fields are missing
    const noErrors = Object.keys(updateDetailsErrors).every(
      (key) => !updateDetailsErrors[key]
    );
    const allFieldsFilled = !Object.values(updateDetailsData).some(
      (value) => value === "" || value === null
    );
    setIsUpdateDetailsValid(noErrors && allFieldsFilled);
  }, [updateDetailsData, updateDetailsErrors]);

  const handleUpdateDetailsChange = (e) => {
    const { name, value } = e.target;
    setUpdateDetailsData({
      ...updateDetailsData,
      [name]: value,
    });
    validateUpdateDetailsField(name, value);
  };

  // Validate individual updateDetails field
  const validateUpdateDetailsField = (name, value) => {
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
        if (value !== updateDetailsData.password) {
          errMsg = "Passwords do not match.";
        }
        break;
      default:
        break;
    }
    setUpdateDetailsErrors({
      ...updateDetailsErrors,
      [name]: errMsg,
    });
  };

  const handleUpdateDetailsSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const passwordsMatch = data.get("password") === data.get("confirmPassword");
    if (isUpdateDetailsValid && passwordsMatch) {
      putData(`${api.users}update`, {
        id: loggedUser.id,
        email: data.get("email") || loggedUser.email,
        password: data.get("password") || loggedUser.password,
        firstName: data.get("firstName") || loggedUser.firstName,
        lastName: data.get("lastName") || loggedUser.lastName,
        phone: data.get("phone") || loggedUser.phone,
        address: data.get("address") || loggedUser.address,
        regDate: loggedUser.regDate,
      })
        .then((user) => {
          cogoToast.success(`User Details Successfully Updated`, {
            position: "top-right",
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
        titleTemplate="My Account"
        description="My Account page of flone react minimalist eCommerce template."
      />
      <LayoutThree headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "My Account", path: process.env.PUBLIC_URL + pathname },
          ]}
        />

        <div className="myaccount-area pb-80 pt-100">
          <div className="container">
            {loggedUser?.firstName ? (
              <div className="row">
                <div className="ms-auto me-auto col-lg-9">
                  <div className="myaccount-wrapper">
                    <Accordion defaultActiveKey="0">
                      <Accordion.Item
                        eventKey="0"
                        className="single-my-account mb-20"
                      >
                        <Accordion.Header className="panel-heading">
                          <span>1 .</span> Edit your account information{" "}
                        </Accordion.Header>
                        <Accordion.Body>
                          <form onSubmit={handleUpdateDetailsSubmit}>
                            <div className="myaccount-info-wrapper">
                              <div className="account-info-wrapper">
                                <h4>My Account Information</h4>
                                <h5>Your Personal Details</h5>
                              </div>
                              <div className="billing-info">
                                {updateDetailsErrors.email && (
                                  <p style={{ color: "red" }}>
                                    {updateDetailsErrors.email}
                                  </p>
                                )}
                                <input
                                  name="email"
                                  placeholder="Email"
                                  defaultValue={loggedUser.email}
                                  type="email"
                                  onChange={handleUpdateDetailsChange}
                                  required
                                />
                              </div>
                              <div className="billing-info">
                                <input
                                  type="text"
                                  name="firstName"
                                  defaultValue={loggedUser.firstName}
                                  placeholder="First Name"
                                  onChange={handleUpdateDetailsChange}
                                  required
                                />
                              </div>
                              <div className="billing-info">
                                <input
                                  type="text"
                                  name="lastName"
                                  defaultValue={loggedUser.lastName}
                                  placeholder="Last Name"
                                  onChange={handleUpdateDetailsChange}
                                  required
                                />
                              </div>
                              <div className="billing-info">
                                <input
                                  type="text"
                                  name="phone"
                                  defaultValue={loggedUser.phone}
                                  placeholder="Phone"
                                  onChange={handleUpdateDetailsChange}
                                  required
                                />
                              </div>
                              <div className="billing-back-btn">
                                <div className="billing-btn">
                                  <button type="submit">Continue</button>
                                </div>
                              </div>
                            </div>
                          </form>
                        </Accordion.Body>
                      </Accordion.Item>

                      <Accordion.Item
                        eventKey="1"
                        className="single-my-account mb-20"
                      >
                        <Accordion.Header className="panel-heading">
                          <span>2 .</span> Change your password
                        </Accordion.Header>
                        <Accordion.Body>
                          <form onSubmit={handleUpdateDetailsSubmit}>
                            <div className="myaccount-info-wrapper">
                              <div className="account-info-wrapper">
                                <h4>Change Password</h4>
                              </div>
                              <div className="row">
                                <div className="col-lg-12 col-md-12">
                                  <div className="billing-info">
                                    {updateDetailsErrors.password && (
                                      <p style={{ color: "red" }}>
                                        {updateDetailsErrors.password}
                                      </p>
                                    )}
                                    <label>Password</label>
                                    <input
                                      type="password"
                                      name="password"
                                      required
                                      onChange={handleUpdateDetailsChange}
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-12 col-md-12">
                                  <div className="billing-info">
                                    {updateDetailsErrors.confirmPassword && (
                                      <p style={{ color: "red" }}>
                                        {updateDetailsErrors.confirmPassword}
                                      </p>
                                    )}
                                    <label>Password Confirm</label>
                                    <input
                                      type="password"
                                      name="confirmPassword"
                                      required
                                      onChange={handleUpdateDetailsChange}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="billing-back-btn">
                                <div className="billing-btn">
                                  <button type="submit">Continue</button>
                                </div>
                              </div>
                            </div>
                          </form>
                        </Accordion.Body>
                      </Accordion.Item>

                      <Accordion.Item
                        eventKey="2"
                        className="single-my-account mb-20"
                      >
                        <Accordion.Header className="panel-heading">
                          <span>3 .</span> Modify your address
                        </Accordion.Header>
                        <Accordion.Body>
                          <form onSubmit={handleUpdateDetailsSubmit}>
                            <div className="myaccount-info-wrapper">
                              <div className="account-info-wrapper">
                                <h4>Change address</h4>
                              </div>
                              <div className="row">
                                <div className="billing-info">
                                  <label>Address</label>
                                  <input
                                    type="text"
                                    name="address"
                                    placeholder="Address"
                                    defaultValue={loggedUser.address}
                                    onChange={handleUpdateDetailsChange}
                                    required
                                  />
                                </div>
                              </div>

                              <div className="billing-back-btn">
                                <div className="billing-btn">
                                  <button type="submit">Continue</button>
                                </div>
                              </div>
                            </div>
                          </form>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-user-female"></i>
                    </div>
                    <div className="item-empty-area__text">
                      You are not logged in <br />{" "}
                      <Link to={process.env.PUBLIC_URL + "/login-register"}>
                        Login / Register
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </LayoutThree>
    </Fragment>
  );
};

export default MyAccount;
