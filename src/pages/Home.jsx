import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Carousel, Alert, Badge, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { homepageService } from '../services/api';

const Home = () => {
  const [homepageData, setHomepageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  // Helper function to get images from public folder
  const getPublicImage = (imageName) => {
    if (!imageName) return '';
    
    // Remove any leading slashes and ensure proper path
    const cleanName = imageName.replace(/^\//, '');
    return `/${cleanName}`;
  };

  const fetchHomepageContent = async () => {
    try {
      console.log('🔄 Fetching homepage content...');
      setLoading(true);
      setError('');
      
      const response = await homepageService.getHomepageContent();
      console.log('📦 Homepage API Response:', response);
      
      // Check if we have valid data
      if (response.data && response.data.heroTitle) {
        console.log('✅ Valid homepage data received');
        setHomepageData(response.data);
      } else {
        console.warn('⚠️ Empty or invalid homepage data, using defaults');
        setHomepageData(getDefaultHomepageData());
      }
    } catch (err) {
      console.error('❌ Homepage API failed:', err);
      setError('Failed to load homepage content. Using demo content.');
      setHomepageData(getDefaultHomepageData());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomepageContent();
  }, []);

  const getDefaultHomepageData = () => ({
    heroTitle: 'Welcome to Unique CCTV',
    heroSubtitle: 'Your trusted partner for advanced security and surveillance solutions. We provide high-quality CCTV systems, Alarm Monitoring, Biometrics & Access Control Systems, Networking.',
    heroButtonText: 'View Our Products',
    slide1Title: 'Advanced Security Solutions',
    slide1Description: 'State-of-the-art CCTV systems for complete protection',
    slide1ButtonText: 'Explore Solutions',
    slide2Title: '24/7 Monitoring',
    slide2Description: 'Round-the-clock surveillance for your peace of mind',
    slide2ButtonText: 'Learn More',
    slide3Title: 'Smart Access Control',
    slide3Description: 'Biometric and advanced access control systems',
    slide3ButtonText: 'Get Started',
    slide4Title: 'Professional Installation',
    slide4Description: 'Expert installation by skilled security professionals',
    slide4ButtonText: 'Contact Us'
  });

  // Card data for the new section
  const serviceCards = [
    {
      id: 1,
      name: 'CCTV',
      image: getPublicImage('cctv-security-camera-.jpg'),
      description: 'Advanced CCTV surveillance systems with high-definition cameras, night vision, and remote monitoring capabilities. Our CCTV solutions provide comprehensive security coverage for residential, commercial, and industrial properties.',
      features: ['HD Quality Video', 'Night Vision', 'Remote Monitoring', 'Motion Detection', 'Weather Resistant'],
      fullDescription: 'Our state-of-the-art CCTV systems offer comprehensive surveillance solutions tailored to your specific needs. We provide high-definition cameras with advanced features like night vision, motion detection, and remote access capabilities. Whether for residential, commercial, or industrial applications, our systems ensure complete security coverage and peace of mind.'
    },
    {
      id: 2,
      name: 'Access Control',
      image: getPublicImage('fingerprint-4703841_1280.jpg'),
      description: 'Sophisticated access control systems including biometric scanners, card readers, and keypad entry systems. Control and monitor access to your premises with advanced security protocols.',
      features: ['Biometric Access', 'Card Readers', 'Time-based Access', 'Visitor Management', 'Integration Ready'],
      fullDescription: 'Implement sophisticated access control systems that provide secure and convenient entry management. Our solutions include biometric scanners, smart card readers, and keypad systems that can be integrated with your existing security infrastructure. Monitor and control access in real-time with advanced reporting and analytics.'
    },
    {
      id: 3,
      name: 'EPABX',
      image: getPublicImage('ChatGPT-Image.png'),
      description: 'Enterprise-grade EPBX systems for efficient business communication. Our solutions include VoIP, video conferencing, and advanced call management features.',
      features: ['VoIP Systems', 'Video Conferencing', 'Call Management', 'Auto Attendant', 'Scalable Solutions'],
      fullDescription: 'Upgrade your business communication with our enterprise-grade EPBX systems. We provide comprehensive telecommunication solutions including VoIP, video conferencing, call routing, and advanced management features. Our scalable systems grow with your business needs while maintaining reliability and quality.'
    },
    {
      id: 4,
      name: 'Network Management System',
      image: getPublicImage('network.png'),
      description: 'Comprehensive network management solutions ensuring optimal performance, security, and reliability of your IT infrastructure with real-time monitoring and analytics.',
      features: ['Real-time Monitoring', 'Performance Analytics', 'Security Management', 'Automated Alerts', 'Cloud Integration'],
      fullDescription: 'Ensure optimal performance and security of your IT infrastructure with our comprehensive network management systems. We provide real-time monitoring, performance analytics, security management, and automated alert systems. Our solutions help maintain network reliability and prevent downtime through proactive management.'
    },
    {
      id: 5,
      name: 'Computer System',
      image: getPublicImage('Computer-Desktop-PC-PNG-HD-Isolated.png'),
      description: 'Reliable computer systems and IT infrastructure solutions tailored to your business needs. From workstations to servers, we provide end-to-end computer system solutions.',
      features: ['Custom Configurations', 'Hardware Support', 'Software Installation', 'Maintenance Services', 'Upgrade Solutions'],
      fullDescription: 'Get reliable computer systems and comprehensive IT infrastructure solutions designed specifically for your business requirements. We offer custom configurations, hardware support, software installation, and ongoing maintenance services. From individual workstations to complete server setups, we ensure optimal performance and reliability.'
    },
    {
      id: 6,
      name: 'Fire Alarm System',
      image: getPublicImage('Notifier-Fire-Alarm-by-Honeywell.webp'),
      description: 'Advanced fire alarm and detection systems with early warning capabilities, automatic alerts, and integration with emergency services for maximum safety.',
      features: ['Early Detection', 'Automatic Alerts', 'Emergency Integration', 'Regular Testing', '24/7 Monitoring'],
      fullDescription: 'Protect your property and people with our advanced fire alarm and detection systems. We provide early warning systems with automatic alerts, integration with emergency services, and comprehensive monitoring. Our systems include regular testing and maintenance to ensure they function perfectly when needed most.'
    },
    {
      id: 7,
      name: 'AI Enabled Boom Barrier Gates',
      image: getPublicImage('Boom-Barrier.jpg'),
      description: 'Intelligent boom barrier gates powered by AI technology for automated vehicle access control, license plate recognition, and smart parking management.',
      features: ['AI Powered', 'License Plate Recognition', 'Automated Operation', 'Access Logs', 'Smart Integration'],
      fullDescription: 'Revolutionize your vehicle access control with our AI-enabled boom barrier gates. Powered by advanced artificial intelligence, these systems feature license plate recognition, automated operation, and comprehensive access logging. Perfect for parking management, security checkpoints, and automated entry systems with smart integration capabilities.'
    }
  ];

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCard(null);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading homepage content...</p>
      </div>
    );
  }

  const data = homepageData || getDefaultHomepageData();

  console.log('🎯 Final data to render:', data);

  // Define images from public folder
  const slides = [
    {
      image: getPublicImage('advanced.jpg'),
      title: data.slide1Title,
      description: data.slide1Description,
      buttonText: data.slide1ButtonText
    },
    {
      image: getPublicImage('24_7.jpg'),
      title: data.slide2Title,
      description: data.slide2Description,
      buttonText: data.slide2ButtonText
    },
    {
      image: getPublicImage('smart.jpg'),
      title: data.slide3Title,
      description: data.slide3Description,
      buttonText: data.slide3ButtonText
    },
    {
      image: getPublicImage('cctv.jpg'),
      title: data.slide4Title,
      description: data.slide4Description,
      buttonText: data.slide4ButtonText
    }
  ];

  // Hero image from public folder
  const heroImage = getPublicImage('websitehomepage.jpg');

  // Points data for the new section
  const expertisePoints = [
    {
      icon: 'bi-award',
      title: '7+ Years of Experience',
      description: 'Trusted expertise with a proven track record in security solutions',
      badge: 'Experienced',
      color: 'primary'
    },
    {
      icon: 'bi-building',
      title: 'Residential, Industrial, Commercial, & Government Project Expertise',
      description: 'Comprehensive security solutions for all types of properties and sectors',
      badge: 'Versatile',
      color: 'success'
    },
    {
      icon: 'bi-person-check',
      title: 'Experienced & Skilled Technicians',
      description: 'Highly trained professionals with industry expertise',
      badge: 'Experienced',
      color: 'warning'
    },
    {
      icon: 'bi-lightning',
      title: 'Fast Response AMC Support',
      description: 'Quick and reliable Annual Maintenance Contract support services',
      badge: 'Fast Support',
      color: 'info'
    },
    {
      icon: 'bi-shield-check',
      title: 'Multi Brand Installation',
      description: 'Installation of your preferred brands with expert consultancy',
      badge: 'Multi-Brand',
      color: 'danger'
    }
  ];

  // Projects counter data
  const projectStats = [
    { number: '1500+', label: 'Projects Completed', icon: 'bi-check-circle' },
    { number: '1500+', label: 'Happy Clients', icon: 'bi-emoji-smile' },
    { number: '7+', label: 'Years Experience', icon: 'bi-award' },
    { number: '24/7', label: 'Support Available', icon: 'bi-headset' }
  ];

  return (
    <div className="w-100">
      {/* Show gentle warning if API failed */}
      {error && (
        <Alert variant="info" className="m-3">
          <small>{error}</small>
        </Alert>
      )}

      {/* Hero Section - Mobile Responsive */}
      <section className="hero-section bg-light py-4 py-md-5">
        <Container fluid className="px-3 px-md-4">
          <Row className="align-items-center">
            {/* Text content first on mobile, then image on larger screens */}
            <Col xs={12} md={6} className="order-2 order-md-1 text-center text-md-start mb-4 mb-md-0">
              <h1 className="display-6 display-md-4 fw-bold">
                {data.heroTitle || 'Welcome to Unique CCTV'}
              </h1>
              <p className="lead fs-6 fs-md-4">
                {data.heroSubtitle || 'Your trusted partner for advanced security and surveillance solutions.'}
              </p>
              <div className="d-flex justify-content-center justify-content-md-start">
                <Button as={Link} to="/products" variant="primary" size="lg" className="fs-6">
                  {data.heroButtonText || 'View Our Products'}
                </Button>
              </div>
            </Col>
            <Col xs={12} md={6} className="order-1 order-md-2 mb-4 mb-md-0">
              <div className="text-center">
                {heroImage ? (
                  <img 
                    src={heroImage}
                    alt="Hero" 
                    className="img-fluid rounded shadow"
                    style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      console.error('❌ Hero image failed to load:', e.target.src);
                      e.target.style.display = 'none';
                      const parent = e.target.parentElement;
                      const fallback = document.createElement('div');
                      fallback.className = 'bg-secondary rounded d-flex align-items-center justify-content-center text-white';
                      fallback.style.height = '300px';
                      fallback.style.width = '100%';
                      fallback.innerHTML = '<span>Security Solutions Image</span>';
                      parent.appendChild(fallback);
                    }}
                    onLoad={() => console.log('✅ Hero image loaded successfully')}
                  />
                ) : (
                  <div 
                    className="bg-secondary rounded d-flex align-items-center justify-content-center text-white"
                    style={{ height: '300px' }}
                  >
                    <span>Security Solutions Image</span>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Carousel Section - Mobile Responsive */}
      <section className="slideshow-section py-0">
        <Container fluid className="p-0">
          <Carousel 
            fade 
            controls 
            indicators 
            className="professional-carousel"
            interval={5000}
            pause={'hover'}
            touch={true}
          >
            {slides.map((slide, index) => (
              <Carousel.Item key={index}>
                <div 
                  className="carousel-slide d-flex align-items-center justify-content-center"
                  style={{ 
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${slide.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '50vh',
                    minHeight: '400px'
                  }}
                >
                  <div className="carousel-content text-center text-white px-3">
                    <h2 className="carousel-title h3 h1-md">{slide.title}</h2>
                    <p className="carousel-text fs-6 fs-md-4">{slide.description}</p>
                    <Button as={Link} to="/products" variant="warning" size="lg" className="fs-6">
                      {slide.buttonText}
                    </Button>
                  </div>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </Container>
      </section>

      {/* NEW: Service Cards Section with Larger Cards */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold text-primary mb-3">Our Services</h2>
              <p className="lead text-muted fs-4">
                Comprehensive security and technology solutions tailored to your needs
              </p>
            </Col>
          </Row>
          
          <Row className="g-4 justify-content-center">
            {serviceCards.map((card) => (
              <Col key={card.id} xs={12} sm={6} lg={4} className="mb-4">
                <Card 
                  className="service-card h-100 shadow-lg border-0 position-relative overflow-hidden"
                  style={{ 
                    cursor: 'pointer',
                    transition: 'all 0.4s ease',
                    minHeight: '380px'
                  }}
                  onClick={() => handleCardClick(card)}
                >
                  {/* Card Image with Overlay */}
                  <div 
                    className="card-image-wrapper position-relative"
                    style={{
                      height: '280px',
                      backgroundImage: `url(${card.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
                    {/* Gradient Overlay */}
                    <div 
                      className="position-absolute top-0 start-0 w-100 h-100"
                      style={{
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)'
                      }}
                    ></div>
                    
                    {/* Service Name */}
                    <div className="position-absolute bottom-0 start-0 w-100 p-4">
                      <h3 className="text-white fw-bold mb-2 fs-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                        {card.name}
                      </h3>
                      <div className="d-flex align-items-center text-warning">
                        <span className="me-2">Click to explore</span>
                        <i className="bi bi-arrow-right-circle-fill"></i>
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="card-hover-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                      <div className="text-white text-center p-3">
                        <i className="bi bi-plus-circle-fill fs-1 mb-3"></i>
                        <h5 className="fw-bold mb-2">View Details</h5>
                        <p className="mb-0 small opacity-75">Learn more about our {card.name} services</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card Body with Description */}
                  <Card.Body className="p-4 bg-white">
                    <Card.Text className="text-muted mb-0 fs-6">
                      {card.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Full Screen Service Details Modal */}
      <Modal 
        show={showModal} 
        onHide={handleCloseModal} 
        size="xl"
        fullscreen={true}
        centered
        className="service-modal-fullscreen"
        dialogClassName="fullscreen-modal"
      >
        <Modal.Header className="border-0 bg-primary text-white position-sticky top-0 z-3">
          <Modal.Title className="w-100">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h2 className="fw-bold mb-0 text-white">{selectedCard?.name}</h2>
                <p className="mb-0 opacity-75">Complete Solution Details</p>
              </div>
              <Button 
                variant="outline-light" 
                onClick={handleCloseModal}
                className="rounded-circle"
                style={{ width: '50px', height: '50px' }}
              >
                <i className="bi bi-x-lg"></i>
              </Button>
            </div>
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="p-0">
          {selectedCard && (
            <Container fluid className="h-100">
              <Row className="h-100">
                {/* Image Section */}
                <Col lg={6} className="p-0">
                  <div 
                    className="h-100 d-flex align-items-center justify-content-center bg-dark"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${selectedCard.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      minHeight: '500px'
                    }}
                  >
                    <div className="text-center text-white p-4">
                      <i className="bi bi-camera-video-fill display-1 mb-3 opacity-75"></i>
                      <h3 className="display-6 fw-bold mb-3">{selectedCard.name}</h3>
                      <p className="lead mb-0 opacity-75">Advanced Security Solutions</p>
                    </div>
                  </div>
                </Col>
                
                {/* Content Section */}
                <Col lg={6} className="p-5">
                  <div className="service-details-content">
                    {/* Full Description */}
                    <div className="mb-5">
                      <h4 className="fw-bold text-primary mb-4">About This Service</h4>
                      <p className="fs-5 text-muted lh-lg">
                        {selectedCard.fullDescription}
                      </p>
                    </div>

                    {/* Key Features */}
                    <div className="mb-5">
                      <h4 className="fw-bold text-primary mb-4">Key Features</h4>
                      <Row className="g-3">
                        {selectedCard.features.map((feature, index) => (
                          <Col key={index} xs={12} sm={6}>
                            <div className="d-flex align-items-center p-3 bg-light rounded-3">
                              <i className="bi bi-check-circle-fill text-success fs-4 me-3"></i>
                              <span className="fw-semibold text-dark">{feature}</span>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>

                    {/* Benefits */}
                    <div className="mb-5">
                      <h4 className="fw-bold text-primary mb-4">Benefits</h4>
                      <Row className="g-4">
                        <Col xs={12} sm={6}>
                          <div className="text-center p-3">
                            <i className="bi bi-shield-check text-primary fs-1 mb-3"></i>
                            <h6 className="fw-bold">Enhanced Security</h6>
                            <p className="text-muted small mb-0">Comprehensive protection for your property</p>
                          </div>
                        </Col>
                        <Col xs={12} sm={6}>
                          <div className="text-center p-3">
                            <i className="bi bi-graph-up text-success fs-1 mb-3"></i>
                            <h6 className="fw-bold">Improved Efficiency</h6>
                            <p className="text-muted small mb-0">Streamlined operations and monitoring</p>
                          </div>
                        </Col>
                        <Col xs={12} sm={6}>
                          <div className="text-center p-3">
                            <i className="bi bi-headset text-info fs-1 mb-3"></i>
                            <h6 className="fw-bold">24/7 Support</h6>
                            <p className="text-muted small mb-0">Round-the-clock technical assistance</p>
                          </div>
                        </Col>
                        <Col xs={12} sm={6}>
                          <div className="text-center p-3">
                            <i className="bi bi-award text-warning fs-1 mb-3"></i>
                            <h6 className="fw-bold">Professional Installation</h6>
                            <p className="text-muted small mb-0">Expert setup and configuration</p>
                          </div>
                        </Col>
                      </Row>
                    </div>

                    {/* Call to Action */}
                    <div className="bg-primary text-white p-4 rounded-3 text-center">
                      <h5 className="fw-bold mb-3">Ready to Get Started?</h5>
                      <p className="mb-4 opacity-75">
                        Contact us today for a free consultation and customized quote
                      </p>
                      <div className="d-flex justify-content-center gap-3 flex-wrap">
                        <Button 
                          as={Link} 
                          to="/contact" 
                          variant="warning" 
                          size="lg"
                          className="fw-bold px-4"
                          onClick={handleCloseModal}
                        >
                          <i className="bi bi-telephone me-2"></i>
                          Get Free Quote
                        </Button>
                        <Button 
                          as={Link} 
                          to="/products" 
                          variant="outline-light" 
                          size="lg"
                          onClick={handleCloseModal}
                        >
                          <i className="bi bi-info-circle me-2"></i>
                          More Information
                        </Button>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          )}
        </Modal.Body>
      </Modal>

      {/* Features Section - Mobile Responsive */}
      <section className="py-4 py-md-5">
        <Container fluid className="px-3 px-md-4">
          <Row>
            <Col>
              <h2 className="text-center mb-4 h3 h1-md">Why Choose Us?</h2>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col xs={12} sm={6} lg={4} className="mb-4">
              <Card className="h-100 text-center feature-card">
                <Card.Body className="p-3 p-md-4">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-camera-video fs-1"></i>
                  </div>
                  <Card.Title className="h5">High Quality</Card.Title>
                  <Card.Text className="fs-6">
                    Premium quality CCTV cameras with crystal clear video recording.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={4} className="mb-4">
              <Card className="h-100 text-center feature-card">
                <Card.Body className="p-3 p-md-4">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-headset fs-1"></i>
                  </div>
                  <Card.Title className="h5">24/7 Support</Card.Title>
                  <Card.Text className="fs-6">
                    Round-the-clock customer support and maintenance services.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={4} className="mb-4">
              <Card className="h-100 text-center feature-card">
                <Card.Body className="p-3 p-md-4">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-tools fs-1"></i>
                  </div>
                  <Card.Title className="h5">Expert Installation</Card.Title>
                  <Card.Text className="fs-6">
                    Professional installation by skilled security experts.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Expertise & Experience Section */}
      <section className="py-5 bg-gradient-primary text-white">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold mb-3">Our Expertise & Experience</h2>
              <p className="lead fs-4 opacity-75">
                Trusted by thousands of customers for reliable security solutions
              </p>
            </Col>
          </Row>
          
          <Row className="g-4 justify-content-center">
            {expertisePoints.map((point, index) => (
              <Col 
                key={index} 
                xs={12} 
                md={6} 
                lg={4}
                className={expertisePoints.length === 5 && index >= 3 ? 'd-flex justify-content-center' : ''}
                style={expertisePoints.length === 5 && index >= 3 ? { maxWidth: '400px' } : {}}
              >
                <Card className="h-100 expertise-card border-0 shadow-lg hover-lift" style={{ width: '100%' }}>
                  <Card.Body className="p-4 text-center">
                    <div className={`icon-wrapper bg-${point.color} bg-opacity-10 rounded-circle p-3 mb-3 mx-auto`} 
                         style={{ width: '80px', height: '80px' }}>
                      <i className={`${point.icon} fs-2 text-${point.color}`}></i>
                    </div>
                    
                    <Badge bg={point.color} className="mb-3 fs-6">
                      {point.badge}
                    </Badge>
                    
                    <Card.Title className="h5 mb-3 fw-bold">
                      {point.title}
                    </Card.Title>
                    
                    <Card.Text className="text-muted fs-6">
                      {point.description}
                    </Card.Text>
                    
                    <div className="mt-3">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      <small className="text-success fw-semibold">Verified & Trusted</small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Call to Action */}
          <Row className="mt-5 text-center">
            <Col>
              <div className="cta-section p-4 rounded-3 bg-dark bg-opacity-25">
                <h3 className="h4 mb-3">Ready to Secure Your Property?</h3>
                <p className="mb-4 opacity-75">
                  Get a free consultation and quote from our security experts
                </p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <Button as={Link} to="/book-appointment" variant="warning" size="lg" className="fs-6">
                    <i className="bi bi-calendar-check me-2"></i>
                    Book Free Consultation
                  </Button>
                  <Button as={Link} to="/contact" variant="outline-light" size="lg" className="fs-6">
                    <i className="bi bi-telephone me-2"></i>
                    Contact Us Now
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* NEW: Projects Counter Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold text-primary mb-3">
                Building Trust Through Excellence
              </h2>
              <p className="lead fs-4 text-muted">
                Every project completed is a testament to our commitment to quality and customer satisfaction
              </p>
            </Col>
          </Row>

          {/* Stats Counter */}
          <Row className="g-4 justify-content-center mb-5">
            {projectStats.map((stat, index) => (
              <Col key={index} xs={6} md={3} className="text-center">
                <div className="stat-card p-4 bg-white rounded-3 shadow-sm border-0">
                  <div className="stat-icon mb-3">
                    <i className={`${stat.icon} fs-1 text-primary`}></i>
                  </div>
                  <h3 className="stat-number display-6 fw-bold text-dark mb-2">
                    {stat.number}
                  </h3>
                  <p className="stat-label text-muted fw-semibold mb-0">
                    {stat.label}
                  </p>
                </div>
              </Col>
            ))}
          </Row>

          {/* Motivational Quote Box */}
          <Row>
            <Col>
              <div className="motivational-box bg-primary text-white p-5 rounded-3 text-center shadow-lg">
                <div className="quote-icon mb-4">
                  <i className="bi bi-quote fs-1 opacity-50"></i>
                </div>
                <h3 className="h2 fw-bold mb-4">
                  "Security is not a product, but a process. We've successfully secured over <span className="text-warning">1500+ properties</span> across various sectors, and each project reinforces our commitment to making your world safer."
                </h3>
                <div className="signature mt-4">
                  <p className="mb-1 fw-semibold opacity-75">- The Unique CCTV Team</p>
                  <small className="opacity-50">Your Trusted Security Partners Since 2017</small>
                </div>
              </div>
            </Col>
          </Row>

          {/* Additional Impact Statement */}
          <Row className="mt-5">
            <Col md={8} className="mx-auto text-center">
              <div className="impact-statement p-4">
                <h4 className="h5 text-dark mb-3">
                  <i className="bi bi-shield-check text-success me-2"></i>
                  Join Thousands of Satisfied Customers
                </h4>
                <p className="text-muted mb-0">
                  From residential homes to large industrial complexes, our security solutions have protected assets worth millions. 
                  Your trust drives us to deliver nothing but the best in security technology and service.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    {/* Add custom CSS for the new section */}
      <style jsx>{`
        .service-card {
          transition: all 0.3s ease;
          border: none;
          overflow: hidden;
        }
        
        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
        }
        
        .card-hover-overlay {
          background: rgba(102, 126, 234, 0.9);
          opacity: 0;
          transition: all 0.3s ease;
        }
        
        .service-card:hover .card-hover-overlay {
          opacity: 1;
        }
        
        .service-card:hover .card-overlay {
          opacity: 0;
        }
        
        .card-overlay {
          background: rgba(0,0,0,0.4);
          transition: all 0.3s ease;
        }
        
        .modal-image {
          border: 3px solid #f8f9fa;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .service-modal .modal-content {
          border: none;
          border-radius: 15px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        
        .service-modal .modal-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 15px 15px 0 0;
        }
        
        .service-modal .btn-close {
          filter: invert(1);
        }
      `}</style>
    </div>
  );
};

export default Home;