import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutThree from "../../layouts/LayoutThree";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import {
  addToCart,
  decreaseQuantity,
  deleteFromCart,
  deleteAllFromCart,
  setDiscount,
} from "../../store/slices/cart-slice";
import ProductModal from "../../components/product/ProductModal";
import cogoToast from "cogo-toast";

const Cart = () => {
  const dispatch = useDispatch();
  let { pathname } = useLocation();
  const { totalPrice, cartItems, discount } = useSelector(
    (state) => state.cart
  );
  const [couponValue, setCouponValue] = useState("");
  const validCoupon = "DISCOUNT10";

  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { compareItems } = useSelector((state) => state.compare);
  const [modalShow, setModalShow] = useState(false);

  // Function to handle input value change
  const handleChange = (event) => {
    setCouponValue(event.target.value);
  };

  // Apply coupon
  const handleCoupon = (event) => {
    event.preventDefault();
    if (couponValue === validCoupon && discount === 0) {
      dispatch(setDiscount(10));
      cogoToast.success(`Coupon has been applied!`, {
        position: "bottom-left",
      });
    } else if (couponValue !== validCoupon) {
      cogoToast.error(`Invalid coupon!`, {
        position: "bottom-left",
      });
    } else if (discount !== 0) {
      cogoToast.error(`Coupon already applied.`, {
        position: "bottom-left",
      });
    }
  };

  return (
    <Fragment>
      <SEO
        titleTemplate="Cart"
        description="Cart page of flone react minimalist eCommerce template."
      />

      <LayoutThree headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "Cart", path: process.env.PUBLIC_URL + pathname },
          ]}
        />
        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            {cartItems && cartItems.length >= 1 ? (
              <Fragment>
                <h3 className="cart-page-title">Your cart items</h3>
                <div className="row">
                  <div className="col-12">
                    <div className="table-content table-responsive cart-table-content">
                      <table>
                        <thead>
                          <tr>
                            <th>Image</th>
                            <th>Product Name</th>
                            <th>Unit Price</th>
                            <th>Qty</th>
                            <th>Subtotal</th>
                            <th>action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cartItems.map((cartItem) => (
                            <tr key={cartItem.id}>
                              <td className="product-thumbnail">
                                <Link onClick={() => setModalShow(true)}>
                                  <img
                                    className="img-fluid"
                                    src={process.env.PUBLIC_URL+cartItem.image}
                                    alt=""
                                  />
                                </Link>
                              </td>
                              <td className="product-name">
                                <Link onClick={() => setModalShow(true)}>
                                  {cartItem.name}
                                </Link>
                              </td>

                              <td className="product-price-cart">
                                <span className="amount">
                                  ₪{cartItem.price}
                                </span>
                              </td>

                              <td className="product-quantity">
                                <div className="cart-plus-minus">
                                  <button
                                    className="dec qtybutton"
                                    onClick={() =>
                                      dispatch(decreaseQuantity(cartItem))
                                    }
                                  >
                                    -
                                  </button>
                                  <input
                                    className="cart-plus-minus-box"
                                    type="text"
                                    value={cartItem.quantity}
                                    readOnly
                                  />
                                  <button
                                    className="inc qtybutton"
                                    onClick={() =>
                                      dispatch(
                                        addToCart({
                                          ...cartItem,
                                          quantity: 1,
                                        })
                                      )
                                    }
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                              <td className="product-subtotal">
                                ₪{cartItem.price * cartItem.quantity}
                              </td>
                              <td className="product-remove">
                                <button
                                  onClick={() =>
                                    dispatch(deleteFromCart(cartItem.id))
                                  }
                                >
                                  <i className="fa fa-times"></i>
                                </button>
                              </td>
                              {/* product modal */}
                              <ProductModal
                                show={modalShow}
                                onHide={() => setModalShow(false)}
                                product={cartItem}
                                wishlistItem={wishlistItems.find(
                                  (wishlistItem) =>
                                    wishlistItem.id === cartItem.id
                                )}
                                compareItem={compareItems.find(
                                  (compareItem) =>
                                    compareItem.id === cartItem.id
                                )}
                              />
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="cart-shiping-update-wrapper">
                      <div className="cart-shiping-update">
                        <Link
                          to={process.env.PUBLIC_URL + "/shop-grid-standard"}
                        >
                          Continue Shopping
                        </Link>
                      </div>
                      <div className="cart-clear">
                        <button onClick={() => dispatch(deleteAllFromCart())}>
                          Clear Shopping Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-4 col-md-6">
                    <div className="discount-code-wrapper">
                      <div className="title-wrap">
                        <h4 className="cart-bottom-title section-bg-gray">
                          Use Coupon Code
                        </h4>
                      </div>
                      <div className="discount-code">
                        <p>Enter your coupon code if you have one.</p>
                        <form onSubmit={handleCoupon}>
                          <input
                            type="text"
                            required
                            name="name"
                            value={couponValue}
                            onChange={handleChange}
                          />
                          <button className="cart-btn-2" type="submit">
                            Apply Coupon
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-12">
                    <div className="grand-totall">
                      <div className="title-wrap">
                        <h4 className="cart-bottom-title section-bg-gary-cart">
                          Cart Total
                        </h4>
                      </div>
                      <h5>
                        Total products <span>{cartItems.length} cookies</span>
                      </h5>

                      <h4 className="grand-totall-title">
                        Total Price<span>₪{totalPrice.toFixed(2)}</span>
                      </h4>

                      <Link to={process.env.PUBLIC_URL + "/checkout"}>
                        Proceed to Checkout
                      </Link>
                    </div>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cart"></i>
                    </div>
                    <div className="item-empty-area__text">
                      No items found in cart <br />{" "}
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

export default Cart;
