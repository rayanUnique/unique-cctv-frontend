import React from 'react';
import { Modal, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const LoginPrompt = ({ show, onHide, redirectPath }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Login Required</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row className="text-center">
            <Col>
              <div className="mb-4">
                <i className="bi bi-shield-lock" style={{ fontSize: '3rem', color: '#ffc107' }}></i>
              </div>
              <h5>Please login to continue</h5>
              <p className="text-muted">
                You need to be logged in to access this page. 
                Please login or create an account to continue.
              </p>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button 
          as={Link} 
          to="/login" 
          state={{ from: redirectPath }}
          variant="primary"
          onClick={onHide}
        >
          Login Now
        </Button>
        <Button 
          as={Link} 
          to="/register"
          variant="outline-primary"
          onClick={onHide}
        >
          Create Account
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginPrompt;