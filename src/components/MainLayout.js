import React, { useEffect, useContext } from "react";
import Header from "./common/Header";
import Footer from "./common/Footer";
import "../styles/mainLayout.css";
import { startBackgroundAnimation } from "../services/BackgroundFiller";
import { AuthContext } from "../services/authContext"; 

function MainLayout({ children }) {
    const { userName, isLoggedIn } = useContext(AuthContext); 

    useEffect(() => {
        startBackgroundAnimation();
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header />  
            <main className="content-container">
                <div className="background-container noselect">
                    <div className="background-blur-layer"></div>
                </div>
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default MainLayout;
