import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutThree from "../../layouts/LayoutThree";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { addToCart } from "../../store/slices/cart-slice";
import { deleteFromWishlist, deleteAllFromWishlist } from "../../store/slices/wishlist-slice"

const Wishlist = () => {
  const dispatch = useDispatch();
  let { pathname } = useLocation();

  const { loggedUser } = useSelector((state) => state.user);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { cartItems } = useSelector((state) => state.cart);


  return (
    <Fragment>
      <SEO
        titleTemplate="Wishlist"
        description="Wishlist page of flone react minimalist eCommerce template."
      />
      <LayoutThree headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "Wishlist", path: process.env.PUBLIC_URL + pathname }
          ]}
        />
        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            {wishlistItems && wishlistItems.length >= 1 ? (
              <Fragment>
                <h3 className="cart-page-title">Your wishlist items</h3>
                <div className="row">
                  <div className="col-12">
                    <div className="table-content table-responsive cart-table-content">
                      <table>
                        <thead>
                          <tr>
                            <th>Image</th>
                            <th>Product Name</th>
                            <th>Unit Price</th>
                            <th>Add To Cart</th>
                            <th>action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {wishlistItems.map((wishlistItem, key) => {
                            const cartItem = cartItems.find(
                              item => item.id === wishlistItem.id
                            );
                            return (
                              <tr key={key}>
                                <td className="product-thumbnail">
                                  <img
                                    className="img-fluid"
                                    src={
                                      process.env.PUBLIC_URL +
                                      wishlistItem.image
                                    }
                                    alt=""
                                  />
                                </td>
                                <td className="product-name text-center">
                                  {wishlistItem.name}
                                </td>
                                <td className="product-price-cart">
                                  <span dir="rtl" className="amount">
                                    ₪{wishlistItem.price}
                                  </span>
                                </td>

                                <td className="product-wishlist-cart">
                                  <button
                                    onClick={() =>
                                      dispatch(addToCart(wishlistItem))
                                    }
                                    className={
                                      cartItem !== undefined &&
                                        cartItem.quantity > 0
                                        ? "active"
                                        : ""
                                    }
                                    disabled={
                                      cartItem !== undefined &&
                                      cartItem.quantity > 0
                                    }
                                    title={
                                      wishlistItem !== undefined
                                        ? "Added to cart"
                                        : "Add to cart"
                                    }
                                  >
                                    {cartItem !== undefined &&
                                      cartItem.quantity > 0
                                      ? "Added"
                                      : "Add to cart"}
                                  </button>
                                </td>

                                <td className="product-remove">
                                  <button
                                    onClick={() =>
                                      dispatch(deleteFromWishlist({ id: wishlistItem.id, userId: loggedUser.id }))
                                    }
                                  >
                                    <i className="fa fa-times"></i>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
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
                        <button onClick={() => dispatch(deleteAllFromWishlist())}>
                          Clear Wishlist
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-like"></i>
                    </div>
                    <div className="item-empty-area__text">
                      No items found in wishlist <br />{" "}
                      <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                        Add Items
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

export default Wishlist;
