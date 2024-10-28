import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/header.css";

function Header() {

    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const date = new Date();
    const formattedDate = date.toLocaleString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    // Fetch user information from localStorage when the component mounts
    useEffect(() => {
        const storedName = localStorage.getItem('name');
        const storedEmail = localStorage.getItem('email');

        if (storedName) {
            setUserName(storedName);
        }
        if (storedEmail) {
            setUserEmail(storedEmail);
        }
    }, []);

    // Function to log out and mark the user as logged out in the database
    const logoutUser = async () => {
        try {
            localStorage.removeItem('name');
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            await axios.post('http://localhost:5000/api/auth/logout', { email: userEmail });
            console.log('Logged out successfully');
            window.location.href = '/login';
        } catch (error) {
            console.error('Error during logout:', error.response?.data?.message || 'Logout failed');
        }
    };

    return (
        <header>
            <Link to="/" className="logo-link">
                <span className="ReadQuest-Title">Read<span className="ReadQuest-Purple">Quest</span>
                </span>
            </Link>

            <div className="header-section">
                <span className="current-time">
                    {formattedDate}
                </span>
            </div>

            <div className="header-section">
                <div className="account-container">
                    <img className="account-rnd-image" alt="User Avatar"></img>
                    <Link to="/Login" className="account-link">
                        <span className="account-name">{userName || 'Guest'}</span>
                    </Link>

                    {/* Only show logout button if user is not 'Guest' */}
                    {userName !== 'Guest' && (
                        <button
                            className="logout"
                            onClick={logoutUser}
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
