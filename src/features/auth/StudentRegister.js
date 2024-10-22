import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/login.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatpassword] = useState('');
  const [role, setRole] = useState('student'); // Default role
  const [schoolCode, setSchoolCode] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== repeatPassword) {
      setError('Passwords do not match');
      return;
    }
    const toSubmit = { name, email, password, role, schoolCode };
    console.log('Registering:', toSubmit);
    
    try {
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
      <h1 className="noselect">Register As Student</h1>
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
        <input
          type="password"
          placeholder="Repeat-Password"
          value={repeatPassword}
          onChange={(e) => setRepeatpassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="School Code"
          value={schoolCode}
          onChange={(e) => setSchoolCode(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      {error && <p id='error-code' style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Register;
