// client/src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../store/store';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, token, authLoading } = useStore();

  // If initial auth check validation token request is outstanding, pause route changes
  if (authLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  // Intercept if authorization key string parameter is absent from cache
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Restrict access if the user's role doesn't match admin requirements
  if (adminOnly && user && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Grant routing fallback rendering clearance matching target path children component trees
  return children;
}