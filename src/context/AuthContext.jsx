import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 AuthProvider mounted - checking auth status');
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');
      
      console.log('🔐 Auth Check - Token exists:', !!token);
      console.log('🔐 Auth Check - UserData exists:', !!userData);
      
      if (token && userData) {
        const parsedUserData = JSON.parse(userData);
        console.log('🔐 Auth Check - User data:', parsedUserData);
        setUser(parsedUserData);
        console.log('✅ User state updated from localStorage');
      } else {
        console.log('❌ No valid auth data found in localStorage');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      setUser(null);
    } finally {
      setLoading(false);
      console.log('🏁 Auth check completed, loading:', false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔐 Login attempt for:', email);
      const response = await authService.login(email, password);
      const { token, user: userData } = response.data;
      
      console.log('✅ Login successful, user data:', userData);
      
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
      
      console.log('✅ User state updated after login');
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('❌ Login failed:', error);
      const errorMessage = error.response?.data?.message || error.response?.data || 'Login failed';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      const { token, user: newUser } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(newUser));
      setUser(newUser);
      
      return { success: true, user: newUser };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || 'Registration failed';
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    console.log('🚪 Logging out user');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    console.log('✅ Logout completed');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isUser: user?.role === 'USER'
  };

  console.log('🔄 AuthContext value updated:', { 
    user: value.user, 
    isAuthenticated: value.isAuthenticated,
    isAdmin: value.isAdmin,
    loading: value.loading 
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};