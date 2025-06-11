import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RoleGuard from '../auth/RoleGuard';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/dashboard" className="font-bold text-xl text-blue-600">
              Dripline POS
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-10">
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>
            
            {/* POS - Available to all users */}
            <Link to="/pos" className="text-gray-700 hover:text-blue-600 font-medium">
              Point of Sale
            </Link>
            
            {/* Transactions - Available to all users */}
            <Link to="/transactions" className="text-gray-700 hover:text-blue-600">
              Transactions
            </Link>
            
            {/* Products - Read for all, management for managers and admins */}
            <Link to="/products" className="text-gray-700 hover:text-blue-600">
              Products
            </Link>
            
            {/* Inventory - Only for managers and admins */}
            <RoleGuard allowedRoles={['manager', 'admin']}>
              <Link to="/inventory" className="text-gray-700 hover:text-blue-600">
                Inventory
              </Link>
            </RoleGuard>
            
            {/* Feedback - Only for managers and admins */}
            <RoleGuard allowedRoles={['manager', 'admin']}>
              <Link to="/feedback" className="text-gray-700 hover:text-blue-600">
                Feedback
              </Link>
            </RoleGuard>
            
            {/* Admin section - Only for admins */}
            <RoleGuard allowedRoles={['admin']}>
              <Link to="/users" className="text-gray-700 hover:text-blue-600">
                Users
              </Link>
            </RoleGuard>
          </nav>
          
          <div className="hidden md:flex items-center">
            <div className="mr-4">
              <span className="text-sm text-gray-600">
                {user?.name} <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{user?.role}</span>
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded text-sm"
            >
              Logout
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="py-2 space-y-1">
              <Link to="/dashboard" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md">
                Dashboard
              </Link>
              
              <Link to="/pos" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md">
                Point of Sale
              </Link>
              
              <Link to="/transactions" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md">
                Transactions
              </Link>
              
              <Link to="/products" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md">
                Products
              </Link>
              
              <RoleGuard allowedRoles={['manager', 'admin']}>
                <Link to="/inventory" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md">
                  Inventory
                </Link>
              </RoleGuard>
              
              <RoleGuard allowedRoles={['manager', 'admin']}>
                <Link to="/feedback" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md">
                  Feedback
                </Link>
              </RoleGuard>
              
              <RoleGuard allowedRoles={['admin']}>
                <Link to="/users" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md">
                  Users
                </Link>
              </RoleGuard>
              
              <div className="pt-4 pb-2">
                <div className="flex items-center px-3">
                  <div className="text-sm font-medium text-gray-700">
                    {user?.name} <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{user?.role}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="mt-2 w-full flex items-center px-3 py-2 text-base font-medium text-white bg-red-500 hover:bg-red-600 rounded-md"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 