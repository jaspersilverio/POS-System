import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './features/auth/Login';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Reports from './pages/Reports';
import Unauthorized from './routes/Unauthorized';
import MainLayout from './components/layout/MainLayout';
import AdminDashboard from './features/admin/AdminDashboard';
import { AuthProvider } from '@/context/AuthProvider';
import Register from './features/auth/Register';

function App() {
  return (
    <BrowserRouter> {/* ✅ Wrap Router at the highest level */}
      <AuthProvider> {/* ✅ Now AuthProvider is inside Router */}
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Authenticated Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pos" element={<POS />} />
            </Route>
          </Route>

          {/* Manager & Admin Routes */}
          <Route element={<ProtectedRoute roles={['manager', 'admin']} />}>
            <Route element={<MainLayout />}>
              <Route path="/reports" element={<Reports />} />
            </Route>
          </Route>

          {/* Admin-only Routes */}
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route element={<MainLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
