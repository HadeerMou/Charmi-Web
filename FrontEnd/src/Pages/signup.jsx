import React, { useState } from "react";
import "./signin.css";
import logo from "../logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup({ handleVerifyOtp }) {
  const navigate = useNavigate();
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
        <h1>Welcome to Charmi</h1>
        <h2>Sign up</h2>
      </div>
      <form onSubmit={handleSubmit} className="inputs">
        <label className="label">Username</label>
        <input
          className="input"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <label className="label">Email</label>
        <input
          className="input"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <label className="label">Password</label>
        <input
          className="input"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <label className="label">phone</label>
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
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </div>
      </form>
      <div className="forgotpass">
        <a href="" onClick={() => navigate("/forgot-password")}>
          Forgot your password?
        </a>
      </div>

      <div className="navto">
        <h5>Already Have an Account? </h5>
        <a href="" onClick={() => navigate("/user-login")}>
          Sign in
        </a>
      </div>
    </div>
  );
}

export default Signup;
