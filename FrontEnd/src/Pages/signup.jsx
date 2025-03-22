import React, { useState } from "react";
import "./signin.css";
import logo from "../logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "../TranslationContext";

function Signup({ handleVerifyOtp }) {
  const navigate = useNavigate();
  const { translations } = useTranslation();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    document.activeElement.blur();
    setLoading(true);
    setError("");

    try {
      console.log("Sending Data:", formData);
      console.log("API URL:", API_BASE_URL);
      const response = await axios.post(
        `${API_BASE_URL}/auth/signUp`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
            userType: "USER",
          },
        }
      );
      console.log("Signup successful:", response.data);
      navigate(
        `/email-verification?email=${encodeURIComponent(formData.email)}`
      );
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      if (err.response?.data?.message === "Email is not verified") {
        navigate(
          `/email-verification?email=${encodeURIComponent(formData.email)}`
        );
      }
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div class="loginContainer">
      <div className="logintop">
        <img class="noaclogo" src={logo} alt="Logo" />
        <h1>{translations.title}</h1>
        <h2>{translations.signup}</h2>
      </div>
      <form onSubmit={handleSubmit} className="inputs">
        <label className="label">{translations.username}</label>
        <input
          className="input"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <label className="label">{translations.email}</label>
        <input
          className="input"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <label className="label">{translations.password}</label>
        <input
          className="input"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <label className="label">{translations.number}</label>
        <input
          className="input"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        {error && <p className="error">{error}</p>}
        <div className="loginbutton">
          <button type="submit" disabled={loading}>
            {loading ? `${translations.signing}` : `${translations.signup}`}
          </button>
        </div>
      </form>
      <div className="forgotpass">
        <a href="" onClick={() => navigate("/forgot-password")}>
          {translations.forgot}
        </a>
      </div>

      <div className="navto">
        <h5>{translations.haveacc}</h5>
        <a href="" onClick={() => navigate("/user-login")}>
          {translations.signin}
        </a>
      </div>
    </div>
  );
}

export default Signup;
