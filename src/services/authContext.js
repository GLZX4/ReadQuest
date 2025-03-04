import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userName, setUserName] = useState("Guest");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const checkUserStatus = () => {
        const token = localStorage.getItem("token");
        const storedName = localStorage.getItem("name");

        console.log("Checking user status...");
        console.log("Token from storage:", token);
        console.log("Stored name from storage:", storedName);

        if (token) {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decoded.exp < currentTime) {
                    console.warn("Token expired, logging out...");
                    logoutUser();
                    return;
                }

                setIsLoggedIn(true);
                setUserName(storedName ? storedName.split(" ")[0] : "User");

                console.log("✅ User logged in:", storedName);
            } catch (error) {
                console.error("Error decoding token:", error);
                logoutUser();
            }
        } else {
            setIsLoggedIn(false);
            setUserName("Guest");
            console.log("🚪 No valid token, user set to Guest");
        }
    };

    useEffect(() => {
        checkUserStatus();
        window.addEventListener("storage", checkUserStatus);

        return () => {
            window.removeEventListener("storage", checkUserStatus);
        };
    }, []);

    const logoutUser = () => {
        console.log("🔴 Logging out...");
        localStorage.removeItem("name");
        localStorage.removeItem("token");
        localStorage.removeItem("email");

        setUserName("Guest");
        setIsLoggedIn(false);
        console.log("✔️ User logged out. Redirecting to login...");

        window.location.href = "#/login";
    };

    return (
        <AuthContext.Provider value={{ userName, isLoggedIn, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};
