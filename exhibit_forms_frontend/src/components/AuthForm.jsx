import { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import "./authForm.css";

//* One Component for both User Registration and Login
const AuthForm = () => {
  //* Consume the UseContext in the AuthForm Component
  const { user, setUser } = useContext(UserContext);

  //* Set the Navigation
  const navigate = useNavigate();

  //* Set Success Message
  const [success, setSuccess] = useState(null);

  //* Set Error State
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    //* Examiner Registration Data
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
  });

  //* Set Login State
  const [isLogin, setIsLogin] = useState(true);

  //* Toggle between Login & Registration
  const toggleAuthMode = () => {
    setIsLogin((prev) => !prev);
  };

  //* Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //* Register Examiner
  async function handleRegister() {
    const response = await fetch("http://127.0.0.1:8000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }),
    });

    //* Accept the JSON Data
    const data = await response.json();

    const extractError = (data) => {
      if (data.detail) return data.detail;

      return Object.values(data).flat().join(" ");
    };

    //* Show Success Message
    if (response.ok) {
      setSuccess("Registration Successful");
      setError(null);

      //* Clear Registration Fields
      setFormData({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
      });

      //* Automatically switch to Login after 2s also Hide success message after 2s
      setTimeout(() => {
        setIsLogin(true);
        setSuccess(null);
      }, 2000);
    } else {
      setError(extractError(data));
      setSuccess(null);

      //* Remove error after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  }

  //* Login the Examiner
  async function handleLogin() {
    const response = await fetch("http://127.0.0.1:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password,
      }),
    });

    //* Accept JSON Data
    const data = await response.json();

    //* Show Success Message
    if (response.ok) {
      //* Store user in state and localStorage
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));

      //* Remove Error Message
      setError(null);

      //* Navigate to dashboard
      navigate("/dashboard", { replace: true });
    } else {
      setError("Invalid Username or Password");
      setSuccess(null);

      //* Remove error after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  }

  //* Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    //* Toggle between Login and Register
    if (isLogin) {
      await handleLogin();
    } else {
      await handleRegister();
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center login-bg">
      <div className="card shadow-lg p-4 auth-card">
        {/* Logo */}
        <div className="text-center mb-3">
          <img
            src="src/assets/DCI-logo.jpg"
            alt="logo"
            className="logo"
            role="button"
          />
        </div>

        {/* Headings */}
        <h4 className="text-center exhibitMemo fw-bold">
          {isLogin ? "ATPU DIGITAL FORENSIC LAB" : "CREATE ACCOUNT"}
        </h4>

        {isLogin && (
          <p className="text-center text-muted mb-4">Sign in to continue</p>
        )}

        {/* Messages */}
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="mb-3">
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </>
          )}

          <div className="mb-3">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <button type="submit" className="btn login w-100">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-3">
          {isLogin ? "Don't have an account?" : "Already have an account?"}

          <button
            className="btn btn-link p-0 ms-2 switch-btn text-decoration-none"
            onClick={toggleAuthMode}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
