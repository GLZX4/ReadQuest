// src/features/auth/TutorRegister.js
import React, { useState } from 'react';
import axios from 'axios';

function TutorRegister() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatpassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e) => {

        if (password !== repeatPassword) {
            setError('Passwords do not match');
            return;
        }

        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register-tutor', {
                name,
                email,
                password,
                verificationCode
            });
            console.log("Tutor Registration successful", response.data);
            window.location.href = '/login'; // Redirect to login after successful registration
        } catch (err) {
            console.error('Error during tutor registration:', err);
            setError(err.response?.data?.message || 'Tutor registration failed');
        }
    };

    return (
        <div className="login-register-container">
            <h1 className="noselect">Register As Tutor</h1>
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
                    placeholder="Repeat Password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatpassword(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Verification Code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                />
                <button type="submit">Register</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default TutorRegister;
