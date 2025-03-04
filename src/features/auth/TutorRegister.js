import React, { useState } from 'react';
import axios from 'axios';

function TutorRegister({ onSuccess }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== repeatPassword) {
            setError('Passwords do not match');
            return;
        }

        const toSubmit = { name, email, password, role: "tutor", verificationCode };
        console.log('Tutor Registering:', toSubmit);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register-tutor', toSubmit);
            console.log("✅ Tutor Registration successful", response.data);

            setError(''); 

            if (onSuccess) {
                onSuccess("Tutor account created successfully! Please log in.");
            }
        } catch (err) {
            console.error('❌ Error during tutor registration:', err);
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
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Verification Code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                />
                <input type="hidden" value="tutor" name="role" />
                <button type="submit">Register</button>
            </form>

            {error && <p id="error-code" style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default TutorRegister;
