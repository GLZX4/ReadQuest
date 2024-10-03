//MainLayout.js

import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Dashboard from "./Dashboard";
import "../styles/mainLayout.css";

function MainLayout({ children }) {  // Corrected `childern` to `children`
    return (
        <div>
            <Header />
            <main className="content-container"> {/* Use className instead of class */}
                {children} {/* Corrected typo here */}
            </main>
            <Footer />
        </div>
    );
}

export default MainLayout;
