import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state if authentication is being verified
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified, check if user has required role
  if (roles && roles.length > 0 && user) {
    // Role-based authorization logic - uses the hierarchy: admin > manager > cashier
    const roleValues = {
      admin: 3,
      manager: 2,
      cashier: 1
    };
    
    // Find the minimum required role level
    const minRequiredRoleLevel = Math.min(
      ...roles.map(role => roleValues[role] || 0)
    );
    
    // User's role level
    const userRoleLevel = roleValues[user.role] || 0;
    
    // Check if user has sufficient role level
    if (userRoleLevel < minRequiredRoleLevel) {
      // User doesn't have the required role, redirect to dashboard with a message
      return <Navigate to="/dashboard" state={{ accessDenied: true }} replace />;
    }
  }

  // User is authenticated and has required role
  return <>{children}</>;
};

export default ProtectedRoute; 