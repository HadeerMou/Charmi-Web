import React, { useState } from "react";
import "./signin.css";
import logo from "../logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function ResetPass() {
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Extract email or token from URL query (backend should provide a token in the email link)
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");

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

      // Show success message
      alert("Password updated successfully! Please log in.");

      // Redirect to login
      navigate("/user-login");
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
        <h1>Reset Password</h1>
        <p>Enter a new password to update your password</p>
      </div>
      <div className="inputs">
        <input
          className="input"
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <input
          className="input"
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      {error && <p className="error">{error}</p>}
      <div className="loginbutton">
        <button onClick={handleResetPassword} disabled={loading}>
          {loading ? "Updating..." : "Continue"}
        </button>
      </div>
      <br />
    </div>
  );
}

export default ResetPass;
