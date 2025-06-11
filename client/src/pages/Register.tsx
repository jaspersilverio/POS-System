import React from 'react';
import { Navigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  // If logged in as non-admin, redirect to dashboard
  if (isAuthenticated && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If logged in as admin, don't redirect (admins can create new users)
  
  return <RegisterForm />;
};

export default Register; 