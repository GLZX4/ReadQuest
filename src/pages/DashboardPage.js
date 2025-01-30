// src/pages/DashboardPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import AdminDash from '../features/dashboard/AdminDash';
import StudentDash from '../features/dashboard/StudentDash';
import TutorDash from '../features/dashboard/TutorDash';
import LoadingSpinner from '../features/round/LoadingSpinner';

function DashboardPage() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      // Redirect to login if no token is found
      window.location.href = '#/login';
    } else {
      try {
        const decodedToken = jwtDecode(token);
        console.log('Decoded Token:', decodedToken); // Debug log to see decoded data

        setUserRole(decodedToken.role);

        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          // Token has expired
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (error) {
        console.error('Invalid token', error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  }, [navigate]);

  // Render different dashboard components based on user role
  const renderDashboard = () => {
    switch (userRole) {
      case 'admin':
        return <AdminDash />;
      case 'tutor':
        return <TutorDash />;
      case 'student':
        return <StudentDash />;
      default:
        return <LoadingSpinner />; // Loading or fallback content
    }
  };

  return (
    <div>
      {renderDashboard()}
    </div>
  );
}

export default DashboardPage;
