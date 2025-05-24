// src/routes/ProtectedRoute.tsx
import { useAuth } from '../context/AuthProvider';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ roles }: { roles?: string[] }) {
  const { token, role } = useAuth();
  const location = useLocation();

  // If no token (not logged in)
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified but user's role doesn't match
  if (roles && !roles.includes(role || '')) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If all checks pass
  return <Outlet />;
}