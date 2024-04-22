import React from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import api, { postData } from "src/utils/api";
import cogoToast from "cogo-toast";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";
import { useDispatch } from "react-redux";
import { deleteAllFromCart } from "src/store/slices/cart-slice";
import { sub } from "date-fns";
import { useSelector } from "react-redux";
import { setDiscount } from "../../store/slices/cart-slice";
import { FUNDING } from "@paypal/react-paypal-js";
// import database from "src/config";
import { getDatabase, push, ref } from "firebase/database";
import { app } from "src/firbaseConfig";
import { addToOrders } from "src/store/slices/order-slice";

const Paypal = ({ formData, cartItems, loggedUser }) => {
  const orders = useSelector((state) => state.orders);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [{ isPending }] = usePayPalScriptReducer();
  const { totalPrice } = useSelector((state) => state.cart);

  const { orderItems } = cartItems.reduce(
    (accumulator, currentItem) => {
      const orderItem = {
        productId: currentItem.id,
        quantity: currentItem.quantity,
      };
      accumulator.orderItems.push(orderItem);
      return accumulator;
    },
    { orderItems: [] }
  );

  const orderDetails = {
    userId: loggedUser?.id || -1,
    totalPrice,
    date: new Date(Date.now()),
    shippingAddress: `${formData.address}, ${formData.apartment}, ${formData.city}, Israel, ${formData.postalCode}`,
    shippingMethod: Number(formData.shipping),
    paymentMethod: Number(formData.payment),
    notes: formData.notes,
    status: 1,
    orderItems: orderItems,
  };
  const onCreateOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: totalPrice.toFixed(2),
          },
        },
      ],
    });
  };

  const onApproveOrder = (data, actions) => {
    return actions.order
      .capture()
      .then((details) => {
        const name = details.payer.name.given_name;
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
            Shipping Method: ${formData.shipping === "1" ? "Shipping" : "Pickup"
              }
            Payment Method: "Paypal"
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
                  from_email: "cookiesaddiction1@gmail.com",
                  from_name: "Cookies Addiction",
                  message: `Your delicious cookies order (Order Number ${order.id}) has been successfully placed!🍪🎉 
        Thank you for choosing us!`,
                },
                "Ov1O19nU4lvvYar64"
              )
              .then(() => {
                // Notification to the user
                cogoToast.success(
                  `${name} Your Order successfully placed!🍪🎉`,
                  {
                    position: "top-right",
                  }
                );
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
                    dispatch(deleteAllFromCart());
                    dispatch(addToOrders(orderDetails));
                    dispatch(setDiscount(0));
                    const db = getDatabase(app);
                    const newNotification = {
                      id: order.id,
                      title: "You have new order",
                      description: `from ${formData.firstName + " " + formData.lastName
                        }`,
                      avatar: null,
                      type: "order_placed",
                      createdAt: sub(new Date(), {
                        days: 0,
                        hours: 0,
                        minutes: 0,
                      }),
                      isUnRead: true,
                    };
                    push((ref(db), newNotification));
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
      })
      .catch((error) => {
        cogoToast.error(error.message, { position: "bottom-left" });
      });
  };

  return (
    <div className="checkout">
      {isPending ? (
        <p>LOADING...</p>
      ) : (
        <PayPalButtons
          style={{
            layout: "vertical",
            shape: "pill",
          }}
          fundingSource={FUNDING.PAYPAL}
          createOrder={(data, actions) => onCreateOrder(data, actions)}
          onApprove={(data, actions) => onApproveOrder(data, actions)}
        />
      )}
    </div>
  );
};

export default Paypal;
