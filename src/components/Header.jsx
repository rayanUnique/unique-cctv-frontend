import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Function to handle protected route clicks
  const handleProtectedClick = (path, e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login', { state: { from: location } });
    }
  };

  // Check if user has ROLE_USER (not admin)
  const isRegularUser = isAuthenticated && !isAdmin;

  return (
    <Navbar expand="lg" fixed="top" className="professional-navbar mobile-optimized">
      <Container fluid="lg">
        <Navbar.Brand as={Link} to="/" className="navbar-brand-custom">
          <div className="brand-wrapper">
            <span className="brand-icon">🔒</span>
            <span className="brand-text">
              <span className="brand-main">Unique CCTV</span>
              {!isMobile && <span className="brand-sub">Security Solutions</span>}
            </span>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle 
          aria-controls="basic-navbar-nav" 
          className="navbar-toggler-custom"
        >
          <span className="navbar-toggler-icon-custom"></span>
        </Navbar.Toggle>
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Home - Always accessible */}
            <Nav.Item>
              <Nav.Link 
                as={Link} 
                to="/" 
                className={`nav-item-custom ${isActive('/') ? 'active' : ''}`}
              >
                <span className="nav-icon">🏠</span>
                <span className="nav-text">Home</span>
                <span className="nav-underline"></span>
              </Nav.Link>
            </Nav.Item>
            
           
            
            {/* Products - Protected but accessible to both users and admins */}
            <Nav.Item>
              <Nav.Link 
                as={isAuthenticated ? Link : 'span'}
                to={isAuthenticated ? "/products" : "#"}
                className={`nav-item-custom ${isActive('/products') ? 'active' : ''} ${
                  !isAuthenticated ? 'protected-link' : ''
                }`}
                onClick={!isAuthenticated ? (e) => handleProtectedClick('/products', e) : undefined}
              >
                <span className="nav-icon">📷</span>
                <span className="nav-text">
                  Products
                  {!isAuthenticated && <small className="ms-1 text-warning">🔒</small>}
                </span>
                <span className="nav-underline"></span>
              </Nav.Link>
            </Nav.Item>

             {/* About - Always accessible */}
            <Nav.Item>
              <Nav.Link 
                as={Link} 
                to="/about"
                className={`nav-item-custom ${isActive('/about') ? 'active' : ''}`}
              >
                <span className="nav-icon">ℹ️</span>
                <span className="nav-text">About</span>
                <span className="nav-underline"></span>
              </Nav.Link>
            </Nav.Item>
            
            {/* Contact - Only for regular users (not admin) */}
            {isRegularUser && (
              <Nav.Item>
                <Nav.Link 
                  as={Link}
                  to="/contact"
                  className={`nav-item-custom ${isActive('/contact') ? 'active' : ''}`}
                >
                  <span className="nav-icon">📞</span>
                  <span className="nav-text">Contact</span>
                  <span className="nav-underline"></span>
                </Nav.Link>
              </Nav.Item>
            )}

            {/* Book Appointment - Only for regular users (not admin) */}
            {isRegularUser && (
              <Nav.Item>
                <Nav.Link 
                  as={Link}
                  to="/book-appointment"
                  className={`nav-item-custom appointment-link ${isActive('/book-appointment') ? 'active' : ''}`}
                >
                  <span className="nav-icon">📅</span>
                  <span className="nav-text">Book Appointment</span>
                  <span className="nav-underline"></span>
                </Nav.Link>
              </Nav.Item>
            )}

            {/* Admin Dashboard Link - Only for admins */}
            {isAdmin && (
              <Nav.Item>
                <Nav.Link 
                  as={Link}
                  to="/admin"
                  className={`nav-item-custom admin-link ${isActive('/admin') ? 'active' : ''}`}
                >
                  <span className="nav-icon">⚙️</span>
                  <span className="nav-text">Admin Dashboard</span>
                  <span className="nav-underline"></span>
                </Nav.Link>
              </Nav.Item>
            )}
          </Nav>

          <Nav className="ms-auto">
            {isAuthenticated ? (
              <NavDropdown 
                title={
                  <span className="user-dropdown-title">
                    <span className="user-avatar">👤</span>
                    <span className="user-name">{user?.name}</span>
                    {isAdmin && <small className="ms-1 text-warning">(Admin)</small>}
                  </span>
                } 
                id="user-dropdown"
                align={isMobile ? "start" : "end"}
                className="user-dropdown"
              >
                <NavDropdown.Item as={Link} to="/profile" className="dropdown-item-custom">
                  <i className="bi bi-person me-2"></i>
                  My Profile
                </NavDropdown.Item>

                {/* Book Appointment in dropdown - Only for regular users */}
                {isRegularUser && (
                  <NavDropdown.Item as={Link} to="/book-appointment" className="dropdown-item-custom">
                    <i className="bi bi-calendar-plus me-2"></i>
                    Book Appointment
                  </NavDropdown.Item>
                )}
                
                {/* Admin Dashboard in dropdown - Only for admins */}
                {isAdmin && (
                  <NavDropdown.Item as={Link} to="/admin" className="dropdown-item-custom">
                    <i className="bi bi-speedometer2 me-2"></i>
                    Admin Dashboard
                  </NavDropdown.Item>
                )}
                
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="dropdown-item-custom logout-item">
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <div className="auth-buttons-mobile">
                <Nav.Item>
                  <Nav.Link 
                    as={Link} 
                    to="/login"
                    className={`nav-item-custom auth-link ${isActive('/login') ? 'active' : ''}`}
                  >
                    <span className="nav-text">Login</span>
                  </Nav.Link>
                </Nav.Item>
                
                <Nav.Item>
                  <Nav.Link 
                    as={Link} 
                    to="/register"
                    className={`nav-item-custom auth-link register-link ${isActive('/register') ? 'active' : ''}`}
                  >
                    <span className="nav-text">Register</span>
                  </Nav.Link>
                </Nav.Item>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;