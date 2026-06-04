import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./Login.css"
import axios from "axios"
import { useFormik } from "formik"
import * as yup from "yup"
import Cookies from "universal-cookie"
import { jwtDecode } from "jwt-decode"
import { FaCheckCircle, FaTimesCircle, FaTimes, FaEye, FaEyeSlash, FaLock, FaEnvelope } from 'react-icons/fa'

const Modal = ({ type, message, onClose }) => {
  if (!message) return null;
  const isSuccess = type === 'success';
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal-card ${type}`} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><FaTimes /></button>
        <div className={`modal-icon-wrap ${type}`}>
          {isSuccess ? <FaCheckCircle /> : <FaTimesCircle />}
        </div>
        <h3 className="modal-title">{isSuccess ? 'Welcome back!' : 'Sign In Failed'}</h3>
        <p className="modal-msg">{message}</p>
        <button className={`modal-action-btn ${type}`} onClick={onClose}>
          {isSuccess ? 'Continue' : 'Try Again'}
        </button>
      </div>
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate()
  const cookies = new Cookies();
  const [modal, setModal] = useState({ type: '', message: '' });
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: yup.object({
      email: yup.string().required("Email is required").email("Invalid email address"),
      password: yup.string().required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/v1/loginuser`,
          values,
          { withCredentials: true }
        );

        if (response.status === 200) {
          const decoded = jwtDecode(response.data.token);
          cookies.set("token", response.data.token, {
            path: "/",
            expires: new Date(decoded.exp * 1000)
          });
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify({
            id: response.data.id,
            firstName: response.data.username?.split(" ")[0],
            lastName: response.data.username?.split(" ")[1],
            email: response.data.email,
            phoneNumber: response.data.phoneNumber,
            role: response.data.role
          }));

          setModal({ type: 'success', message: `Signed in successfully. Redirecting you now...` });

          setTimeout(() => {
            if (!response.data.hasPin) {
              navigate("/create-pin");
            } else {
              navigate("/dashboard");
            }
          }, 1500);
        }
      } catch (error) {
        setModal({
          type: 'error',
          message: error.response?.data?.message || "Invalid email or password. Please try again."
        });
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <div className="login-page">
      <Modal
        type={modal.type}
        message={modal.message}
        onClose={() => setModal({ type: '', message: '' })}
      />

      {/* LEFT */}
      <div className="login-left">
        <div className="login-brand">
          <div className="brand-dot" />
          <span className="brand-name">DimPay</span>
        </div>

        <div className="login-content">
          <div className="login-badge">Secure Banking</div>
          <h1>Welcome<br />Back</h1>
          <p className="login-sub">Sign in to access your account and manage your finances.</p>

          <form className="login-form" onSubmit={formik.handleSubmit}>
            <div className="field-group">
              <label>Email Address</label>
              <div className={`input-wrap ${formik.touched.email && formik.errors.email ? 'has-error' : ''}`}>
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
              </div>
              {formik.touched.email && formik.errors.email &&
                <small className="field-error">{formik.errors.email}</small>}
            </div>

            <div className="field-group">
              <label>Password</label>
              <div className={`input-wrap ${formik.touched.password && formik.errors.password ? 'has-error' : ''}`}>
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  name="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password &&
                <small className="field-error">{formik.errors.password}</small>}
            </div>

            <div className="login-options">
              <label className="remember-label">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="/" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="signin-btn" disabled={formik.isSubmitting}>
              {formik.isSubmitting
                ? <span className="btn-spinner" />
                : 'Sign In'}
            </button>

            <p className="signup-link">
              Don't have an account? <a href="/register">Create one</a>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT */}
      <div className="login-right">
        <div className="right-glow" />
        <div className="right-card">
          <img src="/bankingappimage.png" alt="Banking" />
          <div className="right-card-text">
            <span>Trusted by thousands</span>
            <h3>Fast. Secure.<br />Always Yours.</h3>
          </div>
        </div>
        <div className="floating-stat top">
          <div className="stat-dot green" />
          <span>Transfers secured</span>
        </div>
        <div className="floating-stat bottom">
          <div className="stat-dot purple" />
          <span>256-bit encryption</span>
        </div>
      </div>
    </div>
  );
};

export default Login;