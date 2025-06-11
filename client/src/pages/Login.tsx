import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <LoginForm />;
};

export default Login; 