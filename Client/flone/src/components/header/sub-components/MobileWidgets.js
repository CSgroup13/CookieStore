
const MobileWidgets = () => {

  const openWhatsAppChat = () => {
    const phoneNumber = "+972505240094"; // Your WhatsApp number
    const message = "היי, יש לי שאלה בקשר להזמנת עוגיות באתר"; // Default message
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="offcanvas-widget-area">
      <div className="off-canvas-contact-widget">
        <div className="header-contact-info">
          <ul className="header-contact-info__list">
            <li>
              <i className="fa fa-phone"></i>{" "}
              <a href="tel://+972505240094">050-5240094</a>
            </li>
            <li>
              <i className="fa fa-envelope"></i>{" "}
              <a href="mailto:info@yourdomain.com">cookiesaddiction1@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>
      {/*Off Canvas Widget Social Start*/}
      <div className="off-canvas-widget-social">
        <a href="https://www.instagram.com/cookiesaddicttion/" target="_blank">
          <i className="fa fa-instagram" style={{ fontSize: "26px" }} />
        </a>
        <a onClick={openWhatsAppChat}>
          <i className="fa fa-whatsapp" style={{ fontSize: "26px" }} />
        </a>
      </div>
      {/*Off Canvas Widget Social End*/}
    </div>
  );
};

export default MobileWidgets;
