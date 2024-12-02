import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../styles/mainLayout.css";
import { startBackgroundAnimation } from "../services/BackgroundFiller";

function MainLayout({ children }) {
    useEffect(() => {
        startBackgroundAnimation();
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header />
            <main className="content-container">
                <div className="background-container"></div>
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default MainLayout;
