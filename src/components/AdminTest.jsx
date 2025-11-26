import React from 'react';
import { useAuth } from '../context/AuthContext';

const AdminTest = () => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', border: '2px solid red', margin: '20px' }}>
      <h2>🔧 Admin Debug Information</h2>
      <p><strong>Is Authenticated:</strong> {isAuthenticated ? '✅ YES' : '❌ NO'}</p>
      <p><strong>Is Admin:</strong> {isAdmin ? '✅ YES' : '❌ NO'}</p>
      <p><strong>User Role:</strong> {user?.role || 'No user'}</p>
      <p><strong>User Email:</strong> {user?.email || 'No email'}</p>
      <p><strong>User Name:</strong> {user?.name || 'No name'}</p>
      
      {isAdmin && (
        <div style={{ background: 'green', color: 'white', padding: '10px', marginTop: '10px' }}>
          🎉 YOU ARE ADMIN! You should see the admin dashboard.
        </div>
      )}
      
      {!isAdmin && isAuthenticated && (
        <div style={{ background: 'orange', color: 'white', padding: '10px', marginTop: '10px' }}>
          ⚠️ You are logged in but NOT as admin. Your role: {user?.role}
        </div>
      )}
    </div>
  );
};

export default AdminTest;