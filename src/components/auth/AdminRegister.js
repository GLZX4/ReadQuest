// src/features/auth/AdminRegister.js
import React, { useState } from 'react';
import axios from 'axios';

function AdminRegister() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Replace with your backend API URL
            const response = await axios.post('http://localhost:5000/api/auth/register-admin', {
                name,
                email,
                password
            });
            console.log("Admin Registration successful", response.data);
            window.location.href = '/login'; // Redirect to login after successful registration
        } catch (err) {
            console.error('Error during admin registration:', err);
            setError(err.response?.data?.message || 'Admin registration failed');
        }
    };

    return (
        <div className="login-register-container">
            <h1 className="noselect">Register As Admin</h1>
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
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default AdminRegister;
