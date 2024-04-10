import PropTypes from "prop-types";
import clsx from "clsx";

const SectionTitleWithText = ({ spaceTopClass, spaceBottomClass }) => {
  return (
    <div className={clsx("welcome-area", spaceTopClass, spaceBottomClass)}>
      <div className="container">
        <div className="welcome-content text-center">
          <h5>Who Are We</h5>
          <h1>Welcome To Cookies Addiction</h1>
          <p>
            At Cookies Addiction, we believe that every bite tells a story.
            <br /> Our journey began during a challenging time, amidst the
            reserves at the beginning of the war in Israel.
            <br /> It was then that I experienced a moment of solace, a moment
            of sheer delight, when I tasted a chocolate chip cookie crafted by a
            friend. That cookie, with its perfect blend of flavors and
            comforting embrace, became my beacon of hope during those tumultuous
            days. <br />
            Upon returning from the reserves, I was determined to recreate that
            exact taste, that feeling of comfort and joy. <br /> Thus began my
            relentless pursuit of the perfect chocolate chip cookie recipe. Days
            turned into weeks, as I experimented with various ingredients,
            meticulously researching each one to understand its role in creating
            the ultimate cookie experience. <br />
            After countless trials and taste tests, I finally discovered the
            perfect recipe <br />
            my favorite chocolate chip cookie, perfected to perfection.
            <br />
            With a heart full of passion and a desire to share the joy I had
            found, I began offering my cookies to friends and family. The
            response was overwhelming – each bite met with exclamations of
            delight and requests for more. <br />And so, Cookies Addiction was born.
            With every batch baked with love and care, we aim to spread moments
            of joy and comfort, one delicious cookie at a time. Join us on our
            journey as we continue to craft irresistible treats that leave a
            lasting impression and bring smiles to faces everywhere.
          </p>
        </div>
      </div>
    </div>
  );
};

SectionTitleWithText.propTypes = {
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string,
};

export default SectionTitleWithText;
