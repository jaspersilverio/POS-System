import React from 'react';
import Header from './Header';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // While checking authentication status, show a loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="py-4">
        {children}
      </main>
    </div>
  );
};

export default MainLayout; 