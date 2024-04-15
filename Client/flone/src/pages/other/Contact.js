import { Fragment, useState } from "react";
import { useLocation } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutThree from "../../layouts/LayoutThree";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import emailjs from "emailjs-com";
import cogoToast from "cogo-toast";

const Contact = () => {
  let { pathname } = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    emailjs
      .send(
        "service_toin4ud",
        "template_pi1v48b",
        {
          from_name: formData.name,
          to_name: "Shaked",
          from_email: formData.email,
          to_email: "cookiesaddiction1@gmail.com",
          message:
            "Subject: " +
            formData.subject +
            "\n\n" +
            "Message: " +
            formData.message,
        },
        "Ov1O19nU4lvvYar64"
      )
      .then(() => {
        cogoToast.success("Your Message was sent successfully!", {
          position: "top-right",
        });
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        })
      });
  };
  return (
    <Fragment>
      <SEO
        titleTemplate="Contact"
        description="Contact page of flone react minimalist eCommerce template."
      />
      <LayoutThree headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "Contact", path: process.env.PUBLIC_URL + pathname },
          ]}
        />
        <div className="contact-area pt-100 pb-100">
          <div className="container">
            <div className="custom-row-2">
              <div className="col-12 col-lg-4 col-md-5">
                <div className="contact-info-wrap">
                  <div className="single-contact-info">
                    <div className="contact-icon">
                      <i className="fa fa-phone" />
                    </div>
                    <div className="contact-info-dec">
                      <p>050-524-0094</p>
                    </div>
                  </div>
                  <div className="single-contact-info">
                    <div className="contact-icon">
                      <i className="fa fa-globe" />
                    </div>
                    <div className="contact-info-dec">
                      <p>
                        <a href="mailto:yourname@email.com">
                          cookiesaddiction1@email.com
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="single-contact-info">
                    <div className="contact-icon">
                      <i className="fa fa-map-marker" />
                    </div>
                    <div className="contact-info-dec">
                      <p>Hanafa 5</p>
                      <p>Kadima</p>
                    </div>
                  </div>
                  <div className="contact-social text-center">
                    <h3>Follow Us</h3>
                    <ul>
                      <li>
                        <a href="https://www.instagram.com/cookiesaddicttion/" target="_blank">
                          <i className="fa fa-instagram" style={{ fontSize: "26px" }} />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-8 col-md-7">
                <div className="contact-form">
                  <div className="contact-title mb-30">
                    <h2>Get In Touch</h2>
                  </div>
                  <form className="contact-form-style" onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-lg-6">
                        <input
                          name="name"
                          placeholder="Name*"
                          type="text"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-lg-6">
                        <input
                          name="email"
                          placeholder="Email*"
                          type="email"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-lg-12">
                        <input
                          name="subject"
                          placeholder="Subject*"
                          type="text"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-lg-12">
                        <textarea
                          name="message"
                          placeholder="Your Message*"
                          defaultValue={""}
                          onChange={handleChange}
                        />
                        <button className="submit" type="submit">
                          SEND
                        </button>
                      </div>
                    </div>
                  </form>
                  <p className="form-message" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutThree>
    </Fragment>
  );
};

export default Contact;
