import React, { useEffect } from 'react';
import AuthToggle from '../components/auth/AuthToggle';
import { jwtDecode } from 'jwt-decode';

function LoginPage() {

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    console.log('token in login:', token);
    console.log('email in login:', email);
    
    if (token) {
      try {
        console.log('Found Token')
        const decoded = jwtDecode(token);
        console.log('decoded:', decoded);
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