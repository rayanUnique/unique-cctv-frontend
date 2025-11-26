import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const AuthDebugger = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('🔍 AUTH DEBUGGER:', {
      currentPath: location.pathname,
      isAuthenticated,
      user,
      loading,
      hasToken: !!localStorage.getItem('token'),
      hasUserData: !!localStorage.getItem('userData'),
      timestamp: new Date().toISOString()
    });
  }, [location.pathname, isAuthenticated, user, loading]);

  return null;
};

export default AuthDebugger;