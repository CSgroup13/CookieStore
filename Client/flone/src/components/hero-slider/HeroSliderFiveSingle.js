import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const HeroSliderFiveSingle = ({ data }) => {
  return (
    <div
      className="single-slider-2 slider-height-1 slider-height-res15 d-flex align-items-center slider-height-res bg-img"
      style={{
        backgroundImage: `url(/assets/img/cookies_images/main_image.jpg)`,
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-xl-6 col-lg-6 col-md-7 ms-auto">
            <div className="slider-content-2 slider-content-fruits slider-animated-1">
              <h3 className="animated">{data.title}</h3>
              <h1 className="animated" style={{ color: "white" }}>
                {data.subtitle}
              </h1>
              <div className="slider-btn btn-hover">
                <Link
                  className="animated"
                  style={{
                    backgroundColor: "white",
                    color: "pink",
                    borderColor: "white",
                    borderRadius: "15px",
                  }}
                  to={process.env.PUBLIC_URL + data.url}
                >
                  SHOP NOW
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

HeroSliderFiveSingle.propTypes = {
  data: PropTypes.shape({}),
};

export default HeroSliderFiveSingle;
