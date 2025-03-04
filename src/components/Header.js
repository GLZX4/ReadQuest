import React, { useContext } from "react";
import "../styles/header.css";
import HeaderText from "./HeaderText";
import { AuthContext } from "../services/authContext"; // Import context

function Header() {
    const { userName, isLoggedIn, logoutUser } = useContext(AuthContext);  // Use the auth state

    const date = new Date();
    const formattedDate = date.toLocaleString([], { hour: "2-digit", minute: "2-digit" });

    return (
        <header>
            <HeaderText />
            <div className="header-section">
                <span className="current-time">{formattedDate}</span>
            </div>

            <div className="header-section">
                <div className="account-container">
                    <span 
                        className="account-name" 
                        onClick={() => window.location.href = isLoggedIn ? "#/dashboard" : "#/login"}
                    >
                        {userName}
                    </span>
                    {isLoggedIn && (
                        <button className="logout" onClick={logoutUser}>
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
