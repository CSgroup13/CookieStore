import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "react-router-dom";

const FooterTwo = ({
  backgroundColorClass,
  spaceLeftClass,
  spaceRightClass,
  footerTopBackgroundColorClass,
  footerTopSpaceTopClass,
  footerTopSpaceBottomClass,
  footerLogo,
  backgroundImage
}) => {

  const openWhatsAppChat = () => {
    const phoneNumber = "+972505240094"; // Your WhatsApp number
    const message = "היי, יש לי שאלה בקשר להזמנת עוגיות באתר"; // Default message
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <footer
      className={clsx("footer-area", backgroundColorClass, spaceLeftClass, spaceRightClass, backgroundImage && "bg-img")}
      style={{
        backgroundImage: ` ${backgroundImage
          ? `url(${process.env.PUBLIC_URL + backgroundImage})`
          : `url()`
          }`
      }}
    >
      <div
        className={clsx("footer-top text-center", footerTopBackgroundColorClass, footerTopSpaceTopClass, footerTopSpaceBottomClass)}
      >
        <div className="container">
          <div className="footer-logo">
            <Link to={process.env.PUBLIC_URL}>
              <img
                alt=""
                src={
                  process.env.PUBLIC_URL +
                  `${footerLogo ? footerLogo : "/assets/img/logo/logo.png"}`
                }
              />
            </Link>
          </div>
          <div className="footer-social" style={{ marginTop: "20px" }}>
            <ul>
              <li>
                <a href="https://www.instagram.com/cookiesaddicttion/" target="_blank">
                  <i className="fa fa-instagram" style={{ fontSize: "26px" }} />
                </a>
              </li>
              <li>
                <a onClick={openWhatsAppChat}>
                  <i className="fa fa-whatsapp" style={{ fontSize: "26px" }} />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom text-center">
        <div className="container">
        </div>
      </div>
    </footer>
  );
};

FooterTwo.propTypes = {
  backgroundColorClass: PropTypes.string,
  copyrightColorClass: PropTypes.string,
  footerLogo: PropTypes.string,
  backgroundImage: PropTypes.string,
  footerTopBackgroundColorClass: PropTypes.string,
  footerTopSpaceBottomClass: PropTypes.string,
  footerTopSpaceTopClass: PropTypes.string,
  spaceLeftClass: PropTypes.string,
  spaceRightClass: PropTypes.string
};

export default FooterTwo;
