import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EmployeesPage from './pages/EmployeesPage';
import TasksPage from './pages/TasksPage';
import AddTaskPage from './pages/AddTaskPage';
import UpdateTaskPage from './pages/UpdateTaskPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function AppContent() {
  const { user, logout } = useAuth();
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={logout} />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route 
            path="/employees" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EmployeesPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/tasks" element={<TasksPage />} />
          <Route 
            path="/tasks/new" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AddTaskPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tasks/:id/edit" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UpdateTaskPage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(<App />);
