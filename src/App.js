import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import MainLayout from './components/MainLayout';
import RoundPage from './pages/RoundPage';
import './App.css';

function App() {
  return (
    <Router>
      <MainLayout>
        { /* All Page Routing Here: */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/round" element={<RoundPage />} />
          <Route path="*" element={<h2>404 - Page not found</h2>} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;