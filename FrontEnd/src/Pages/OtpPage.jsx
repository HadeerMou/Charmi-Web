import React, { useRef, useState } from "react";
import logo from "../logo.png";
import "./OtpPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function OtpPage() {
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("input");
  const from = searchParams.get("from"); // Capture source (verification or forgot-password)

  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill("")); // Store OTP as an array
  const inputsRef = useRef(new Array(6).fill(null));

  // Handle Input Change
  const handleChange = (e, index) => {
    const value = e.target.value;

    if (/^\d$/.test(value)) {
      // Ensure only numbers
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < 5) {
        inputsRef.current[index + 1].focus(); // Move to the next input
      }
    }
  };

  // Handle Backspace Key
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = ""; // Clear input
      setOtp(newOtp);

      if (index > 0) {
        inputsRef.current[index - 1].focus(); // Move to previous input
      }
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verifyotp`, {
        input: email,
        otp: otp.join(""), // Convert array to string
        userType: "USER", // Required header
      });

      sessionStorage.setItem("otp", otp.join("")); // ✅ Store OTP in sessionStorage

      // Assuming the response contains user data and a token
      const { user, token } = response.data;

      // Store user info in localStorage
      localStorage.setItem("user", JSON.stringify(user)); // Save user details
      localStorage.setItem("token", token); // Save authentication token
      console.log("Email:", email);
      console.log("OTP Sent:", otp.join(""));
      console.log("API URL:", API_BASE_URL);

      alert("OTP Verified Successfully!");

      if (from === "forgot-password") {
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        navigate("/user-login");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="loginContainer">
      <div className="logintop">
        <img className="noaclogo" src={logo} alt="Logo" />
        <h1>Verify your Email Address</h1>
        <p>Please Enter the 6-digit code we sent to {email}</p>
      </div>

      <div className="codeRow">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength="1"
            value={digit}
            ref={(el) => (inputsRef.current[index] = el)}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="otpInput"
          />
        ))}
      </div>

      <div className="navigateto">
        <a href="">Send Again</a>
      </div>

      <div className="loginbutton">
        <button onClick={handleVerifyOtp}>Continue</button>
      </div>
    </div>
  );
}

export default OtpPage;
