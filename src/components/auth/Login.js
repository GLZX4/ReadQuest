import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alerter from "../common/alerter";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, name } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("name", name);
      window.dispatchEvent(new Event("storage"));

      navigate("/dashboard");
    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Please try again.";
      setError(null);
      setTimeout(() => setError(message), 10);
      console.error("Login failed:", message);
    }
  };

  return (
    <div className="login-register-container">
      <h1 className="noselect">Login</h1>


      <form className="login-register" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label>
          <input type="checkbox" onClick={() => setShowPassword(!showPassword)} />
          {showPassword ? "Hide Password" : "Show Password"}
        </label>
        <button type="submit">Login</button>
      </form>
      {error && <Alerter message={error} type="error" onClose={() => setError(null)} />}
    </div>
  );
}

export default Login;
