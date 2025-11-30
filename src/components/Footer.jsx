import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Footer = () => {
  const { isAuthenticated, isAdmin } = useAuth()

  return (
    <footer className="professional-footer">
      <Container>
        <Row className="align-items-center py-4">
          {/* Changed to full width on mobile, half on medium+ */}
          <Col xs={12} md={6} className="text-center text-md-start mb-3 mb-md-0">
            <div className="brand-wrapper">
              <span className="brand-icon">🔒</span>
              <span className="brand-text">
                <span className="brand-main">Unique CCTV</span>
                <span className="brand-sub">Security Solutions</span>
              </span>
            </div>
            <p className="footer-description mt-2">
              Professional security solutions for homes and businesses
            </p>
          </Col>
          
          {/* Changed to full width on mobile, half on medium+ */}
          <Col xs={12} md={6} className="text-center text-md-end">
            <div className="footer-links">
              <Link to="/" className="footer-link d-block d-md-inline-block mx-2 my-1 my-md-0">Home</Link>
              <Link to="/about" className="footer-link d-block d-md-inline-block mx-2 my-1 my-md-0">About</Link>
              <Link to="/products" className="footer-link d-block d-md-inline-block mx-2 my-1 my-md-0">Products</Link>
              <Link to="/contact" className="footer-link d-block d-md-inline-block mx-2 my-1 my-md-0">Contact</Link>
              <Link to="/book-appointment" className="footer-link d-block d-md-inline-block mx-2 my-1 my-md-0">Book Appointment</Link>
              
              {/* Admin Dashboard - Only show to admin users */}
              {isAdmin && (
                <Link to="/admin" className="footer-link d-block d-md-inline-block mx-2 my-1 my-md-0">Admin</Link>
              )}
            </div>
            <p className="footer-copyright mt-2">
              &copy; 2024 Unique CCTV. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer