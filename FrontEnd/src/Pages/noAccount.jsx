import React from "react";
import "./noAcount.css";
import logo from "../logo.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../TranslationContext";

function NoAccount() {
  const { translations } = useTranslation();
  const navigate = useNavigate();
  return (
    <div class="account">
      <img class="noaclogo" src={logo} alt="Logo" />
      <h1>{translations.nologged}</h1>
      <h2>{translations.whatsuits}</h2>
      <a href="">
        <button className="logbutton" onClick={() => navigate("/user-login")}>
          {translations.signin}
        </button>
      </a>
      <a href="">
        <button className="logbutton" onClick={() => navigate("/signup")}>
          {translations.signup}
        </button>
      </a>
    </div>
  );
}

export default NoAccount;
