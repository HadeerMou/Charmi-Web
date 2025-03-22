import React, { useState } from "react";
import "./signin.css";
import logo from "../logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "../TranslationContext";

function Signin({ userType }) {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const { translations } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset errors

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
            userType: userType,
          },
        }
      );

      const token = response.data.data.accessToken;

      // Save token in localStorage
      localStorage.setItem("token", response.data.data.accessToken);
      localStorage.setItem("userType", userType);

      // Fetch user profile to get the user ID
      if (userType !== "ADMIN") {
        const profileResponse = await axios.get(
          `${API_BASE_URL}/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userId = profileResponse.data.data.id;
        localStorage.setItem("userId", userId); // Store user ID
      }

      // Redirect based on userType
      if (userType === "ADMIN") {
        navigate("/dashboard"); // Redirect admins
      } else {
        navigate("/"); // Redirect users
      }
    } catch (err) {
      console.error("Login Error:", err);

      if (err.response) {
        // API error (backend responded with an error)
        setError(err.response.data.message || "Invalid credentials");
      } else if (err.request) {
        // Network error (no response)
        setError("No response from server. Check your connection.");
      } else {
        // Other unknown errors
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="loginContainer">
      <div className="logintop">
        <img class="noaclogo" src={logo} alt="Logo" />
        <h1>{translations.title}</h1>
        <h2>{translations.signin}</h2>
      </div>
      <form onSubmit={handleLogin} className="inputs">
        <label className="label" htmlFor="">
          {translations.email}
        </label>
        <input
          className="input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="label" htmlFor="">
          {translations.password}
        </label>
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}
        <div className="loginbutton">
          <button type="submit">{translations.signin}</button>
        </div>
        <br />
        <div className="forgotpass">
          <a
            href=""
            onClick={(e) => {
              e.preventDefault();
              navigate("/forgot-password");
            }}
          >
            {translations.forgot}
          </a>
        </div>
        <div className="navto">
          <h5>{translations.noacc}</h5>
          <a
            href=""
            onClick={(e) => {
              e.preventDefault();
              navigate("/signup");
            }}
          >
            {translations.signup}
          </a>
        </div>
      </form>
    </div>
  );
}

export default Signin;
