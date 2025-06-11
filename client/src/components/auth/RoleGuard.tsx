import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types/auth';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallback?: React.ReactNode;
}

/**
 * RoleGuard - A component to conditionally render its children based on user roles
 * 
 * @param children The content to render if the user has the required role
 * @param allowedRoles Array of roles that have access
 * @param fallback Optional content to render if the user doesn't have the required role
 */
const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles, fallback = null }) => {
  const { user } = useAuth();
  
  // No user or no role
  if (!user || !user.role) {
    return <>{fallback}</>;
  }
  
  // Role-based authorization logic - uses the hierarchy: admin > manager > cashier
  const roleValues = {
    admin: 3,
    manager: 2,
    cashier: 1
  };
  
  // Find the minimum required role level
  const minRequiredRoleLevel = Math.min(
    ...allowedRoles.map(role => roleValues[role] || 0)
  );
  
  // User's role level
  const userRoleLevel = roleValues[user.role] || 0;
  
  // Check if user has sufficient role level
  if (userRoleLevel >= minRequiredRoleLevel) {
    return <>{children}</>;
  }
  
  // User doesn't have required role
  return <>{fallback}</>;
};

export default RoleGuard; 