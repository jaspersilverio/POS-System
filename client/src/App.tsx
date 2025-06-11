import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductCreate from './pages/ProductCreate';
import ProductEdit from './pages/ProductEdit';
import Inventory from './pages/Inventory';
import Pos from './pages/Pos';
import Transactions from './pages/Transactions';
import FeedbackDashboard from './pages/FeedbackDashboard';
import Users from './pages/Users';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes - All authenticated users */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/products" 
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/pos" 
            element={
              <ProtectedRoute>
                <Pos />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/transactions" 
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            } 
          />
          
          {/* Manager and Admin Routes */}
          <Route 
            path="/products/create" 
            element={
              <ProtectedRoute roles={['manager', 'admin']}>
                <ProductCreate />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/products/:id/edit" 
            element={
              <ProtectedRoute roles={['manager', 'admin']}>
                <ProductEdit />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/inventory" 
            element={
              <ProtectedRoute roles={['manager', 'admin']}>
                <Inventory />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/feedback" 
            element={
              <ProtectedRoute roles={['manager', 'admin']}>
                <FeedbackDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin-only Routes */}
          <Route 
            path="/users" 
            element={
              <ProtectedRoute roles={['admin']}>
                <Users />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect from home to dashboard if authenticated */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 Not Found route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
