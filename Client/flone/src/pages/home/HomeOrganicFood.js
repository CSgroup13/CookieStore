import { Fragment } from "react";
import SEO from "../../components/seo";
import LayoutThree from "../../layouts/LayoutThree";
import HeroSliderFive from "../../wrappers/hero-slider/HeroSliderFive";
import TabProductFour from "../../wrappers/product/TabProductFour";
import TestimonialOne from "../../wrappers/testimonial/TestimonialOne";

const HomeOrganicFood = () => {
  return (
    <Fragment>
      <SEO
        titleTemplate="Organic Food Home"
        description="Organic food home of flone react minimalist eCommerce template."
      />
      <LayoutThree
        headerTop="visible"
        headerContainerClass="container-fluid"
        headerBorderStyle="fluid-border"
        headerPaddingClass="header-padding-2"
      >
        {/* hero slider */}
        <HeroSliderFive spaceLeftClass="ml-70" spaceRightClass="mr-70" />       
        {/* tab product */}
        <TabProductFour
          spaceBottomClass="pb-100"
          productTabClass="product-tab-fruits"
        />
        {/* testimonial */}
        <TestimonialOne
          spaceBottomClass="pb-95"
          spaceLeftClass="ml-70"
          spaceRightClass="mr-70"
          bgColorClass="bg-gray-3"
        />
      </LayoutThree>
    </Fragment>
  );
};

export default HomeOrganicFood;
