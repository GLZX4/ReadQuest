import React, { useEffect } from 'react';
import AuthToggle from '../components/AuthToggle';
import { jwtDecode } from 'jwt-decode';

function LoginPage() {

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded) {
          window.location.href = '/dashboard';
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  return (
    <div>
        <AuthToggle />
    </div>
  );
}

export default LoginPage;