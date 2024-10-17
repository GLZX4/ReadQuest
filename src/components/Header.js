import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/header.css";

function Header() {

    const [useName, setUserName] = useState('');
    const date = new Date();
    const formatedDate = date.toLocaleString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    useEffect(() => {
        const storedName = localStorage.getItem('name');

        if (storedName) {
            setUserName(storedName);
        }
    }, []);


    return (
        <header>
            <Link to="/" className="logo-link">
                <span className="ReadQuest-Title">Read<span className="ReadQuest-Purple">Quest</span>
                </span>
            </Link>

            <div className="header-section">
                <span className="current-time">
                    {formatedDate}
                </span>
            </div>

            <div className="header-section">
                <div className="account-container">
                    <img className="account-rnd-image" alt="User Avatar"></img>
                    <Link to="/Login" className="account-link">
                        <span className="account-name">{useName || 'Guest'}</span>
                    </Link>

                    {/* Only show logout button if user is not 'Guest' */}
                    {useName !== 'Guest' && (
                        <button
                            className="logout"
                            onClick={() => {
                                localStorage.removeItem('name');
                                localStorage.removeItem('token');
                                window.location.href = '/login';
                            }}
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