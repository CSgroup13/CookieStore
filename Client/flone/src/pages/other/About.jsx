import { Fragment } from "react";
import { useLocation } from "react-router-dom";
import SEO from "../../components/seo";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import SectionTitleWithText from "../../components/section-title/SectionTitleWithText";
import LayoutThree from "../../layouts/LayoutThree";

const About = () => {
  let { pathname } = useLocation();

  return (
    <Fragment>
      <SEO
        titleTemplate="About us"
        description="About page of flone react minimalist eCommerce template."
      />
      <LayoutThree headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "About us", path: process.env.PUBLIC_URL + pathname }
          ]}
        />
        {/* section title with text */}
        <SectionTitleWithText spaceTopClass="pt-100" spaceBottomClass="pb-95" />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src={process.env.PUBLIC_URL + "/assets/img/cookies_images/aboutImg.jpg"}
            style={{
              width: "40%",
              height: "auto",
              maxWidth: "100%",
              borderRadius: "25%",
              objectFit: "cover", // This ensures the image covers the circular area
            }}
            alt="About us"
          />
        </div>
      </LayoutThree>
    </Fragment>
  );
};

export default About;
