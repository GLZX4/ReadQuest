import React, { useState } from 'react';
import AuthToggle from '../components/AuthToggle';

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isTutor, setIsTutor] = useState(false);


  return (
    <div>
        <AuthToggle />
    </div>
  );
}

export default LoginPage;