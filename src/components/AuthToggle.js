import React, { useState } from "react";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import "../styles/authToggle.css";

function AuthToggle() {
    const [isLogin, setIsLogin] = useState(true);

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className="authContainer">
            {isLogin ? <Login /> : <Register />}
            <button className="authToggler-Btn noselect" onClick={toggleForm}>
                {isLogin ? "Need to Register?" : "Already Registered?"}
            </button>
        </div>
    )

};

export default AuthToggle;