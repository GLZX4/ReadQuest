import React from "react";
import { Link } from "react-router-dom";
import "../styles/header.css";

function HeaderText() {
    
    return (
        <Link to="/" className="logo-link">
        <span className="ReadQuest-Title">
            <span className="animated-text">
            <span>R</span>
            <span>e</span>
            <span>a</span>
            <span>d</span>
            <span className="ReadQuest-Purple">Q</span>
            <span className="ReadQuest-Purple">u</span>
            <span className="ReadQuest-Purple">e</span>
            <span className="ReadQuest-Purple">s</span>
            <span className="ReadQuest-Purple">t</span>
            </span>
        </span>
    </Link>
    )
}

export default HeaderText;