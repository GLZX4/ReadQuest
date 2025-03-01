import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/header.css";
import HeaderText from "./HeaderText";
import { jwtDecode } from "jwt-decode";

function Header() {

    const [userName, setUserName] = useState('Guest');
    const [userEmail, setUserEmail] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const date = new Date();
    const formattedDate = date.toLocaleString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    // Fetch user information from localStorage when the component mounts
    useEffect(() => {
        const storedName = localStorage.getItem('name');
        const storedEmail = localStorage.getItem('email');
        const token = localStorage.getItem('token'); 

        if (token) {
            const decoded =jwtDecode(token);
            console.log('decoded:', decoded);
            console.log('decoded.exp:', decoded.exp);
        }

        if (storedName) {
            const firstName = storedName.split(' ')[0];
            setUserName(firstName);
        }
        if (storedEmail) {
            setUserEmail(storedEmail);
        }
        setIsLoggedIn(!!token); // If token exists, user is logged in
    }, []);

    // Function to log out and mark the user as logged out in the database
    const logoutUser = async () => {
        const userEmail = localStorage.getItem('email');
        console.log('Logging out user:', userEmail);
        try {
            await axios.post('http://localhost:5000/api/auth/logout', { email: userEmail });
            localStorage.removeItem('name');
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            setUserName('');
            console.log('Logged out successfully');
            window.location.href = '#/login';
        } catch (error) {
            console.error('Error during logout:', error.response?.data?.message || 'Logout failed');
        }
    };

    return (
        <header>
            <HeaderText />

            <div className="header-section">
                <span className="current-time">
                    {formattedDate}
                </span>
            </div>

            <div className="header-section">
                <div className="account-container">
                <Link
                        to={isLoggedIn ? "/dashboard" : "Login"} 
                        className="account-link"
                    >
                        <span className="account-name">{userName || 'Login'}</span>
                    </Link>

                    {userName !== 'Login' && (
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
