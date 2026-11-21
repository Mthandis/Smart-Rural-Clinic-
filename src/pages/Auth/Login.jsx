
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import "../../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      // Get the logged-in user
      const user = response.data;

      if (!user || !user.role) {
        throw new Error("Invalid login response from server.");
      }

      // Store user information
      localStorage.setItem("user", JSON.stringify(user));

      console.log("Login successful:", user);

      // Redirect based on role
      if (user.role === "PATIENT") {
        navigate("/patient-dashboard");
      } else if (user.role === "ADMIN") {
        navigate("/admin-dashboard");
      } else if (user.role === "NURSE") {
        navigate("/nurse-dashboard");
      } else {
        navigate("/worker-dashboard");
      }

    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    setError("");
    setFormData({
      email: "",
      password: "",
    });
  };

  return (
    <div className="login-page">
      <Navbar />

      <main className="login-section">
        <div className="login-content">
          <p className="login-label">WELCOME </p>

          <h1>Login to Smart Rural Clinic</h1>

          <p className="login-description">
            Access your healthcare services and manage your clinic information
            securely.
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="forgot-password">
              <Link to="/forgot-password">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="register-text">
            Don't have an account?{" "}
            <Link to="/register">Create an account</Link>
          </p>
        </div>
      </main>

      {error && (
        <div className="warning-overlay">
          <div className="warning-popup">
            <div className="warning-icon">⚠</div>

            <h2>Login Failed</h2>

            <p>{String(error)}</p>

            <button
              type="button"
              className="warning-button"
              onClick={handleClosePopup}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
