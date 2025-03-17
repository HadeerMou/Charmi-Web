import "./HomeGrid.css";
import React from "react";
import { useTranslation } from "../TranslationContext";

export default function HomeGrid() {
  const { translations } = useTranslation();
  return (
    <div class="headcontainer">
      <h1 class="title">{translations.title}</h1>
      <div class="photo-gallery">
        <div class="column">
          <img className="img1" src="/assets/1.png" />
          <img className="img2" src="/assets/5.png" />
        </div>
        <div class="column">
          <img
            className="img3"
            src="/assets/3.png"
          />
          <img
            className="img4"
            src="/assets/4.png"
          />
        </div>
        <div class="column">
          <img className="img2" src="/assets/6.png" />
          <img className="img1" src="/assets/2.png" />
        </div>
      </div>
    </div>
  );
}
