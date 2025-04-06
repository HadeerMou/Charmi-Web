import React, { useState } from "react";
import "./signin.css";
import logo from "../logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "../TranslationContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ResetPass() {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const { translations } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Extract email or token from URL query (backend should provide a token in the email link)
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const [showPassword, setShowPassword] = useState(false); // 👀 State for password visibility

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleResetPassword = async () => {
    setError(""); // Reset errors

    if (!password || !confirmPassword) {
      setError("Both fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    const otp = sessionStorage.getItem("otp"); // ✅ Retrieve OTP stored in sessionStorage

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/reset`, {
        email, // The email linked to the reset request
        newPassword: password,
        otp,
      });
      // Clear OTP from sessionStorage after use
      sessionStorage.removeItem("otp");

      setError("Password updated successfully! Redirecting to login...");
      setTimeout(() => navigate("/user-login"), 2000);
    } catch (err) {
      console.error("Password Reset Error:", err);
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginContainer">
      <div className="logintop">
        <img className="noaclogo" src={logo} alt="Logo" />
        <h1>{translations.resetpass}</h1>
        <p>{translations.enterpass}</p>
      </div>
      <div className="inputs">
        <div className="password-wrapper">
          <input
            className="passinput"
            type={showPassword ? "" : "password"}
            placeholder={translations.newpass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="password-icon" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <br />
        <div className="password-wrapper">
          <input
            className="passinput"
            type={showPassword ? "" : "password"}
            placeholder={translations.confirmnewpass}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span className="password-icon" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {error && <p className="error">{error}</p>}
        <div className="loginbutton">
          <button
            className="logbutton"
            onClick={handleResetPassword}
            disabled={loading}
          >
            {loading ? `${translations.updating}` : `${translations.update}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPass;
