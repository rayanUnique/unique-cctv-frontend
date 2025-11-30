import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Modal, Card, Badge, Spinner, Alert } from 'react-bootstrap'
import { projectService } from '../services/api'

const About = () => {
  const [showProjectsModal, setShowProjectsModal] = useState(false)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Helper function to get proper image URLs
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return ''
    }
    
    const pathString = String(imagePath)
    
    // If it's already a full URL, use it directly
    if (pathString.startsWith('http') || pathString.startsWith('blob:') || pathString.startsWith('data:')) {
      return pathString
    }
    
    // If it starts with /api/images/, create full backend URL
    // If it starts with /api/images/, create full backend URL
if (pathString.startsWith('/api/images/')) {
  const fullUrl = `https://unique-cctv-backend.onrender.com${pathString}`;
  console.log('🖼️ Converted to full URL:', fullUrl);
  return fullUrl;
}

// If it's just a file name, create full backend URL  
const fullUrl = `https://unique-cctv-backend.onrender.com/api/images/${pathString}`;
console.log('🖼️ Filename converted to URL:', fullUrl);
return fullUrl;
  }

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('🔄 Fetching projects from API...')
      
      const response = await projectService.getActiveProjects()
      console.log('📦 Projects API Response:', response)
      console.log('🔍 Response data:', response.data)
      
      // Safely handle the response data
      let projectsData = response.data
      
      // Check if data is an array, if not try to extract it
      if (!Array.isArray(projectsData)) {
        console.warn('⚠️ Response data is not an array, attempting to extract...')
        
        // Try common response structures
        if (projectsData && Array.isArray(projectsData.data)) {
          projectsData = projectsData.data
        } else if (projectsData && Array.isArray(projectsData.projects)) {
          projectsData = projectsData.projects
        } else if (projectsData && Array.isArray(projectsData.content)) {
          projectsData = projectsData.content
        } else {
          // If still not an array, use empty array
          projectsData = []
        }
      }
      
      console.log('✅ Final projects data:', projectsData)
      
      if (projectsData.length === 0) {
        console.log('📭 No projects found, using demo data')
        setProjects(getDemoProjects())
      } else {
        setProjects(projectsData)
      }
      
    } catch (err) {
      console.error('❌ Failed to fetch projects:', err)
      console.error('🔍 Error details:', err.response?.data || err.message)
      setError('Failed to load projects from server. Using demo data.')
      setProjects(getDemoProjects())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (showProjectsModal) {
      fetchProjects()
    }
  }, [showProjectsModal])

  const getDemoProjects = () => [
    {
      id: 1,
      title: "Residential Complex Security",
      type: "Residential",
      description: "Complete CCTV surveillance system for a 100-unit residential complex with access control and 24/7 monitoring.",
      image: "project1.jpg",
      features: ["200+ Cameras", "Access Control", "24/7 Monitoring", "Mobile App Integration"]
    },
    {
      id: 2,
      title: "Commercial Office Building",
      type: "Commercial",
      description: "Advanced security system for a 20-story commercial building with biometric access and smart surveillance.",
      image: "project2.jpg",
      features: ["Biometric Access", "Smart Analytics", "Central Monitoring", "Emergency Response"]
    },
    {
      id: 3,
      title: "Industrial Warehouse Security",
      type: "Industrial",
      description: "Comprehensive security solution for a large industrial warehouse with perimeter protection and fire safety integration.",
      image: "project3.jpg",
      features: ["Perimeter Security", "Fire Safety Integration", "Thermal Cameras", "Remote Monitoring"]
    },
    {
      id: 4,
      title: "Government Facility",
      type: "Government",
      description: "High-security surveillance system for government facilities with advanced encryption and multi-layer protection.",
      image: "project4.jpg",
      features: ["Advanced Encryption", "Multi-layer Security", "Audit Trail", "Compliance Certified"]
    },
    {
      id: 5,
      title: "Retail Store Chain",
      type: "Commercial",
      description: "Retail security solution for a chain of 15 stores with POS integration and loss prevention features.",
      image: "project5.jpg",
      features: ["POS Integration", "Loss Prevention", "Customer Analytics", "Multi-store Management"]
    },
    {
      id: 6,
      title: "Educational Campus",
      type: "Institutional",
      description: "Campus-wide security system for educational institution with emergency alert systems and visitor management.",
      image: "project6.jpg",
      features: ["Emergency Alerts", "Visitor Management", "Campus-wide Coverage", "Parent App Integration"]
    }
  ]

  const handleDownloadAllBrochures = () => {
    alert('Downloading complete project portfolio brochure...\n\nThis would typically download a comprehensive PDF brochure containing:\n• All project case studies\n• Technical specifications\n• Client testimonials\n• Service packages\n• Contact information')
  }

  const getBadgeVariant = (type) => {
    switch (type) {
      case 'Residential': return 'primary'
      case 'Commercial': return 'success'
      case 'Industrial': return 'warning'
      case 'Government': return 'danger'
      case 'Institutional': return 'info'
      default: return 'secondary'
    }
  }

  // Safe rendering function for projects
  const renderProjects = () => {
    // Double check that projects is an array
    if (!Array.isArray(projects)) {
      console.error('❌ Projects is not an array:', projects)
      return (
        <div className="text-center py-5">
          <Alert variant="danger">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Invalid projects data format. Please try again later.
          </Alert>
        </div>
      )
    }

    if (projects.length === 0) {
      return (
        <div className="text-center py-5">
          <i className="bi bi-folder-x text-muted" style={{ fontSize: '3rem' }}></i>
          <h5 className="mt-3 text-muted">No Projects Available</h5>
          <p className="text-muted">Check back later for our project portfolio.</p>
        </div>
      )
    }

    return (
      <Row className="g-4">
        {projects.map((project) => {
          // Ensure project has required properties
          const safeProject = {
            id: project.id || Math.random(),
            title: project.title || 'Untitled Project',
            type: project.type || 'Other',
            description: project.description || 'No description available.',
            image: project.image || '',
            features: Array.isArray(project.features) ? project.features : []
          }

          return (
            <Col key={safeProject.id} xs={12} md={6} lg={4}>
              <Card className="h-100 project-card shadow-sm border-0 hover-lift">
                <div className="position-relative">
                  <Card.Img 
                    variant="top" 
                    src={getImageUrl(safeProject.image)}
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                      console.error('❌ Project image failed to load:', safeProject.image)
                      e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
                    }}
                    onLoad={() => console.log('✅ Project image loaded:', safeProject.title)}
                  />
                  <Badge 
                    bg={getBadgeVariant(safeProject.type)} 
                    className="position-absolute top-0 end-0 m-2"
                  >
                    {safeProject.type}
                  </Badge>
                </div>
                
                <Card.Body className="p-3 p-md-4">
                  <Card.Title className="h5 mb-2 fw-bold text-primary">
                    {safeProject.title}
                  </Card.Title>
                  <Card.Text className="text-muted fs-6 mb-3">
                    {safeProject.description}
                  </Card.Text>
                  
                  {safeProject.features.length > 0 && (
                    <div className="mb-3">
                      <h6 className="fw-bold mb-2 text-dark">Key Features:</h6>
                      <div className="d-flex flex-wrap gap-1">
                        {safeProject.features.map((feature, index) => (
                          <Badge 
                            key={index}
                            bg="light" 
                            text="dark"
                            className="fs-6 border"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-auto">
                    <div className="d-flex align-items-center text-success">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      <small className="fw-semibold">Successfully Completed</small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          )
        })}
      </Row>
    )
  }

  return (
    <div className="w-100">
      <Container fluid className="px-3 px-md-4 my-4 my-md-5">
        <Row className="justify-content-center">
          <Col xs={12} lg={10} xl={8}>
            <h1 className="text-center mb-4 h2 h1-md">About Unique CCTV</h1>
            <p className="lead text-center text-md-start fs-6 fs-md-4">
              Unique Enterprises is a trusted name in CCTV and security solutions, dedicated
              to protecting what matters most. We provide end-to-end services including
              sales, installation, and maintenance of advanced surveillance systems, access
              control, and smart security technologies.
              With expertise across residential, 
              commercial, industrial, and government
              sectors, we design customized solutions
              that deliver reliability, innovation, and
              peace of mind. Our team of skilled
              professionals ensures timely project
              execution, quality products, and 24/7 
              support to keep our clients secure at all
              times.  
              Driven by our mission to make safety smarter and more accessible, Unique Enterprises
              continues to grow as a reliable partner in security - combining technology, trust, and
              customer satisfaction in every project.<br/> OUR GOAL IS SIMPLE,"Reliabel Security with Honest Service & Smart Technology".
            </p>
            
            <Row className="mt-4 mt-md-5">
              <Col xs={12} md={6} className="mb-4 mb-md-0">
                <div className="h-100 p-3 p-md-4 bg-light rounded">
                  <h3 className="h4 h3-md mb-3">Our Mission</h3>
                  <p className="mb-0 fs-6">
                    To provide cutting-edge security solutions that protect homes, businesses, 
                    and communities through innovative technology and exceptional service.
                  </p>
                </div>
              </Col>
              <Col xs={12} md={6}>
                <div className="h-100 p-3 p-md-4 bg-light rounded">
                  <h3 className="h4 h3-md mb-3">Our Vision</h3>
                  <p className="mb-0 fs-6">
                    To be the most trusted security solutions provider, recognized for our 
                    reliability, innovation, and customer-centric approach.
                  </p>
                </div>
              </Col>
            </Row>

            {/* Our Projects Section */}
            <div className="mt-4 mt-md-5 p-4 bg-primary text-white rounded-3">
              <Row className="align-items-center">
                <Col xs={12} md={8}>
                  <h3 className="h3 h2-md mb-2">Our Successful Projects</h3>
                  <p className="mb-3 mb-md-0 fs-6 opacity-90">
                    Explore our portfolio of successful security implementations across various sectors. 
                    From residential complexes to government facilities, we've delivered excellence in every project.
                  </p>
                </Col>
                <Col xs={12} md={4} className="text-center text-md-end">
                  <Button 
                    variant="warning" 
                    size="lg"
                    onClick={() => setShowProjectsModal(true)}
                    className="fw-bold px-4 py-2"
                  >
                    <i className="bi bi-folder2-open me-2"></i>
                    View Our Projects
                  </Button>
                </Col>
              </Row>
            </div>

            <div className="mt-4 mt-md-5">
              <h3 className="h4 h3-md mb-3">Why Choose Us?</h3>
              <Row>
                <Col xs={12} md={6}>
                  <ul className="list-unstyled">
                    <li className="mb-2 fs-6">
                      <i className="bi bi-check-circle-fill text-primary me-2"></i>
                      Premium quality products from trusted brands
                    </li>
                    <li className="mb-2 fs-6">
                      <i className="bi bi-check-circle-fill text-primary me-2"></i>
                      Expert installation by certified professionals
                    </li>
                    <li className="mb-2 fs-6">
                      <i className="bi bi-check-circle-fill text-primary me-2"></i>
                      24/7 customer support and maintenance
                    </li>
                  </ul>
                </Col>
                <Col xs={12} md={6}>
                  <ul className="list-unstyled">
                    <li className="mb-2 fs-6">
                      <i className="bi bi-check-circle-fill text-primary me-2"></i>
                      Customized solutions for every need
                    </li>
                    <li className="mb-2 fs-6">
                      <i className="bi bi-check-circle-fill text-primary me-2"></i>
                      Competitive pricing with warranty
                    </li>
                    <li className="mb-2 fs-6">
                      <i className="bi bi-check-circle-fill text-primary me-2"></i>
                      Timely project execution
                    </li>
                  </ul>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Projects Modal */}
      <Modal 
        show={showProjectsModal} 
        onHide={() => setShowProjectsModal(false)} 
        size="xl"
        centered
        scrollable
      >
        <Modal.Header closeButton className="p-3 p-md-4">
          <Modal.Title className="h4 h3-md">
            <i className="bi bi-folder2-open text-primary me-2"></i>
            Our Successful Projects Portfolio
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-3 p-md-4">
          

          {error && (
            <Alert variant="warning" className="mb-4">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status" variant="primary" />
              <p className="mt-2 text-muted">Loading projects...</p>
            </div>
          ) : (
            renderProjects()
          )}
        </Modal.Body>
        <Modal.Footer className="p-3 p-md-4">
          <div className="w-100 text-center">
            <p className="text-muted mb-3 fs-6">
              Interested in a similar solution for your property? Contact us for a free consultation.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Button 
                variant="primary"
                onClick={() => {
                  setShowProjectsModal(false)
                  // Navigate to contact page
                  window.location.href = '/contact'
                }}
              >
                <i className="bi bi-telephone me-2"></i>
                Contact Us
              </Button>
              <Button 
                variant="outline-primary"
                onClick={() => {
                  setShowProjectsModal(false)
                  // Navigate to appointment page
                  window.location.href = '/appointment'
                }}
              >
                <i className="bi bi-calendar-check me-2"></i>
                Book Free Consultation
              </Button>
              <Button 
                    variant="success"
                    onClick={() => {
                      // Create a temporary anchor tag to trigger download
                      const link = document.createElement('a');
                      link.href = '/UNIQUE ENTERPRISES COMPANY PROFILE.pdf'; // Path to your PDF in public folder
                      link.download = 'Unique-CCTV-Portfolio.pdf'; // Suggested filename
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <i className="bi bi-download me-2"></i>
                    Download Company Profile
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default About