import { useState } from "react";
import axios from "axios";
import { API_URL } from "../utils/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail, validatePassword, validateConfirmPassword } from "../utils/validators";
import "./Login.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const handleSendCode = async (e) => {
    e.preventDefault();
    
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }
    
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(API_URL + "/forgot-password", { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    
    const confirmError = validateConfirmPassword(newPassword, confirmPassword);
    if (confirmError) {
      setError(confirmError);
      return;
    }

    if (!code || code.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await axios.post(API_URL + "/reset-password", {
        email,
        code,
        newPassword,
      });
      alert("✅ Password reset successful! Please login with your new password.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>{step === 1 ? "Forgot Password" : "Reset Password"}</h2>
        <p>
          {step === 1 
            ? "Enter your email to receive a reset code" 
            : `Enter the 6-digit code sent to ${email}`}
        </p>

        {message && <div className="success-message">✅ {message}</div>}
        {error && <div className="error-message">❌ {error}</div>}

        {step === 1 ? (
          <form onSubmit={handleSendCode}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter 6-digit OTP Code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength="6"
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="New Password (min 6 chars, 1 uppercase, 1 number)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <p className="register-text">
          <Link to="/login">← Back to Login</Link>
        </p>
      </div>
    </div>
  );
}