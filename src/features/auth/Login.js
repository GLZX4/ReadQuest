// src/features/auth/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token, name } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('name', name);
      console.log("Login successful, token:", token);
      // Redirect to dashboard after successful login
      window.location.href = '/dashboard';
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-register-container">
      <h1 className='noselect'>Login</h1>
      <form className="login-register" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

export default Login;
