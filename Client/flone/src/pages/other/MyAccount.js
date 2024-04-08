import { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
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
    const passwordsFull =
      !!data.get("password") && !!data.get("confirmPassword");
    const passwordsMatch = data.get("password") === data.get("confirmPassword");
    if (isUpdateDetailsValid && passwordsFull && passwordsMatch) {
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
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "My Account", path: process.env.PUBLIC_URL + pathname },
          ]}
        />

        <div className="myaccount-area pb-80 pt-100">
          <div className="container">
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
                            <div className="myaccount-info-wrapper">
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
                                <button type="submit">Update details</button>
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
                              <h5>Your Password</h5>
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
                              <h4>Address</h4>
                            </div>
                            <div className="entries-wrapper">
                              <div className="row">
                                <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center">
                                  <div className="entries-info text-center">
                                    <p>John Doe</p>
                                    <p>Paul Park </p>
                                    <p>Lorem ipsum dolor set amet</p>
                                    <p>NYC</p>
                                    <p>New York</p>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center">
                                  <div className="entries-edit-delete text-center">
                                    <button className="edit">Edit</button>
                                    <button>Delete</button>
                                  </div>
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
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default MyAccount;
