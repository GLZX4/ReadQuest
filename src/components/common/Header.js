import React, { useContext } from "react";
import "../../styles/header.css";
import HeaderText from "./HeaderText";
import { AuthContext } from "../../services/authContext";

// Import remote to control the window
const { remote } = window.require('electron');  // 👈 safer way inside renderer

function Header() {
    const { userName, isLoggedIn, logoutUser } = useContext(AuthContext);

    const date = new Date();
    const formattedDate = date.toLocaleString([], { hour: "2-digit", minute: "2-digit" });

    const minimizeWindow = () => {
        remote.getCurrentWindow().minimize();
    };

    const closeWindow = () => {
        remote.getCurrentWindow().close();
    };

    return (
        <header className="header-bar"> {/* <- Make draggable */}
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

            <div className="header-section window-controls">
                <button className="window-button" onClick={minimizeWindow}>_</button>
                <button className="window-button close" onClick={closeWindow}>×</button>
            </div>
        </header>
    );
}

export default Header;
