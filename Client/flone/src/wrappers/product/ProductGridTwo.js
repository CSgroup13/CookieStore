import { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { getBestSellers } from "../../helpers/product";
import ProductGridSingleTwo from "../../components/product/ProductGridSingleTwo";


const ProductGridTwo = ({
  spaceBottomClass,
  colorClass,
  titlePriceClass,
  category,
  type,
  limit,
}) => {
  const currency = useSelector((state) => state.currency);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { compareItems } = useSelector((state) => state.compare);
  const { products } = useSelector((state) => state.product);

  const [bestSellersProducts, setBestSellersProducts] = useState([]);

  useEffect(() => {
    getBestSellers()
      .then((data) => {
        const bestSellersFromStore = products.filter((product) =>
          data.some((bestSeller) => bestSeller.id === product.id)
        );
        setBestSellersProducts(bestSellersFromStore);
      })
      .catch((error) => {
        console.error("Error fetching best sellers:", error);
      });
  }, []);

  return (
    <Fragment>
      {bestSellersProducts?.map((product) => {
        return (
          <div className="col-xl-3 col-md-6 col-lg-4 col-sm-6" key={product.id}>
            <ProductGridSingleTwo
              spaceBottomClass={spaceBottomClass}
              colorClass={colorClass}
              product={product}
              cartItem={cartItems.find(
                (cartItem) => cartItem.id === product.id
              )}
              wishlistItem={wishlistItems.find(
                (wishlistItem) => wishlistItem.id === product.id
              )}
              compareItem={compareItems.find(
                (compareItem) => compareItem.id === product.id
              )}
              titlePriceClass={titlePriceClass}
            />
          </div>
        );
      })}
    </Fragment>
  );
};

ProductGridTwo.propTypes = {
  sliderClassName: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  colorClass: PropTypes.string,
  titlePriceClass: PropTypes.string,
  category: PropTypes.string,
  type: PropTypes.string,
  limit: PropTypes.number,
};

export default ProductGridTwo;
