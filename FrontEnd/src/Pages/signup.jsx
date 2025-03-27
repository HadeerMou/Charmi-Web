import React, { useState } from "react";
import "./signin.css";
import logo from "../logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "../TranslationContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    document.activeElement.blur();
    setLoading(true);
    setError("");

    try {
      // Store form data in localStorage/sessionStorage
      localStorage.setItem("signupData", JSON.stringify(formData));

      await axios.post(
        `${API_BASE_URL}/auth/sendotp`, // ✅ OTP API endpoint
        { input: formData.email }, // ✅ Send email as input
        {
          headers: {
            "Content-Type": "application/json",
            userType: "USER",
          },
        }
      );

      // Navigate to OTP verification page with email
      navigate(`/otp?input=${encodeURIComponent(formData.email)}&from=signup`);
    } catch (err) {
      console.error("OTP send error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div class="loginContainer">
      <div className="logintop">
        <img className="noaclogo" src={logo} alt="Logo" />
        <h1>{translations.title}</h1>
        <h2>{translations.signup}</h2>
      </div>
      <form onSubmit={handleSubmit} className="inputs">
        <label className="label">{translations.username}</label>
        <input
          className="input"
          type=""
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
        <div className="password-wrapper">
          <input
            className="passinput"
            type={showPassword ? "" : "password"} // 👀 Toggle type
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span className="password-icon" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />} {/* 👁️/🙈 Icons */}
          </span>
        </div>
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
          <button className="logbutton" type="submit" disabled={loading}>
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
