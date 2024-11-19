import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../styles/mainLayout.css";

function MainLayout({ children }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header />
            <main className="content-container">
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default MainLayout;
