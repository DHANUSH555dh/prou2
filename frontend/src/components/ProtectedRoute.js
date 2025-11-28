import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Access Denied</h3>
          <p className="mt-1 text-sm text-gray-500">Please log in to continue.</p>
        </div>
      </div>
    );
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Access Denied</h3>
          <p className="mt-1 text-sm text-gray-500">
            You don't have permission to access this page.
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Required role: {allowedRoles.join(', ')} | Your role: {user.role}
          </p>
        </div>
      </div>
    );
  }
  
  return children;
}