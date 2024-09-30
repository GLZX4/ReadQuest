import React from "react";
import Header from "./Header";
import Footer from "./Footer";

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
