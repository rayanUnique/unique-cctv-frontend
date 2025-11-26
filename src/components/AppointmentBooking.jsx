import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { appointmentService } from '../services/api';

const AppointmentBooking = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    mobNo: '',
    email: '',
    appointmentDate: '',
    appointmentTime: '09:00', // Default time
    address: '',
    description: '',
    selectedService: 'CCTV Installation' // Default service
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState(null);
  const [availableServices, setAvailableServices] = useState([
    'CCTV Installation & Setup',
    'CCTV Maintenance',
    'Annual Maintainance Contracts (AMC)',
    'Smart AI/IOT CCTV Systems',
    'Security System Setup',
    'Government & Corporate Tenders',
    'Network Installation',
    'Biometric & Access Control',
    'Technical Consultation'
  ]);

  // Pre-fill user data if available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        mobNo: user.mobile || ''
      }));
    }
  }, [user]);

  // Fetch available services from API (optional)
  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Uncomment if you want to fetch services from backend
        // const response = await appointmentService.getAvailableServices();
        // setAvailableServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
        // Keep default services if API call fails
      }
    };
    fetchServices();
  }, []);

  // Ensure time is never undefined
  useEffect(() => {
    if (!formData.appointmentTime) {
      setFormData(prev => ({
        ...prev,
        appointmentTime: '09:00'
      }));
    }
  }, [formData.appointmentTime]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value || (name === 'appointmentTime' ? '09:00' : (name === 'selectedService' ? 'CCTV Installation' : ''))
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      console.log('🔍 Form data before submission:', formData);
      console.log('⏰ Appointment time:', formData.appointmentTime);
      console.log('🔧 Selected service:', formData.selectedService);

      // Validate mobile number
      const mobileRegex = /^[0-9]{10}$/;
      if (!mobileRegex.test(formData.mobNo)) {
        setMessage({ type: 'error', text: 'Please enter a valid 10-digit mobile number' });
        setLoading(false);
        return;
      }

      // Validate date (should be future date)
      const selectedDate = new Date(formData.appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate <= today) {
        setMessage({ type: 'error', text: 'Please select a future date for appointment' });
        setLoading(false);
        return;
      }

      // Validate time
      if (!formData.appointmentTime) {
        setMessage({ type: 'error', text: 'Please select an appointment time' });
        setLoading(false);
        return;
      }

      // Validate service selection
      if (!formData.selectedService) {
        setMessage({ type: 'error', text: 'Please select a service' });
        setLoading(false);
        return;
      }

      const response = await appointmentService.bookAppointment(formData);
      
      setBookedAppointment(response.data);
      setShowSuccessModal(true);
      
      // Reset form but keep default time and service
      setFormData({
        name: user?.name || '',
        mobNo: user?.mobile || '',
        email: user?.email || '',
        appointmentDate: '',
        appointmentTime: '09:00', // Reset to default time
        address: '',
        description: '',
        selectedService: 'CCTV Installation' // Reset to default service
      });
      
    } catch (error) {
      console.error('Appointment booking error:', error);
      console.log('🔍 Error details:', error.response?.data);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to book appointment. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Tomorrow
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3); // 3 months from now
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="appointment-booking-page">
      <div className="appointment-hero bg-primary text-white py-5">
        <Container>
          <Row className="text-center">
            <Col>
              <h1 className="display-4 fw-bold mb-3">Book Your Appointment</h1>
              <p className="lead">Schedule a consultation with our security experts</p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="appointment-card shadow-lg border-0">
              <Card.Header className="bg-gradient-primary text-white py-4">
                <h3 className="mb-0 text-center">
                  <i className="bi bi-calendar-check me-2"></i>
                  Appointment Details
                </h3>
              </Card.Header>
              <Card.Body className="p-4 p-md-5">
                {message.text && (
                  <Alert variant={message.type === 'error' ? 'danger' : 'success'} className="mb-4">
                    {message.text}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          <i className="bi bi-person me-2 text-primary"></i>
                          Full Name *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Enter your full name"
                          className="form-control-lg border-primary"
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          <i className="bi bi-phone me-2 text-primary"></i>
                          Mobile Number *
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          name="mobNo"
                          value={formData.mobNo}
                          onChange={handleChange}
                          required
                          placeholder="10-digit mobile number"
                          className="form-control-lg border-primary"
                          pattern="[0-9]{10}"
                          maxLength="10"
                        />
                        <Form.Text className="text-muted">
                          We'll contact you on this number
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      <i className="bi bi-envelope me-2 text-primary"></i>
                      Email Address *
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                      className="form-control-lg border-primary"
                    />
                  </Form.Group>

                 

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          <i className="bi bi-calendar-date me-2 text-primary"></i>
                          Preferred Date *
                        </Form.Label>
                        <Form.Control
                          type="date"
                          name="appointmentDate"
                          value={formData.appointmentDate}
                          onChange={handleChange}
                          required
                          min={getMinDate()}
                          max={getMaxDate()}
                          className="form-control-lg border-primary"
                        />
                        <Form.Text className="text-muted">
                          Select a future date
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          <i className="bi bi-clock me-2 text-primary"></i>
                          Preferred Time *
                        </Form.Label>
                        <Form.Control
                          type="time"
                          name="appointmentTime"
                          value={formData.appointmentTime}
                          onChange={handleChange}
                          required
                          className="form-control-lg border-primary"
                        />
                        <Form.Text className="text-muted">
                          Select your preferred time
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      <i className="bi bi-geo-alt me-2 text-primary"></i>
                      Address *
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="Enter your complete address for service visit"
                      className="border-primary"
                    />
                  </Form.Group>

                   {/* NEW: Service Selection Dropdown */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      <i className="bi bi-tools me-2 text-primary"></i>
                      Select Service *
                    </Form.Label>
                    <Form.Select
                      name="selectedService"
                      value={formData.selectedService}
                      onChange={handleChange}
                      required
                      className="form-control-lg border-primary"
                    >
                      {availableServices.map((service, index) => (
                        <option key={index} value={service}>
                          {service}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Choose the service you need
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">
                      <i className="bi bi-chat-text me-2 text-primary"></i>
                      Additional Requirements
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your specific requirements, property details, or any special concerns..."
                      className="border-primary"
                    />
                    <Form.Text className="text-muted">
                      Tell us more about your specific needs and requirements
                    </Form.Text>
                  </Form.Group>

                  <div className="text-center">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={loading}
                      className="px-5 py-3 fw-semibold booking-btn"
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Booking Appointment...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-calendar-plus me-2"></i>
                          Book Appointment Now
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Additional Info Section */}
        <Row className="mt-5">
          <Col md={4} className="mb-4">
            <Card className="text-center h-100 border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="feature-icon mb-3">
                  <i className="bi bi-clock-history text-primary fs-1"></i>
                </div>
                <h5>Flexible Timing</h5>
                <p className="text-muted mb-0">
                  Choose appointment slots that work best for your schedule
                </p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-4">
            <Card className="text-center h-100 border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="feature-icon mb-3">
                  <i className="bi bi-person-check text-primary fs-1"></i>
                </div>
                <h5>Expert Consultation</h5>
                <p className="text-muted mb-0">
                  Get professional advice from security experts
                </p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-4">
            <Card className="text-center h-100 border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="feature-icon mb-3">
                  <i className="bi bi-headset text-primary fs-1"></i>
                </div>
                <h5>Quick Follow-up</h5>
                <p className="text-muted mb-0">
                  We'll contact you within 24 hours to confirm
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>
            <i className="bi bi-check-circle-fill me-2"></i>
            Appointment Booked Successfully!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <div className="success-icon mb-3">
            <i className="bi bi-calendar-check text-success" style={{ fontSize: '4rem' }}></i>
          </div>
          <h5 className="text-success mb-3">Your appointment has been confirmed</h5>
          
          {bookedAppointment && (
            <div className="appointment-details text-start">
              <p><strong>Appointment ID:</strong> #{bookedAppointment.id}</p>
              <p><strong>Service:</strong> {bookedAppointment.selectedService}</p>
              <p><strong>Date:</strong> {new Date(bookedAppointment.appointmentDate).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {bookedAppointment.appointmentTime || '09:00 AM'}</p>
              <p><strong>Name:</strong> {bookedAppointment.name}</p>
              <p><strong>Mobile:</strong> {bookedAppointment.mobNo}</p>
            </div>
          )}
          
          <p className="text-muted">
            Our team will contact you shortly to confirm the details and discuss your requirements.
          </p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="success" onClick={() => setShowSuccessModal(false)}>
            <i className="bi bi-check-lg me-2"></i>
            Got It
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AppointmentBooking;