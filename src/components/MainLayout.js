import React, { useEffect, useContext } from "react";
import Header from "./common/Header";
import Footer from "./common/Footer";
import "../styles/mainLayout.css";
import { startBackgroundAnimation } from "../services/BackgroundFiller";
import { AuthContext } from "../services/authContext";  // Import the context

function MainLayout({ children }) {
    const { userName, isLoggedIn } = useContext(AuthContext);  // Access auth state

    useEffect(() => {
        startBackgroundAnimation();
    }, []);

    console.log("MainLayout Re-rendered: ", userName, isLoggedIn); // Debugging

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header />  {/* No need to pass props */}
            <main className="content-container">
                <div className="background-container noselect"></div>
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default MainLayout;
