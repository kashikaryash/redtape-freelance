import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const email = localStorage.getItem('email');
      const role = localStorage.getItem('role');

      setIsAuthenticated(!!email);
      setIsAdmin(role?.toUpperCase() === 'ADMIN');
      setIsLoading(false);
    };

    checkAuth();

    // Listen for storage changes (when user logs out in another tab)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }

  // Check if user is logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if admin access is required
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
