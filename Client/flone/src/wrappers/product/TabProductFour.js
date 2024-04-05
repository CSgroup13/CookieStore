import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import SectionTitleThree from "../../components/section-title/SectionTitleThree";
import ProductGridTwo from "./ProductGridTwo";

const TabProductFour = ({ spaceBottomClass, productTabClass }) => {
  return (
    <div className={clsx("product-area", spaceBottomClass)}>
      <div className="container">
        <SectionTitleThree
          titleText="Featured Product"
          positionClass="text-center"
        />
        <Tab.Container defaultActiveKey="bestSeller">
          <Nav
            variant="pills"
            className={clsx(
              "product-tab-list pt-35 pb-60 text-center",
              productTabClass
            )}
          >
            <Nav.Item>
              <Nav.Link eventKey="bestSeller">
                <h4>Best Sellers</h4>
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="bestSeller">
              <div className="row">
                <ProductGridTwo
                  type="bestSeller"
                  limit={8}
                  spaceBottomClass="mb-25"
                />
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
        <div className="view-more text-center mt-20 toggle-btn6 col-12">
          <Link
            className="loadMore6"
            to={process.env.PUBLIC_URL + "/shop-grid-standard"}
          >
            VIEW MORE PRODUCTS
          </Link>
        </div>
      </div>
    </div>
  );
};

TabProductFour.propTypes = {
  spaceBottomClass: PropTypes.string,
};

export default TabProductFour;
