import PropTypes from "prop-types";
import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import clsx from "clsx";
import Rating from "./sub-components/ProductRating";
import ProductModal from "./ProductModal";
import { addToCart } from "../../store/slices/cart-slice";
import { addToWishlist } from "../../store/slices/wishlist-slice";
import { addToCompare } from "../../store/slices/compare-slice";
import cogoToast from "cogo-toast";
import ProductModalEdit from "./ProductModalEdit";

const ProductGridListSingle = ({
  product,
  cartItem,
  wishlistItem,
  compareItem,
  spaceBottomClass,
}) => {
  const [modalShow, setModalShow] = useState(false);
  const { isAdmin, loggedUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  return (
    <Fragment>
      <div className={clsx("product-wrap", spaceBottomClass)}>
        <div className="product-img">
          <Link onClick={() => setModalShow(true)}>
            <img className="default-img" src={product.image} alt="" />
          </Link>
          {product.new ? (
            <div className="product-img-badges">
              <span className="purple">New</span>
            </div>
          ) : (
            ""
          )}
          <div className="product-action">
            <div className="pro-same-action pro-wishlist">
              <button
                className={wishlistItem !== undefined ? "active" : ""}
                disabled={wishlistItem !== undefined}
                title={
                  wishlistItem !== undefined
                    ? "Added to wishlist"
                    : "Add to wishlist"
                }
                onClick={() =>
                  loggedUser?.firstName
                    ? dispatch(
                        addToWishlist({ ...product, userId: loggedUser.id })
                      )
                    : cogoToast.error("Must be logged in to add to Wishlist", {
                        position: "bottom-left",
                      })
                }
              >
                <i className="pe-7s-like" />
              </button>
            </div>
            <div className="pro-same-action pro-cart">
              <button
                onClick={() => dispatch(addToCart(product))}
                className={
                  cartItem !== undefined && cartItem.quantity > 0
                    ? "active"
                    : ""
                }
                disabled={cartItem !== undefined && cartItem.quantity > 0}
                title={cartItem !== undefined ? "Added to cart" : "Add to cart"}
              >
                {" "}
                <i className="pe-7s-cart"></i>{" "}
                {cartItem !== undefined && cartItem.quantity > 0
                  ? "Added"
                  : "Add to cart"}
              </button>
            </div>
            <div className="pro-same-action pro-quickview">
              <button onClick={() => setModalShow(true)} title="Quick View">
                <i className="pe-7s-look" />
              </button>
            </div>
          </div>
        </div>
        <div className="product-content text-center">
          <h3>
            <Link onClick={() => setModalShow(true)}>{product.name}</Link>
          </h3>
          {product.rate && product.rate > 0 ? (
            <div className="product-rating">
              <Rating ratingValue={product.rate} />
            </div>
          ) : (
            ""
          )}
          <div className="product-price">
            <span>₪{product.price} </span>
          </div>
        </div>
      </div>
      <div className="shop-list-wrap mb-30">
        <div className="row">
          <div className="col-xl-4 col-md-5 col-sm-6">
            <div className="product-list-image-wrap">
              <div className="product-img">
                <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
                  <img
                    className="default-img img-fluid"
                    src={product.image}
                    alt=""
                  />
                </Link>
                {product.new ? (
                  <div className="product-img-badges">
                    <span className="purple">New</span>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          <div className="col-xl-8 col-md-7 col-sm-6">
            <div className="shop-list-content">
              <h3>
                <Link onClick={() => setModalShow(true)}>{product.name}</Link>
              </h3>
              <div className="product-list-price">
                <span>₪{product.price}</span>
              </div>
              {product.rate && product.rate > 0 ? (
                <div className="rating-review">
                  <div className="product-list-rating">
                    <Rating ratingValue={product.rate} />
                  </div>
                </div>
              ) : (
                ""
              )}
              {product.description ? <p>{product.description}</p> : ""}

              <div className="shop-list-actions d-flex align-items-center">
                <div className="shop-list-btn btn-hover">
                  <button
                    onClick={() => dispatch(addToCart(product))}
                    className={
                      cartItem !== undefined && cartItem.quantity > 0
                        ? "active"
                        : ""
                    }
                    disabled={cartItem !== undefined && cartItem.quantity > 0}
                    title={
                      cartItem !== undefined ? "Added to cart" : "Add to cart"
                    }
                  >
                    {" "}
                    <i className="pe-7s-cart"></i>{" "}
                    {cartItem !== undefined && cartItem.quantity > 0
                      ? "Added"
                      : "Add to cart"}
                  </button>
                </div>
                <div className="shop-list-wishlist ml-10">
                  <button
                    className={wishlistItem !== undefined ? "active" : ""}
                    disabled={wishlistItem !== undefined}
                    title={
                      wishlistItem !== undefined
                        ? "Added to wishlist"
                        : "Add to wishlist"
                    }
                    onClick={() =>
                      loggedUser?.firstName
                        ? dispatch(
                            addToWishlist({ ...product, userId: loggedUser.id })
                          )
                        : cogoToast.error(
                            "Must be logged in to add to Wishlist",
                            {
                              position: "bottom-left",
                            }
                          )
                    }
                  >
                    <i className="pe-7s-like" />
                  </button>
                </div>
                <div className="shop-list-compare ml-10">
                  <button
                    className={compareItem !== undefined ? "active" : ""}
                    disabled={compareItem !== undefined}
                    title={
                      compareItem !== undefined
                        ? "Added to compare"
                        : "Add to compare"
                    }
                    onClick={() => dispatch(addToCompare(product))}
                  >
                    <i className="pe-7s-shuffle" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* product modal */}
      {isAdmin ? (
        <ProductModalEdit
          show={modalShow}
          onHide={() => setModalShow(false)}
          product={product}
          wishlistItem={wishlistItem}
          compareItem={compareItem}
        />
      ) : (
        <ProductModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          product={product}
          wishlistItem={wishlistItem}
          compareItem={compareItem}
        />
      )}
    </Fragment>
  );
};

ProductGridListSingle.propTypes = {
  cartItem: PropTypes.shape({}),
  compareItem: PropTypes.shape({}),
  currency: PropTypes.shape({}),
  product: PropTypes.shape({}),
  spaceBottomClass: PropTypes.string,
  wishlistItem: PropTypes.shape({}),
};

export default ProductGridListSingle;
