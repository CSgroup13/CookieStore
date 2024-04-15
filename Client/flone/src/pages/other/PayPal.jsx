import React from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import api, { postData } from "src/utils/api";
import cogoToast from "cogo-toast";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";
import { useDispatch } from "react-redux";
import { deleteAllFromCart } from "src/store/slices/cart-slice";
import { faker } from "@faker-js/faker";
import { addNotification } from "src/store/slices/notifications-slice";
import { sub } from "date-fns";

const Paypal = ({ formData, cartItems, loggedUser }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [{ isPending }] = usePayPalScriptReducer();
  const { totalPrice, orderItems } = cartItems.reduce(
    (accumulator, currentItem) => {
      const itemPrice = currentItem.price * currentItem.quantity;
      const orderItem = {
        productId: currentItem.id,
        quantity: currentItem.quantity,
      };
      accumulator.orderItems.push(orderItem);
      accumulator.totalPrice += itemPrice;
      return accumulator;
    },
    { totalPrice: 0, orderItems: [] }
  );

  const orderDetails = {
    userId: loggedUser?.id || -1,
    totalPrice,
    date: new Date(Date.now()),
    shippingAddress: `${formData.address}, ${formData.apartment}, ${formData.city}, Israel, ${formData.postalCode}`,
    shippingMethod: Number(formData.shipping),
    paymentMethod: Number(formData.payment),
    notes: formData.notes,
    orderItems: orderItems,
  };
  const onCreateOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: totalPrice,
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
            Shipping Method: ${
              formData.shipping === "1" ? "Shipping" : "Pickup"
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
                    const newNotification = {
                      id: faker.string.uuid(),
                      title: "You have new order",
                      description: `from ${
                        formData.firstName + " " + formData.lastName
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
                    dispatch(addNotification(newNotification));
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
          style={{ layout: "vertical", shape: "pill" }}
          createOrder={(data, actions) => onCreateOrder(data, actions)}
          onApprove={(data, actions) => onApproveOrder(data, actions)}
        />
      )}
    </div>
  );
};

export default Paypal;
