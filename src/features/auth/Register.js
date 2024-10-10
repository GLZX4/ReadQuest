import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/login.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // Default role
  const [schoolCode, setSchoolCode] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    const toSubmit = { name, email, password, role, schoolCode };
    console.log('Registering:', toSubmit);
    
    try {
      // Replace with your backend API URL
      const response = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role, schoolCode });
      console.log("Registration successful", response.data);
      window.location.href = '/login'; // Redirect to login after successful registration
    } catch (err) {
      console.error('Error during registration:', err);
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="login-register-container">
      <h1 className="noselect">Register</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form className="login-register" onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="role-select"
        >
          <option value="student">Student</option>
          <option value="tutor">Tutor</option>
          <option value="admin">Admin</option>
        </select>
        <input
          type="text"
          placeholder="School Code"
          value={schoolCode}
          onChange={(e) => setSchoolCode(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
