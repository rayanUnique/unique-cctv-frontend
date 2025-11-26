import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Carousel, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { homepageService } from '../services/api';

const Home = () => {
  const [homepageData, setHomepageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Helper function to get proper image URLs
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return '';
    }
    
    const pathString = String(imagePath);
    
    console.log('🖼️ Processing image path:', pathString);
    
    // If it's already a full URL, use it directly
    if (pathString.startsWith('http') || pathString.startsWith('blob:') || pathString.startsWith('data:')) {
      return pathString;
    }
    
    // If it starts with /api/images/, create full backend URL
    if (pathString.startsWith('/api/images/')) {
      const fullUrl = `http://localhost:8080${pathString}`;
      console.log('🖼️ Converted to full URL:', fullUrl);
      return fullUrl;
    }
    
    // If it's just a file name, create full backend URL
    const fullUrl = `http://localhost:8080/api/images/${pathString}`;
    console.log('🖼️ Filename converted to URL:', fullUrl);
    return fullUrl;
  };

  const fetchHomepageContent = async () => {
    try {
      console.log('🔄 Fetching homepage content...');
      setLoading(true);
      setError('');
      
      const response = await homepageService.getHomepageContent();
      console.log('📦 Homepage API Response:', response);
      console.log('🔍 Full response data:', response.data);
      console.log('🖼️ Hero image from API:', response.data.heroImage);
      console.log('📝 Hero title from API:', response.data.heroTitle);
      
      // Check if we have valid data
      if (response.data && (response.data.heroTitle || response.data.heroImage)) {
        console.log('✅ Valid homepage data received');
        setHomepageData(response.data);
      } else {
        console.warn('⚠️ Empty or invalid homepage data, using defaults');
        setHomepageData(getDefaultHomepageData());
      }
    } catch (err) {
      console.error('❌ Homepage API failed:', err);
      console.error('❌ Error details:', err.response?.data || err.message);
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
    heroImage: '',
    heroTitle: 'Welcome to Unique CCTV',
    heroSubtitle: 'Your trusted partner for advanced security and surveillance solutions. We provide high-quality CCTV systems, Alarm Monitoring, Biometrics & Access Control Systems, Networking.',
    heroButtonText: 'View Our Products',
    slide1Image: 'https://images.unsplash.com/photo-1557862923-3502c0697161?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    slide1Title: 'Advanced Security Solutions',
    slide1Description: 'State-of-the-art CCTV systems for complete protection',
    slide1ButtonText: 'Explore Solutions',
    slide2Image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    slide2Title: '24/7 Monitoring',
    slide2Description: 'Round-the-clock surveillance for your peace of mind',
    slide2ButtonText: 'Learn More',
    slide3Image: 'https://images.unsplash.com/photo-1558618666-fcd25856cd63?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    slide3Title: 'Smart Access Control',
    slide3Description: 'Biometric and advanced access control systems',
    slide3ButtonText: 'Get Started',
    slide4Image: 'https://images.unsplash.com/photo-1569336415961-0d4cdd890699?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    slide4Title: 'Professional Installation',
    slide4Description: 'Expert installation by certified security professionals',
    slide4ButtonText: 'Contact Us'
  });

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
  console.log('🖼️ Final hero image URL:', getImageUrl(data.heroImage));

  const slides = [
    {
      image: getImageUrl(data.slide1Image),
      title: data.slide1Title,
      description: data.slide1Description,
      buttonText: data.slide1ButtonText
    },
    {
      image: getImageUrl(data.slide2Image),
      title: data.slide2Title,
      description: data.slide2Description,
      buttonText: data.slide2ButtonText
    },
    {
      image: getImageUrl(data.slide3Image),
      title: data.slide3Title,
      description: data.slide3Description,
      buttonText: data.slide3ButtonText
    },
    {
      image: getImageUrl(data.slide4Image),
      title: data.slide4Title,
      description: data.slide4Description,
      buttonText: data.slide4ButtonText
    }
  ];

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
      title: 'Certified & Skilled Technicians',
      description: 'Highly trained professionals with industry certifications and expertise',
      badge: 'Certified',
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

  return (
    <div className="w-100">
      {/* Show gentle warning if API failed */}
      {error && (
        <Alert variant="info" className="m-3">
          <small>{error}</small>
        </Alert>
      )}

      {/* Debug info - remove in production */}
      <div style={{ display: 'none' }}>
        <p>Debug: Hero Image - {data.heroImage}</p>
        <p>Debug: Hero Image URL - {getImageUrl(data.heroImage)}</p>
        <p>Debug: Hero Title - {data.heroTitle}</p>
      </div>

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
                {data.heroImage ? (
                  <img 
                    src={getImageUrl(data.heroImage)}
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
                    Professional installation by certified security experts.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* NEW: Expertise & Experience Section - Stunning & Professional */}
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
    </div>
  );
};

export default Home;