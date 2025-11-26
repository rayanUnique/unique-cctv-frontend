import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Alert, Tabs, Tab, Image, Container } from 'react-bootstrap';
import { homepageService, fileUploadService } from '../../services/api';

const HomepageManagement = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [homepageData, setHomepageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadHomepageContent();
  }, []);

  const loadHomepageContent = async () => {
    setLoading(true);
    try {
      const response = await homepageService.getHomepageContent();
      const data = response.data;
      
      console.log('📥 Loaded homepage data from API:', data);
      
      // ✅ FIXED: No need to clean paths - DTO now returns raw filenames
      const safeData = {
        hero: {
          image: data.heroImage || '', // Raw filename from DTO
          title: data.heroTitle || 'Welcome to Unique CCTV',
          subtitle: data.heroSubtitle || 'Your trusted partner for advanced security and surveillance solutions.',
          buttonText: data.heroButtonText || 'View Our Products'
        },
        slides: [
          {
            id: 1,
            image: data.slide1Image || '', // Raw filename from DTO
            title: data.slide1Title || 'Advanced Security Solutions',
            description: data.slide1Description || 'State-of-the-art CCTV systems for complete protection',
            buttonText: data.slide1ButtonText || 'Explore Solutions'
          },
          {
            id: 2,
            image: data.slide2Image || '', // Raw filename from DTO
            title: data.slide2Title || '24/7 Monitoring',
            description: data.slide2Description || 'Round-the-clock surveillance for your peace of mind',
            buttonText: data.slide2ButtonText || 'Learn More'
          },
          {
            id: 3,
            image: data.slide3Image || '', // Raw filename from DTO
            title: data.slide3Title || 'Smart Access Control',
            description: data.slide3Description || 'Biometric and advanced access control systems',
            buttonText: data.slide3ButtonText || 'Get Started'
          },
          {
            id: 4,
            image: data.slide4Image || '', // Raw filename from DTO
            title: data.slide4Title || 'Professional Installation',
            description: data.slide4Description || 'Expert installation by certified security professionals',
            buttonText: data.slide4ButtonText || 'Contact Us'
          }
        ]
      };

      console.log('✅ Processed homepage data:', safeData);
      
      setHomepageData(safeData);
    } catch (error) {
      console.error('❌ Failed to load homepage content:', error);
      setMessage('❌ Failed to load homepage content');
      setHomepageData(getDefaultHomepageData());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultHomepageData = () => ({
    hero: {
      image: '',
      title: 'Welcome to Unique CCTV',
      subtitle: 'Your trusted partner for advanced security and surveillance solutions. We provide high-quality CCTV systems, Alarm Monitoring, Biometrics & Access Control Systems, Networking.',
      buttonText: 'View Our Products'
    },
    slides: [
      {
        id: 1,
        image: '',
        title: 'Advanced Security Solutions',
        description: 'State-of-the-art CCTV systems for complete protection',
        buttonText: 'Explore Solutions'
      },
      {
        id: 2,
        image: '',
        title: '24/7 Monitoring',
        description: 'Round-the-clock surveillance for your peace of mind',
        buttonText: 'Learn More'
      },
      {
        id: 3,
        image: '',
        title: 'Smart Access Control',
        description: 'Biometric and advanced access control systems',
        buttonText: 'Get Started'
      },
      {
        id: 4,
        image: '',
        title: 'Professional Installation',
        description: 'Expert installation by certified security professionals',
        buttonText: 'Contact Us'
      }
    ]
  });

  const handleHeroChange = (field, value) => {
    setHomepageData(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value
      }
    }));
  };

  const handleSlideChange = (slideId, field, value) => {
    setHomepageData(prev => ({
      ...prev,
      slides: prev.slides.map(slide =>
        slide.id === slideId ? { ...slide, [field]: value } : slide
      )
    }));
  };

  const handleImageUpload = async (file, type, slideId = null) => {
  setSaving(true);
  setMessage('');
  
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fileUploadService.uploadImage(formData);
    
    console.log('✅ Server response:', response.data);
    
    // ✅ FIXED: Only fileName is returned by the server
    const fileName = response.data.fileName;
    
    if (!fileName) {
      throw new Error('Server did not return file name');
    }

    // ✅ If you need a fileUrl, construct it from the fileName
    // Assuming files are served from /uploads/ directory
    const fileUrl = `/uploads/${fileName}`;

    // Update state with filename only
    if (type === 'hero') {
      setHomepageData(prev => ({
        ...prev,
        hero: {
          ...prev.hero,
          image: fileName // Store only filename
        }
      }));
    } else if (type === 'slide' && slideId) {
      setHomepageData(prev => ({
        ...prev,
        slides: prev.slides.map(slide =>
          slide.id === slideId ? { ...slide, image: fileName } : slide
        )
      }));
    }

    setMessage('✅ Image uploaded successfully! File saved to server.');
    
  } catch (error) {
    console.error('❌ Image upload failed:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Upload failed';
    setMessage(`❌ Error uploading image: ${errorMessage}`);
  } finally {
    setSaving(false);
  }
};
  const handleSaveHomepage = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      // ✅ FIXED: No need to extract filenames - data already contains filenames
      const backendData = {
        heroImage: homepageData.hero.image, // Already a filename
        heroTitle: homepageData.hero.title,
        heroSubtitle: homepageData.hero.subtitle,
        heroButtonText: homepageData.hero.buttonText,
        slide1Image: homepageData.slides[0].image, // Already a filename
        slide1Title: homepageData.slides[0].title,
        slide1Description: homepageData.slides[0].description,
        slide1ButtonText: homepageData.slides[0].buttonText,
        slide2Image: homepageData.slides[1].image, // Already a filename
        slide2Title: homepageData.slides[1].title,
        slide2Description: homepageData.slides[1].description,
        slide2ButtonText: homepageData.slides[1].buttonText,
        slide3Image: homepageData.slides[2].image, // Already a filename
        slide3Title: homepageData.slides[2].title,
        slide3Description: homepageData.slides[2].description,
        slide3ButtonText: homepageData.slides[2].buttonText,
        slide4Image: homepageData.slides[3].image, // Already a filename
        slide4Title: homepageData.slides[3].title,
        slide4Description: homepageData.slides[3].description,
        slide4ButtonText: homepageData.slides[3].buttonText
      };

      console.log('💾 Saving to database:', backendData);
      
      await homepageService.updateHomepageContent(backendData);
      setMessage('✅ Homepage content saved successfully!');
      
      // Reload data to get fresh state
      setTimeout(() => {
        loadHomepageContent();
      }, 500);
      
    } catch (error) {
      console.error('❌ Save failed:', error);
      setMessage('❌ Error saving homepage content: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleResetSection = (section) => {
    if (section === 'hero') {
      setHomepageData(prev => ({
        ...prev,
        hero: getDefaultHomepageData().hero
      }));
    } else if (section === 'slides') {
      setHomepageData(prev => ({
        ...prev,
        slides: getDefaultHomepageData().slides
      }));
    }
    setMessage('✅ Section reset to defaults');
  };

  const getImageUrl = (imagePath) => {
    console.log('🖼️ Getting image URL for:', imagePath);
    
    if (!imagePath) {
      return '';
    }
    
    const pathString = String(imagePath);
    
    // If it's already a full URL, use it directly
    if (pathString.startsWith('http')) {
      return pathString;
    }
    
    // If it starts with /api/images/, create full backend URL
    if (pathString.startsWith('/api/images/')) {
      return `http://localhost:8080${pathString}`;
    }
    
    // If it's just a file name, create the full URL
    return `http://localhost:8080/api/images/${pathString}`;
  };

  if (loading || !homepageData) {
    return (
      <Container fluid>
        <Card className="shadow-sm">
          <Card.Body className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading homepage content...</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Card className="shadow-sm">
        <Card.Header className="bg-white d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0">🏠 Homepage Content Management</h5>
            <p className="text-muted mb-0">Control what visitors see on your homepage</p>
          </div>
          <Button 
            variant="primary" 
            onClick={handleSaveHomepage}
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Saving...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-2"></i>
                Save All Changes
              </>
            )}
          </Button>
        </Card.Header>
        
        <Card.Body>
          {message && (
            <Alert variant={message.includes('✅') ? 'success' : message.includes('⚠️') ? 'warning' : 'danger'}>
              {message}
            </Alert>
          )}

          <Tabs 
            activeKey={activeTab} 
            onSelect={(tab) => setActiveTab(tab)}
            className="mb-4 homepage-management"
          >
            <Tab eventKey="hero" title="Hero Section">
              <HeroSectionManagement 
                data={homepageData.hero}
                onChange={handleHeroChange}
                onImageUpload={handleImageUpload}
                getImageUrl={getImageUrl}
                onReset={() => handleResetSection('hero')}
                loading={saving}
              />
            </Tab>

            <Tab eventKey="slides" title="Slideshow">
              <SlideshowManagement 
                slides={homepageData.slides}
                getImageUrl={getImageUrl}
                onChange={handleSlideChange}
                onImageUpload={handleImageUpload}
                onReset={() => handleResetSection('slides')}
                loading={saving}
              />
            </Tab>

            <Tab eventKey="preview" title="Live Preview">
              <HomepagePreview data={homepageData} getImageUrl={getImageUrl} />
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
};

// Hero Section Management Component
const HeroSectionManagement = ({ data, onChange, onImageUpload, onReset, loading, getImageUrl }) => {
  return (
    <Row>
      <Col lg={6}>
        <Card>
          <Card.Header>
            <h6 className="mb-0">Hero Image & Content</h6>
          </Card.Header>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>Hero Title</Form.Label>
              <Form.Control
                type="text"
                value={data.title}
                onChange={(e) => onChange('title', e.target.value)}
                placeholder="Enter main hero title"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Hero Subtitle</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={data.subtitle}
                onChange={(e) => onChange('subtitle', e.target.value)}
                placeholder="Enter hero subtitle text"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Button Text</Form.Label>
              <Form.Control
                type="text"
                value={data.buttonText}
                onChange={(e) => onChange('buttonText', e.target.value)}
                placeholder="Enter button text"
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="outline-warning" onClick={onReset}>
                <i className="bi bi-arrow-clockwise me-2"></i>
                Reset to Defaults
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col lg={6}>
        <Card>
          <Card.Header>
            <h6 className="mb-0">Hero Image</h6>
          </Card.Header>
          <Card.Body>
            <div className="text-center mb-4">
              {data.image ? (
                <Image
                  src={getImageUrl(data.image)}
                  alt="Hero preview"
                  fluid
                  rounded
                  style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    console.error('❌ Hero image failed to load:', e.target.src);
                    e.target.style.display = 'none';
                    const parent = e.target.parentElement;
                    const fallback = document.createElement('div');
                    fallback.className = 'bg-secondary d-flex align-items-center justify-content-center text-white';
                    fallback.style.minHeight = '300px';
                    fallback.style.width = '100%';
                    fallback.innerHTML = '<div class="text-center"><i class="bi bi-image fs-1"></i><br><small>Hero Image Not Found</small></div>';
                    parent.appendChild(fallback);
                  }}
                />
              ) : (
                <div 
                  className="bg-light rounded d-flex flex-column align-items-center justify-content-center p-5"
                  style={{ minHeight: '300px' }}
                >
                  <i className="bi bi-image text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                  <p className="text-muted mb-0">No hero image uploaded</p>
                </div>
              )}
            </div>

            <Form.Group>
              <Form.Label>Upload Hero Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) onImageUpload(file, 'hero');
                }}
                disabled={loading}
              />
              <Form.Text className="text-muted">
                Recommended: 1200x800px, JPG/PNG format. This will be the main banner image.
              </Form.Text>
            </Form.Group>

            <div className="mt-3 p-3 bg-light rounded">
              <h6>💡 Hero Section Tips:</h6>
              <ul className="small mb-0">
                <li>Use high-quality, professional images</li>
                <li>Keep title short and impactful</li>
                <li>Subtitle should explain your key services</li>
                <li>Button text should be action-oriented</li>
              </ul>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

// Slideshow Management Component
const SlideshowManagement = ({ slides, getImageUrl, onChange, onImageUpload, onReset, loading }) => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h6>Slideshow Management</h6>
          <p className="text-muted mb-0">Manage the slideshow that appears on your homepage</p>
        </div>
        <Button variant="outline-warning" size="sm" onClick={onReset}>
          <i className="bi bi-arrow-clockwise me-1"></i>
          Reset All Slides
        </Button>
      </div>

      {slides.map((slide, index) => (
        <Card key={slide.id} className="mb-4">
          <Card.Header className="bg-light">
            <h6 className="mb-0">Slide {index + 1}</h6>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>Slide Image</Form.Label>
                  <div className="mb-3">
                    {slide.image ? (
                      <Image
                        src={getImageUrl(slide.image)}
                        alt={`Slide ${index + 1} preview`}
                        fluid
                        rounded
                        style={{ height: '200px', width: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          console.error('❌ Slide image failed to load:', e.target.src);
                          e.target.style.display = 'none';
                          const parent = e.target.parentElement;
                          const fallback = document.createElement('div');
                          fallback.className = 'bg-secondary d-flex align-items-center justify-content-center text-white';
                          fallback.style.height = '200px';
                          fallback.style.width = '100%';
                          fallback.innerHTML = '<div class="text-center"><i class="bi bi-image fs-1"></i><br><small>Image Not Found</small></div>';
                          parent.appendChild(fallback);
                        }}
                      />
                    ) : (
                      <div 
                        className="bg-light rounded d-flex flex-column align-items-center justify-content-center"
                        style={{ height: '200px' }}
                      >
                        <i className="bi bi-image text-muted mb-2"></i>
                        <small className="text-muted">No image uploaded</small>
                      </div>
                    )}
                  </div>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) onImageUpload(file, 'slide', slide.id);
                    }}
                    disabled={loading}
                  />
                  <Form.Text className="text-muted">
                    Recommended: 1600x900px, JPG/PNG format
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={7}>
                <Form.Group className="mb-3">
                  <Form.Label>Slide Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={slide.title}
                    onChange={(e) => onChange(slide.id, 'title', e.target.value)}
                    placeholder="Enter slide title"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Slide Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={slide.description}
                    onChange={(e) => onChange(slide.id, 'description', e.target.value)}
                    placeholder="Enter slide description"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Button Text</Form.Label>
                  <Form.Control
                    type="text"
                    value={slide.buttonText}
                    onChange={(e) => onChange(slide.id, 'buttonText', e.target.value)}
                    placeholder="Enter button text"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}

      <Card className="bg-light">
        <Card.Body>
          <h6>🎯 Slideshow Best Practices:</h6>
          <Row>
            <Col md={6}>
              <ul className="small mb-0">
                <li>Use consistent image sizes for all slides</li>
                <li>Keep titles short and impactful (3-5 words)</li>
                <li>Descriptions should be brief but informative</li>
              </ul>
            </Col>
            <Col md={6}>
              <ul className="small mb-0">
                <li>Use high-quality, relevant images</li>
                <li>Button text should match the slide content</li>
                <li>Maintain consistent branding colors</li>
              </ul>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

// Homepage Preview Component (unchanged)
const HomepagePreview = ({ data, getImageUrl }) => {
  return (
    <div className="preview-container">
      <Card className="mb-4">
        <Card.Header>
          <h6 className="mb-0">📱 Live Preview</h6>
        </Card.Header>
        <Card.Body>
          <p className="text-muted">
            This is how your homepage will look to visitors. Changes are updated in real-time.
          </p>
        </Card.Body>
      </Card>

      {/* Hero Section Preview */}
      <Card className="mb-4">
        <Card.Header className="bg-primary text-white">
          <h6 className="mb-0">Hero Section Preview</h6>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="hero-preview">
            {data.hero.image && (
              <img 
                src={getImageUrl(data.hero.image)} 
                alt="Hero preview" 
                className="hero-image"
                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
              />
            )}
            <div className="hero-content" style={{ 
              position: data.hero.image ? 'absolute' : 'static',
              top: '50%',
              left: '0',
              right: '0',
              transform: data.hero.image ? 'translateY(-50%)' : 'none',
              padding: '2rem',
              color: data.hero.image ? 'white' : 'inherit',
              textShadow: data.hero.image ? '2px 2px 4px rgba(0,0,0,0.5)' : 'none'
            }}>
              <div className="container">
                <h1 className="display-4 fw-bold mb-3">{data.hero.title}</h1>
                <p className="lead mb-4" style={{ fontSize: '1.25rem', maxWidth: '600px' }}>
                  {data.hero.subtitle}
                </p>
                <button className="btn btn-primary btn-lg">
                  {data.hero.buttonText}
                </button>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Slideshow Preview */}
      <Card>
        <Card.Header className="bg-secondary text-white">
          <h6 className="mb-0">Slideshow Preview</h6>
        </Card.Header>
        <Card.Body>
          <div className="slideshow-preview">
            {data.slides.map((slide, index) => (
              <Card key={slide.id} className="mb-3">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col md={4}>
                      {slide.image ? (
                        <img 
                          src={getImageUrl(slide.image)} 
                          alt={`Slide ${index + 1}`}
                          className="img-fluid rounded"
                          style={{ height: '150px', width: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div 
                          className="bg-light rounded d-flex align-items-center justify-content-center"
                          style={{ height: '150px' }}
                        >
                          <span className="text-muted">No Image</span>
                        </div>
                      )}
                    </Col>
                    <Col md={8}>
                      <h5>{slide.title}</h5>
                      <p className="text-muted mb-2">{slide.description}</p>
                      <button className="btn btn-outline-primary btn-sm">
                        {slide.buttonText}
                      </button>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer className="text-muted small">
                  Slide {index + 1} of {data.slides.length}
                </Card.Footer>
              </Card>
            ))}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default HomepageManagement;