import { Fragment } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SEO from "../../components/seo";
import LayoutThree from "../../layouts/LayoutThree";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import Paypal from "./PayPal";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import api, { postData } from "src/utils/api";
import cogoToast from "cogo-toast";
import emailjs from "emailjs-com";
import { deleteAllFromCart, setDiscount } from "src/store/slices/cart-slice";
import { getDatabase, push, ref, set } from "firebase/database";
import { app } from "src/config";
import { addToUserOrders } from "src/store/slices/user-slice";

const Checkout = () => {
  const { totalPrice } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const initialOptions = {
    "client-id":
      "AXOHJgQSrZkQA98vO5RL3R-3g-mUSDbD_VR1N17zk-GUH4CdCVryLJsZDlk7DOArvvuF9cFUe9ziufET",
    currency: "ILS",
    intent: "capture",
  };
  let { pathname } = useLocation();
  const { cartItems } = useSelector((state) => state.cart);
  const { loggedUser } = useSelector((state) => state.user);
  // List of cities in Israel
  const cities = [
    "Jerusalem",
    "Tel Aviv",
    "Haifa",
    "Rishon LeZion",
    "Petah Tikva",
    "Ashdod",
    "Netanya",
    "Beer Sheva",
    "Bnei Brak",
    "Holon",
    "Ramat Gan",
    "Ashkelon",
    "Bat Yam",
    "Herzliya",
    "Kfar Saba",
    "Beit Shemesh",
    "Lod",
    "Ramat HaSharon",
    "Nahariya",
    "Modiin",
    "Hadera",
    "Ra'anana",
    "Acre",
    "Tiberias",
    "Dimona",
    "Beersheba",
    "Kiryat Gat",
    "Eilat",
    "Givatayim",
    "Or Yehuda",
    "Rosh HaAyin",
    "Sderot",
    "Yavne",
    "Pardes Hanna-Karkur",
    "Kiryat Ono",
    "Hod HaSharon",
    "Kiryat Motzkin",
    "Nof HaGalil",
    "Qiryat Shemona",
    "Kfar Yona",
    "Et Tira",
    "Tira",
    "Umm al-Fahm",
    "Ma'alot-Tarshiha",
    "Qiryat Bialik",
    "Kiryat Yam",
    "Bet She'an",
    "Yehud-Monosson",
    "Giv'at Shmuel",
    "Nesher",
    "Ramat Yishai",
    "Modi'in-Maccabim-Re'ut",
    "Rosh Pinna",
    "Migdal HaEmek",
    "Arad",
    "Kafr Qasim",
    "Sakhnin",
    "Gedera",
    "Katzrin",
    "Qalansawe",
    "Nahf",
    // Add more cities as needed
  ];

  const [formData, setFormData] = useState({
    firstName: loggedUser?.firstName || "",
    lastName: loggedUser?.lastName || "",
    address: loggedUser?.address || "",
    apartment: "",
    city: "",
    postalCode: "",
    phone: loggedUser?.phone || "",
    email: loggedUser?.email || "",
    shipping: "",
    payment: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isPlaceOrderValid, setIsPlaceOrderValid] = useState(false);

  useEffect(() => {
    // Check if there are any errors or required fields are missing
    const noErrors = Object.keys(formErrors).every((key) => !formErrors[key]);
    const allFieldsFilled = !Object.entries(formData).some(([key, value]) => {
      return (
        key !== "notes" &&
        key !== "apartment" &&
        (value === "" || value === null)
      );
    });

    setIsPlaceOrderValid(noErrors && allFieldsFilled);
  }, [formData, formErrors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateFormField(name, value);
  };

  const handleCityChange = (event, value) => {
    setFormData({ ...formData, city: value });
  };

  // Validate individual Order Form field
  const validateFormField = (name, value) => {
    let errMsg;
    switch (name) {
      case "firstName":
      case "lastName":
        if (!/^[A-Za-z]+(?:[\s'-][A-Za-z]+)*$/i.test(value)) {
          errMsg = "Please enter a valid name.";
        }
        break;
      case "address":
        // Allow alphanumeric characters and common punctuation marks
        if (!/^[A-Za-z0-9\s,'-]*$/i.test(value)) {
          errMsg = "Please enter a valid address.";
        }
        break;
      case "postalCode":
        // Validate postal code for Israel (7 digits)
        if (!/^\d{7}$/i.test(value)) {
          errMsg = "Postal code must be 7 digits long.";
        }
        break;
      case "phone":
        // Validate phone number for Israel
        if (!/^0\d{9}$/i.test(value)) {
          errMsg = "Please enter a valid Israeli phone number.";
        }
        break;
      case "email":
        // Validate email format
        if (!/^[A-Za-z\d._%+-]+@[A-Za-z\d.-]+\.[A-Za-z]{2,}$/i.test(value)) {
          errMsg = "Invalid email format.";
        }
        break;
      default:
        break;
    }
    setFormErrors({
      ...formErrors,
      [name]: errMsg,
    });
  };

  const placeOrder = () => {
    if (isPlaceOrderValid) {
      const orderItems = cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      const orderDetails = {
        userId: loggedUser?.id || -1,
        totalPrice,
        date: new Date(Date.now()).toISOString(),
        shippingAddress: `${formData.address}, ${formData.apartment}, ${formData.city}, Israel, ${formData.postalCode}`,
        shippingMethod: Number(formData.shipping),
        paymentMethod: Number(formData.payment),
        notes: formData.notes,
        status: 0,
        orderItems: orderItems,
      };
      postData(api.orders, orderDetails)
        .then((order) => {
          const orderDetailsMessage = `
          New order received!
            Order Number: ${order.id}
            Total Price: ${order.totalPrice}
            First Name: ${formData.firstName}
            Last Name: ${formData.lastName}
            Address: ${formData.address}
            Apartment: ${formData.apartment}
            City: ${formData.city}
            Postal Code: ${formData.postalCode}
            Phone: ${formData.phone}
            Email: ${formData.email}
            Shipping Method: ${
              formData.shipping === "1" ? "Shipping" : "Pickup"
            }
            Payment Method: ${formData.payment === "1" ? "Paypal" : "Cash"}
            Notes: ${formData.notes}
            Order Items: ${cartItems
              .map((item) => `${item.name}: ${item.quantity}`)
              .join(", ")}
            `;
          // Sending confirmation email to the user
          emailjs
            .send(
              "service_toin4ud",
              "template_pi1v48b",
              {
                to_name: formData.firstName + " " + formData.lastName,
                to_email: formData.email,
                from_name: "Cookies Addiction",
                from_email: "cookiesaddiction1@gmail.com",
                message: `${orderDetailsMessage}\nThank you for choosing us! 🍪🎉`,
              },
              "Ov1O19nU4lvvYar64"
            )
            .then(() => {
              // Notification to the user
              cogoToast.success(`Your Order successfully placed!🍪🎉`, {
                position: "top-right",
              });
              // Sending notification email to the admin
              emailjs
                .send(
                  "service_toin4ud",
                  "template_0134u4t",
                  {
                    to_name: "Shaked",
                    to_email: "cookiesaddiction1@gmail.com",
                    message: orderDetailsMessage,
                  },
                  "Ov1O19nU4lvvYar64"
                )
                .then(() => {
                  console.log("Notification email sent to admin.");
                  const newNotification = {
                    id: order.id,
                    title: "You have new order",
                    description: `from ${
                      formData.firstName + " " + formData.lastName
                    }`,
                    avatar: null,
                    type: "order_placed",
                    createdAt: new Date().toISOString(),
                    isUnRead: true,
                  };
                  const db = getDatabase(app);
                  set(ref(db, `notifications/${order.id}`), newNotification);
                  dispatch(addToUserOrders(orderDetails));
                  dispatch(deleteAllFromCart());
                  dispatch(setDiscount(0));
                  navigate("/"); // Only navigate after sending the email to the admin
                })
                .catch((error) => {
                  console.error("Error sending email to admin:", error);
                  navigate("/"); // Handle error and navigate
                });
            })
            .catch((error) => {
              console.error("Error sending email to user:", error);
              navigate("/"); // Handle error and navigate
            });
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
      <SEO titleTemplate="Checkout" />
      <LayoutThree headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "Checkout", path: process.env.PUBLIC_URL + pathname },
          ]}
        />
        <div className="checkout-area pt-95 pb-100">
          <div className="container">
            {cartItems && cartItems.length >= 1 ? (
              <div className="row">
                <div className="col-lg-7">
                  <div className="billing-info-wrap">
                    <h3>Billing Details</h3>
                    <div className="row">
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>First Name</label>
                          <input
                            type="text"
                            name="firstName"
                            onChange={handleChange}
                            defaultValue={loggedUser?.firstName}
                          />
                          {formErrors.firstName && (
                            <span style={{ color: "red" }}>
                              {formErrors.firstName}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            onChange={handleChange}
                            defaultValue={loggedUser?.lastName}
                          />
                          {formErrors.lastName && (
                            <span style={{ color: "red" }}>
                              {formErrors.lastName}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="billing-info mb-20">
                        <label>Country</label>
                        <input type="text" value="Israel" disabled />
                      </div>
                      <div className="col-lg-12">
                        <div className="billing-info mb-20">
                          <label>Address</label>
                          <input
                            className="billing-address"
                            placeholder="House number and street name"
                            type="text"
                            name="address"
                            onChange={handleChange}
                            defaultValue={loggedUser?.address}
                            required
                          />
                          {formErrors.address && (
                            <span style={{ color: "red" }}>
                              {formErrors.address}
                            </span>
                          )}
                          <input
                            placeholder="Apartment, suite, unit etc."
                            type="text"
                            name="apartment"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <Autocomplete
                          options={cities}
                          renderInput={(params) => (
                            <TextField {...params} label="City" />
                          )}
                          onChange={(event, value) =>
                            handleCityChange(event, value)
                          }
                          required
                        />
                        {formErrors.city && (
                          <span style={{ color: "red" }}>
                            {formErrors.city}
                          </span>
                        )}
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Postcode / ZIP</label>
                          <input
                            type="text"
                            name="postalCode"
                            onChange={handleChange}
                            required
                          />
                          {formErrors.postalCode && (
                            <span style={{ color: "red" }}>
                              {formErrors.postalCode}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Phone</label>
                          <input
                            type="text"
                            name="phone"
                            onChange={handleChange}
                            defaultValue={loggedUser?.phone}
                            required
                          />
                          {formErrors.phone && (
                            <span style={{ color: "red" }}>
                              {formErrors.phone}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Email Address</label>
                          <input
                            type="text"
                            name="email"
                            onChange={handleChange}
                            defaultValue={loggedUser?.email}
                            required
                          />
                          {formErrors.email && (
                            <span style={{ color: "red" }}>
                              {formErrors.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="billing-info mb-20">
                        <label>Shipping Method</label>
                        <select
                          name="shipping"
                          onChange={handleChange}
                          defaultValue={-1}
                          required
                        >
                          <option value="-1" key="-1" disabled>
                            choose shipping method
                          </option>
                          <option value="1" key="1">
                            Shipping
                          </option>
                          <option value="2" key="2">
                            Pickup
                          </option>
                        </select>
                        {formErrors.shipping && (
                          <span style={{ color: "red" }}>
                            {formErrors.shipping}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="billing-info mb-20">
                        <label>Payment Method</label>
                        <select
                          name="payment"
                          onChange={handleChange}
                          defaultValue={-1}
                          required
                        >
                          <option value="-1" key="-1" disabled>
                            choose payment method
                          </option>
                          <option value="1" key="1">
                            PayPal
                          </option>
                          <option value="2" key="2">
                            Cash
                          </option>
                        </select>
                        {formErrors.payment && (
                          <span style={{ color: "red" }}>
                            {formErrors.payment}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="additional-info-wrap">
                      <h4>Additional information</h4>
                      <div className="additional-info">
                        <label>Order notes</label>
                        <textarea
                          placeholder="Notes about your order, e.g. special notes for delivery. "
                          name="notes"
                          onChange={handleChange}
                          defaultValue={""}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-5">
                  <div className="your-order-area">
                    <h3>Your order</h3>
                    <div className="your-order-wrap gray-bg-4">
                      <div className="your-order-product-info">
                        <div className="your-order-top">
                          <ul>
                            <li>Product</li>
                            <li>Total</li>
                          </ul>
                        </div>
                        <div className="your-order-middle">
                          <ul>
                            {cartItems.map((cartItem, key) => {
                              return (
                                <li key={key}>
                                  <span className="order-middle-left">
                                    {cartItem.name} X {cartItem.quantity}
                                  </span>{" "}
                                  <span className="order-price">
                                    ₪
                                    {(
                                      cartItem.price * cartItem.quantity
                                    ).toFixed(2)}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        <div className="your-order-bottom">
                          <ul>
                            <li className="your-order-shipping">Shipping</li>
                            <li>Free shipping</li>
                          </ul>
                        </div>
                        <div className="your-order-total">
                          <ul>
                            <li className="order-total">Total</li>
                            <li>{"₪" + totalPrice.toFixed(2)}</li>
                          </ul>
                        </div>
                      </div>
                      <div className="payment-method"></div>
                    </div>
                    <div className="place-order mt-25">
                      {formData.payment === "2" && (
                        <button className="btn-hover" onClick={placeOrder}>
                          Place Order
                        </button>
                      )}
                      {isPlaceOrderValid && formData.payment === "1" && (
                        <PayPalScriptProvider options={initialOptions}>
                          <Paypal
                            formData={formData}
                            cartItems={cartItems}
                            loggedUser={loggedUser}
                          />
                        </PayPalScriptProvider>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cash"></i>
                    </div>
                    <div className="item-empty-area__text">
                      No items found in cart to checkout <br />{" "}
                      <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                        Shop Now
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
export default Checkout;
