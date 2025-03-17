import "./contact.css";
import Cart from "../Components/cart";
import Footer from "../Components/footer";
import Header from "../Components/header";
import { useTranslation } from "../TranslationContext";
import Products from "../Components/products";
import { useEffect, useState } from "react";

export default function Contact({
  toggleCartVisibility,
  toggleProductsVisibility,
  cart,
  showProducts,
  totalQuantity,
}) {
  const { translations } = useTranslation();
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <>
      <Header
        toggleProductsVisibility={toggleProductsVisibility}
        toggleCartVisibility={toggleCartVisibility}
        cart={cart}
        totalQuantity={totalQuantity}
      />
      <Products showProducts={showProducts} />
      <div class="entry">
        <h1 class="conthead pt-5">{translations.conthead}</h1>
      </div>
      {isMobile ? (
        <div className="mobvideo video pt-5">
          <video
            width="100%"
            height="700px"
            autoplay="autoplay"
            muted="muted"
            loop="loop"
            playsInline
            preload="auto"
            loading="lazy"
          >
            <source src="/assets/Comp 1.mp4" type="video/mp4" />
          </video>
        </div>
      ) : (
        <div className="webvideo">
          <video autoplay="autoplay" muted="muted" loop="loop">
            <source src="/assets/video 1web.mp4" type="video/mp4" />
          </video>
        </div>
      )}

      <div class="contactsection">
        <h3 class="question mb-5">{translations.question}</h3>
        <a href="mailto:charmicompany4wi@gmail.com">
          <button className="contactemail">{translations.contactemail}</button>
        </a>
        {/*  <a id="cm">
          <button
            className="commentbtn"
            onClick={() => setIsCommentVisible(!isCommentVisible)}
          >
            {translations.commentbtn}
          </button>
        </a> */}
      </div>
      {/*  {isCommentVisible && (
        <form name="form1" method="POST" class="comment">
          <h3 class="formtitle p-4">{translations.formtitle}</h3>
          <textarea
            rows="10"
            cols="80"
            name="message"
            id="cm"
            required
          ></textarea>
          <button class="sendbtn m-3" id="Sendbtn">
            {translations.sendbtn}
          </button>
        </form>
      )} */}
      <div class="flbottom">
        <h2 id="fu" class="follow">
          {translations.follow}
        </h2>
        <div class="reach">
          <a
            href="https://www.facebook.com/people/%D8%AA%D8%B4%D8%A7%D8%B1%D9%85%D9%8A-%D9%84%D9%84%D9%85%D8%B7%D8%A7%D8%A8%D8%AE-%D9%88%D8%A7%D9%84%D8%A7%D8%AB%D8%A7%D8%AB-%D8%A7%D9%84%D9%85%D9%86%D8%B2%D9%84%D9%8A/100064863465749/?mibextid=ZbWKwL"
            class="face"
          >
            {translations.face}
          </a>
          <p>|</p>
          <a
            href="https://www.instagram.com/charmi.wi/?igsh=cTVxMTRpbzUxZmxx#"
            class="insta"
          >
            {translations.insta}
          </a>
          <p>|</p>
          <a href="https://www.youtube.com/@chrmi.w" class="youtube">
            {translations.youtube}
          </a>
        </div>
      </div>
      <Footer />
    </>
  );
}
