import React, { useContext, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { setAuthToken } from './api';
import Navbar from './components/Navbar';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Employees = lazy(() => import('./pages/Employees'));
const Requests = lazy(() => import('./pages/Requests'));
const Users = lazy(() => import('./pages/users'));



function ProtectedRoute({ children, requireAdmin }) {
  const { token, role } = useContext(AuthContext);
  if (!token) return <Navigate to="/login" />;
  if (requireAdmin && role !== 'admin') return <Navigate to="/" />;
  return children;
}

function AppRoutes() {
  const { token } = useContext(AuthContext);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<ProtectedRoute requireAdmin={true}><Register /></ProtectedRoute>} />
      <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
      <Route path="/users" element={<Users />} />
      <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Suspense fallback={<div className="text-center mt-5">Cargando...</div>}>
          <AppRoutes />
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
