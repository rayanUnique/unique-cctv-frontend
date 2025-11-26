import React, { useState } from 'react'
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap'
import { contactService } from '../services/api'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertVariant, setAlertVariant] = useState('success')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // In your contact component handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)
  
  try {
    console.log('📨 Sending contact form data:', formData)
    
    const response = await contactService.submitContactForm(formData)
    
    console.log('✅ Server response:', response.data)
    
    if (response.data.success) {
      setAlertMessage(response.data.message || 'Thank you for your message! We\'ll get back to you soon.')
      setAlertVariant('success')
      setFormData({ name: '', email: '', phone: '', message: '' })
    } else {
      throw new Error(response.data.message || 'Failed to send message')
    }
    
  } catch (error) {
    console.error('❌ Error submitting contact form:', error)
    
    let errorMsg = 'Failed to send message. Please try again later.'
    if (error.response?.data?.message) {
      errorMsg = error.response.data.message
    }
    
    setAlertMessage(errorMsg)
    setAlertVariant('danger')
  } finally {
    setLoading(false)
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 5000)
  }
}

  return (
    <div className="w-100">
      <Container fluid className="px-3 px-md-4 my-4 my-md-5">
        <Row>
          {/* Contact Form */}
          <Col xs={12} lg={8} className="mb-4 mb-lg-0">
            <h1 className="mb-4 h2 h1-md">Contact Us</h1>
            
            {/* Alert Message */}
            {showAlert && (
              <Alert variant={alertVariant} className="mb-4" dismissible onClose={() => setShowAlert(false)}>
                {alertMessage}
              </Alert>
            )}
            
            <Card className="p-3 p-md-4">
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        minLength={2}
                        size="lg"
                        disabled={loading}
                        placeholder="Enter your full name"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">Email *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        size="lg"
                        disabled={loading}
                        placeholder="Enter your email address"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium">Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    size="lg"
                    disabled={loading}
                    placeholder="Enter your phone number"
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">Message *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    minLength={10}
                    size="lg"
                    disabled={loading}
                    placeholder="Tell us how we can help you..."
                  />
                </Form.Group>
                
                <div className="d-grid d-md-block">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg" 
                    className="w-100 w-md-auto"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
          
       {/* Contact Information */}
<Col xs={12} lg={4}>
  <div className="ps-lg-3">
    <h3 className="h4 h3-md mb-4">Contact Information</h3>
    <Card className="p-3 p-md-4 bg-light h-100">
      <div className="contact-info">
        <div className="mb-4">
          <h5 className="fw-bold mb-2 fs-6">
            <i className="bi bi-geo-alt-fill text-primary me-2"></i>
            Address
          </h5>
          <p className="mb-0 fs-6">
            Sr no 88/2, Handewadi to Mohammadwadi DP road,<br/>
            opposite wadkarmala bus stop,<br/>
            Mohammadwadi, Hadapsar, Pune 411060
          </p>
          <Button 
            variant="outline-primary" 
            size="sm" 
            className="mt-2 fs-6"
            onClick={() => window.open('https://maps.google.com/?q=18.47941,73.92808', '_blank')}
          >
            <i className="bi bi-geo-alt me-1"></i>
            Go to Office
          </Button>
        </div>
        
        <div className="mb-4">
          <h5 className="fw-bold mb-2 fs-6">
            <i className="bi bi-telephone-fill text-primary me-2"></i>
            Phone
          </h5>
          <p className="mb-0 fs-6">
            +91 95955 71818<br/>
            +91 82373 38313
          </p>
        </div>
        
        <div className="mb-4">
          <h5 className="fw-bold mb-2 fs-6">
            <i className="bi bi-envelope-fill text-primary me-2"></i>
            Email
          </h5>
          <p className="mb-0 fs-6">
            info@uniquecctv.com
          </p>
        </div>
        
        <div className="mb-4">
          <h5 className="fw-bold mb-2 fs-6">
            <i className="bi bi-clock-fill text-primary me-2"></i>
            Business Hours
          </h5>
          <p className="mb-0 fs-6">
            Monday - Saturday: 9:00 AM - 6:00 PM<br />
            Sunday: Closed
          </p>
        </div>
        
        {/* ✅ ADDED: WhatsApp QR Code Section */}
        <div className="text-center border-top pt-4 mt-3">
          <h5 className="fw-bold mb-3 fs-6">
            <i className="bi bi-whatsapp text-success me-2"></i>
            Chat with us on WhatsApp
          </h5>
          <div className="qr-code-container mb-3">
            <img 
              src="/QR.png"  
              alt="WhatsApp QR Code" 
              className="img-fluid rounded shadow-sm"
              style={{ 
                maxWidth: '200px', 
                border: '3px solid #25D366',
                padding: '5px',
                backgroundColor: 'white'
              }}
              onError={(e) => {
                console.error('QR code image failed to load');
                e.target.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.className = 'bg-light border rounded d-flex align-items-center justify-content-center';
                fallback.style.height = '200px';
                fallback.style.width = '200px';
                fallback.style.margin = '0 auto';
                fallback.innerHTML = `
                  <div class="text-center">
                    <i class="bi bi-whatsapp text-success fs-1 mb-2 d-block"></i>
                    <small class="text-muted">QR Code not available</small>
                  </div>
                `;
                e.target.parentElement.appendChild(fallback);
              }}
              onLoad={() => console.log('✅ QR code loaded successfully')}
            />
          </div>
          <p className="text-muted mb-3 fs-6">
            Scan QR code to start conversation
          </p>
          
        </div>
      </div>
    </Card>
  </div>
</Col>
        </Row>
      </Container>
    </div>
  )
}

export default Contact