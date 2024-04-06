import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getDiscountPrice } from "../../../helpers/product";
import { deleteFromCart } from "../../../store/slices/cart-slice";

const MenuCart = () => {
  const dispatch = useDispatch();
  const currency = useSelector((state) => state.currency);
  const { cartItems } = useSelector((state) => state.cart);
  let cartTotalPrice = 0;

  return (
    <div className="shopping-cart-content">
      {cartItems && cartItems.length > 0 ? (
        <Fragment>
          <ul>
            {cartItems.map((item) => {
              const discountedPrice = getDiscountPrice(
                item.price,
                item.discount
              );
              const finalProductPrice = (
                item.price * currency.currencyRate
              ).toFixed(2);
              const finalDiscountedPrice = (
                discountedPrice * currency.currencyRate
              ).toFixed(2);

              discountedPrice != null
                ? (cartTotalPrice += finalDiscountedPrice * item.quantity)
                : (cartTotalPrice += finalProductPrice * item.quantity);

              return (
                <li key={item.id} className="single-shopping-cart">
                  <div className="shopping-cart-img">
                    <div>
                      <img
                        alt=""
                        src={process.env.PUBLIC_URL + item.image}
                        className="img-fluid"
                      />
                    </div>
                  </div>
                  <div className="shopping-cart-title">
                    <h4>
                      <div> {item.name} </div>
                    </h4>
                    <h6>Qty: {item.quantity}</h6>
                    <span>
                      {discountedPrice !== null
                        ? "₪" + finalDiscountedPrice
                        : "₪" + finalProductPrice}
                    </span>
                  </div>
                  <div className="shopping-cart-delete">
                    <button
                      onClick={() => dispatch(deleteFromCart(item.id))}
                    >
                      <i className="fa fa-times-circle" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="shopping-cart-total">
            <h4>
              Total :{" "}
              <span className="shop-total">
                {"₪" + cartTotalPrice.toFixed(2)}
              </span>
            </h4>
          </div>
          <div className="shopping-cart-btn btn-hover text-center">
            <Link className="default-btn" to={process.env.PUBLIC_URL + "/cart"}>
              view cart
            </Link>
            <Link
              className="default-btn"
              to={process.env.PUBLIC_URL + "/checkout"}
            >
              checkout
            </Link>
          </div>
        </Fragment>
      ) : (
        <p className="text-center">No items added to cart</p>
      )}
    </div>
  );
};

export default MenuCart;
