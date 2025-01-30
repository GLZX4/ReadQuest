import React, { useEffect } from 'react';
import AuthToggle from '../components/AuthToggle';
import { jwtDecode } from 'jwt-decode';

function LoginPage() {

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          window.location.href = '#/dashboard';
        } else {
          window.location.href = '#/login';
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