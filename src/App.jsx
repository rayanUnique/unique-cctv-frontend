import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './components/Login'
import Register from './components/Register'
import UserProfile from './components/UserProfile'
import AdminDashboard from './components/admin/AdminDashboard'
import AppointmentBooking from './components/AppointmentBooking'
import ProtectedRoute from './components/ProtectedRoute'
import AuthDebugger from './components/AuthDebugger'
import Unauthorized from './pages/Unauthorized';
import './App.css'

function AppContent() {
  const { loading } = useAuth()

  console.log('🚀 App rendering - Loading:', loading)

  // Show loading spinner only during initial auth check
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="ms-2">Initializing app...</p>
      </div>
    )
  }

  return (
    <div className="App">
      <AuthDebugger />
      <Header />
      <main className="main-content">
        <div className="page-container">
          <Routes>
            {/* Public Routes - Accessible without login */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/book-appointment" element={<AppointmentBooking />} />
            
            {/* Protected Routes - Require login but not specific role */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <UserProfile />
                </ProtectedRoute>
              } 
            />

            {/* Admin Only Routes */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Catch all route - 404 page */}
            <Route path="*" element={<div className="text-center py-5">
              <h1>404 - Page Not Found</h1>
              <p>The page you're looking for doesn't exist.</p>
            </div>} />
          </Routes>
          <Route path="/unauthorized" element={<Unauthorized />} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App