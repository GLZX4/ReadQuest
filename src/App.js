import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import MainLayout from "./components/MainLayout";
import RoundPage from "./pages/RoundPage";
import "./App.css";
import { AuthProvider } from "./services/authContext";

function App() {
    return (
        <AuthProvider>
            <Router>
                <MainLayout>
                    <Routes>
                        <Route path="/" element={<LoginPage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/round" element={<RoundPage />} />
                        <Route path="*" element={<h2>404 - Page not found</h2>} />
                    </Routes>
                </MainLayout>
            </Router>
        </AuthProvider>
    );
}

export default App;
