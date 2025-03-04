import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();  // ✅ Initialize useNavigate

  const handleLogin = async (event) => {
    event.preventDefault(); // ✅ Prevent default form submission behavior

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, name } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("name", name);

      console.log("🔄 Forcing re-check of Auth State...");
      window.dispatchEvent(new Event("storage")); // ✅ Forces Auth state update

      navigate("/dashboard"); // ✅ Redirect without full reload
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
    }
  };

    // Function to toggle password visibility adapted from https://dev.to/annaqharder/hideshow-password-in-react-513a
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
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

export default Login;
