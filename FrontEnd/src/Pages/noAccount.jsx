import React from "react";
import "./noAcount.css";
import logo from "../logo.png";
import { useNavigate } from "react-router-dom";

function NoAccount() {
  const navigate = useNavigate();
  return (
    <div class="account">
      <img class="noaclogo" src={logo} alt="Logo" />
      <h1>You're not logged!</h1>
      <h2>Choose what suits you to see your account</h2>
      <a href="">
        <button onClick={() => navigate("/user-login")}>Sign in</button>
      </a>
      <a href="">
        <button onClick={() => navigate("/signup")}>Sign up</button>
      </a>
    </div>
  );
}

export default NoAccount;
