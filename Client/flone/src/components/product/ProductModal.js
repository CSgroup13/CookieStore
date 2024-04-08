import { useState } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Rating from "./sub-components/ProductRating";
import { addToCart } from "../../store/slices/cart-slice";
import { addToWishlist } from "../../store/slices/wishlist-slice";
import { addToCompare } from "../../store/slices/compare-slice";
import cogoToast from "cogo-toast";

function ProductModal({ product, show, onHide, wishlistItem, compareItem }) {
  const dispatch = useDispatch();
  const { loggedUser } = useSelector((state) => state.user);
  const [quantityCount, setQuantityCount] = useState(1);
  const onCloseModal = () => {
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={onCloseModal}
      className="product-quickview-modal-wrapper"
    >
      <Modal.Header closeButton></Modal.Header>

      <div className="modal-body">
        <div className="row">
          <div className="col-md-5 col-sm-12 col-xs-12">
            <div className="product-large-image-wrapper">
              <img src={product.image} className="img-fluid" alt="Product" />
            </div>
          </div>
          <div className="col-md-7 col-sm-12 col-xs-12">
            <div className="product-details-content quickview-content">
              <h2>{product.name}</h2>
              {product.rate && product.rate > 0 ? (
                <div className="pro-details-rating-wrap">
                  <div className="pro-details-rating">
                    <Rating ratingValue={product.rate} />
                  </div>
                </div>
              ) : (
                ""
              )}
              <div className="pro-details-list">
                <p>{product.description}</p>
              </div>
              <div className="pro-details-list">
                <span>Ingredients: </span>
                <span>{product.ingredients.join(", ")}</span>
              </div>
              <div
                dir="rtl"
                style={{
                  color: "brown",
                  fontSize: "35px",
                  textAlign: "center",
                }}
              >
                ₪{product.price}
              </div>
              <div className="pro-details-quality">
                <div className="cart-plus-minus">
                  <button
                    onClick={() =>
                      setQuantityCount(
                        quantityCount > 1 ? quantityCount - 1 : 1
                      )
                    }
                    className="dec qtybutton"
                  >
                    -
                  </button>
                  <input
                    className="cart-plus-minus-box"
                    type="text"
                    value={quantityCount}
                    readOnly
                  />
                  <button
                    onClick={() => setQuantityCount(quantityCount + 1)}
                    className="inc qtybutton"
                  >
                    +
                  </button>
                </div>
                <div className="pro-details-cart btn-hover">
                  <button
                    onClick={() =>
                      dispatch(
                        addToCart({
                          ...product,
                          quantity: quantityCount,
                        })
                      )
                    }
                  >
                    {" "}
                    Add To Cart{" "}
                  </button>
                </div>
                <div className="pro-details-wishlist">
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
                <div className="pro-details-compare">
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
    </Modal>
  );
}

ProductModal.propTypes = {
  onHide: PropTypes.func,
  product: PropTypes.shape({}),
  show: PropTypes.bool,
  wishlistItem: PropTypes.shape({}),
  compareItem: PropTypes.shape({}),
};

export default ProductModal;
