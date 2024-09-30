import React from "react";
import { Link } from "react-router-dom";
import "../styles/header.css";

function Header() {
    return (
        <header>
            <Link to="/" className="logo-link">
                <span className="ReadQuest-Title">Read<span className="ReadQuest-Purple">Quest</span>
                </span>
            </Link>
            <div class="header-section">
                <div class="Question-Counter">
                    <span class="counter">5 / 10</span>
                    <span class="encourager">Your Doing Great! </span>
                </div>
            </div>
            <div class="header-section">
                <div class="account-container">
                    <img class="account-rnd-image"></img>
                    <Link to="/Login" className="account-link">
                        <span class="account-name">John Doe</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Header;