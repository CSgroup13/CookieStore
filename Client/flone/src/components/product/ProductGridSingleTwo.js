import PropTypes from "prop-types";
import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import ProductModal from "./ProductModal";
import { addToCart } from "../../store/slices/cart-slice";
import { addToWishlist } from "../../store/slices/wishlist-slice";
import { addToCompare } from "../../store/slices/compare-slice";
import cogoToast from "cogo-toast";

const ProductGridSingleTwo = ({
  product,
  cartItem,
  wishlistItem,
  compareItem,
  spaceBottomClass,
  colorClass,
}) => {
  const [modalShow, setModalShow] = useState(false);
  const { loggedUser } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  return (
    <Fragment>
      <div className={clsx("product-wrap-2", spaceBottomClass, colorClass)}>
        <div className="product-img">
          <Link onClick={() => setModalShow(true)}>
            <img className="default-img" src={process.env.PUBLIC_URL+product.image} alt="" />
          </Link>
          <div className="product-action-2">
            <button
              onClick={() => dispatch(addToCart(product))}
              className={
                cartItem !== undefined && cartItem.quantity > 0 ? "active" : ""
              }
              disabled={cartItem !== undefined && cartItem.quantity > 0}
              title={cartItem !== undefined ? "Added to cart" : "Add to cart"}
            >
              {" "}
              <i className="fa fa-shopping-cart"></i>{" "}
            </button>
            <button onClick={() => setModalShow(true)} title="Quick View">
              <i className="fa fa-eye"></i>
            </button>
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
              <i className="fa fa-retweet"></i>
            </button>
          </div>
        </div>
        <div className="product-content-2">
          <div className={"title-price-wrap-2"}>
            <h3>
              <Link onClick={() => setModalShow(true)}>{product.name}</Link>
            </h3>
            <div className="price-2">
              <span>₪{product.price}</span>
            </div>
          </div>
          <div className="pro-wishlist-2">
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
              <i className="fa fa-heart-o" />
            </button>
          </div>
        </div>
      </div>
      {/* product modal */}
      <ProductModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={product}
        wishlistItem={wishlistItem}
        compareItem={compareItem}
      />
    </Fragment>
  );
};

ProductGridSingleTwo.propTypes = {
  cartItem: PropTypes.shape({}),
  compareItem: PropTypes.shape({}),
  wishlistItem: PropTypes.shape({}),
  currency: PropTypes.shape({}),
  product: PropTypes.shape({}),
  sliderClassName: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  colorClass: PropTypes.string,
  titlePriceClass: PropTypes.string,
};

export default ProductGridSingleTwo;
