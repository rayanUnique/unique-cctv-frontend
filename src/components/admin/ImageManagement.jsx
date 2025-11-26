import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Form, Alert, Modal } from 'react-bootstrap';
import { fileUploadService } from '../../services/api';

const ImageManagement = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [imageType, setImageType] = useState('product'); // Better state management

  // Sample images - in real app, these would come from API
  const [images, setImages] = useState([
    { id: 1, name: 'hero-image.jpg', url: '/api/images/hero-image.jpg', type: 'hero', uploadDate: '2024-01-15' },
    { id: 2, name: 'slide-1.jpg', url: '/api/images/slide-1.jpg', type: 'slide', uploadDate: '2024-01-15' },
    { id: 3, name: 'slide-2.jpg', url: '/api/images/slide-2.jpg', type: 'slide', uploadDate: '2024-01-15' },
    { id: 4, name: 'product-1.jpg', url: '/api/images/product-1.jpg', type: 'product', uploadDate: '2024-01-14' },
    { id: 5, name: 'product-2.jpg', url: '/api/images/product-2.jpg', type: 'product', uploadDate: '2024-01-14' },
  ]);

  // Load real images from API (when you implement it)
  useEffect(() => {
    // loadImagesFromAPI();
  }, []);

  // Add this function inside your component
const debugUpload = async () => {
  console.log('=== 🐛 UPLOAD DEBUG START ===');
  
  // Check token
  const token = localStorage.getItem('token');
  console.log('🔐 Token exists:', !!token);
  console.log('Token:', token);
  
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('📄 Token payload:', payload);
      console.log('🎯 Roles in token:', payload.roles);
    } catch (e) {
      console.error('❌ Token decode error:', e);
    }
  }

  // Test the upload endpoint directly
  try {
    console.log('🧪 Testing upload endpoint...');
    
    // Create a simple test file
    const blob = new Blob(['test'], { type: 'image/png' });
    const testFile = new File([blob], 'test.png', { type: 'image/png' });
    
    const formData = new FormData();
    formData.append('file', testFile);

    console.log('📤 Making direct fetch request...');
    
    const response = await fetch('http://localhost:8080/api/upload/image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type - let browser set it for FormData
      },
      body: formData
    });

    console.log('📨 Response status:', response.status);
    console.log('📨 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Upload successful:', result);
    } else {
      const errorText = await response.text();
      console.log('❌ Upload failed:', errorText);
      
      if (response.status === 401) {
        console.log('🔐 401 Unauthorized - Token issue');
      } else if (response.status === 403) {
        console.log('🚫 403 Forbidden - Role issue');
      }
    }
  } catch (error) {
    console.error('💥 Fetch error:', error);
  }
  
  console.log('=== 🐛 UPLOAD DEBUG END ===');
};

// Call this function when component mounts or add a debug button
useEffect(() => {
  debugUpload();
}, []);
  const handleImageUpload = async (file, type, slideId = null) => {
  setSaving(true);
  setMessage('');
  
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fileUploadService.uploadImage(formData);
    
    console.log('✅ Server response:', response.data);
    
    const fileUrl = response.data.fileUrl;
    const fileName = response.data.fileName;
    
    if (!fileUrl || !fileName) {
      throw new Error('Server did not return file URL or name');
    }

    console.log('🖼️ Setting image for:', type, slideId);

    if (type === 'hero') {
      setImagePreview(prev => ({ ...prev, hero: fileUrl }));
      setHomepageData(prev => ({
        ...prev,
        hero: {
          ...prev.hero,
          image: fileName // Store ONLY the file name
        }
      }));
    } else if (type === 'slide' && slideId) {
      const slideKey = `slide-${slideId}`;
      
      console.log('🎯 Updating slide:', slideId, 'with key:', slideKey);
      
      setImagePreview(prev => ({ 
        ...prev, 
        [slideKey]: fileUrl 
      }));
      
      setHomepageData(prev => ({
        ...prev,
        slides: prev.slides.map(slide => {
          if (slide.id === slideId) {
            console.log('📝 Updating slide data:', slide.id, 'with image:', fileName);
            return { 
              ...slide, 
              image: fileName // Store ONLY the file name
            };
          }
          return slide;
        })
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

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      return;
    }

    try {
      // TODO: Add API call to delete image from server
      // await fileUploadService.deleteImage(imageId);
      
      setImages(prev => prev.filter(img => img.id !== imageId));
      setMessage('✅ Image deleted successfully!');
      
      // Close preview modal if deleting the currently previewed image
      if (selectedImage && selectedImage.id === imageId) {
        setSelectedImage(null);
      }
    } catch (error) {
      console.error('Delete error:', error);
      setMessage('❌ Error deleting image');
    }
  };

  const getImageTypeBadge = (type) => {
    const badges = {
      hero: 'danger',
      slide: 'warning',
      product: 'success',
      general: 'info',
      default: 'secondary'
    };
    return badges[type] || badges.default;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage('❌ Please select an image file (JPG, PNG, GIF, WEBP, etc.)');
      setSelectedFile(null);
      return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setMessage('❌ File size too large. Maximum size is 10MB.');
      setSelectedFile(null);
      return;
    }
    
    setSelectedFile(file);
    setMessage('');
  };

  const handleUploadSubmit = () => {
    if (!selectedFile) {
      setMessage('❌ Please select an image file');
      return;
    }

    handleImageUpload(selectedFile, imageType);
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
    setSelectedFile(null);
    setMessage('');
    setImageType('product');
  };

  const getImageDisplayUrl = (imageUrl) => {
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    // Ensure proper URL format for local images
    return imageUrl.startsWith('/') ? imageUrl : `/api/images/${imageUrl}`;
  };

  return (
    <div>
      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0">🖼️ Media Library</h5>
            <p className="text-muted mb-0">Manage all images for your website</p>
          </div>
          <Button variant="primary" onClick={() => setShowUploadModal(true)}>
            <i className="bi bi-cloud-upload me-2"></i>
            Upload New Image
          </Button>
        </Card.Header>
        
        <Card.Body>
          {message && (
            <Alert variant={
              message.includes('✅') ? 'success' : 
              message.includes('❌') ? 'danger' : 
              'info'
            }>
              {message}
            </Alert>
          )}

          <Row>
            {images.map(image => (
              <Col key={image.id} md={4} className="mb-4">
                <Card className="h-100 image-card shadow-sm">
                  <Card.Img 
                    variant="top" 
                    src={getImageDisplayUrl(image.url)} 
                    style={{ 
                      height: '200px', 
                      objectFit: 'cover',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedImage(image)}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                    }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className={`badge bg-${getImageTypeBadge(image.type)}`}>
                        {image.type.toUpperCase()}
                      </span>
                      <small className="text-muted">{image.uploadDate}</small>
                    </div>
                    <Card.Title 
                      className="small text-truncate" 
                      title={image.name}
                      style={{ cursor: 'default' }}
                    >
                      {image.name}
                    </Card.Title>
                    <div className="mt-auto">
                      <div className="d-grid gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => setSelectedImage(image)}
                        >
                          <i className="bi bi-eye me-1"></i>
                          Preview
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteImage(image.id)}
                        >
                          <i className="bi bi-trash me-1"></i>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {images.length === 0 && (
            <div className="text-center py-5">
              <i className="bi bi-images text-muted" style={{ fontSize: '3rem' }}></i>
              <h5 className="mt-3 text-muted">No images uploaded yet</h5>
              <p className="text-muted">Start by uploading your first image</p>
              <Button variant="primary" onClick={() => setShowUploadModal(true)}>
                <i className="bi bi-cloud-upload me-2"></i>
                Upload First Image
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Upload Modal */}
      <Modal show={showUploadModal} onHide={handleCloseUploadModal}>
        <Modal.Header closeButton>
          <Modal.Title>Upload New Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select Image File *</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
              />
              <Form.Text className="text-muted">
                Supported formats: JPG, PNG, GIF, WEBP. Max size: 10MB
              </Form.Text>
              {selectedFile && (
                <div className="mt-2 p-2 bg-light rounded">
                  <small>
                    <strong>Selected file:</strong> {selectedFile.name} 
                    ({Math.round(selectedFile.size / 1024)} KB)
                  </small>
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image Type</Form.Label>
              <Form.Select 
                value={imageType}
                onChange={(e) => setImageType(e.target.value)}
                disabled={uploading}
              >
                <option value="product">Product Image</option>
                <option value="hero">Hero Section Image</option>
                <option value="slide">Slideshow Image</option>
                <option value="general">General Purpose</option>
              </Form.Select>
              <Form.Text className="text-muted">
                Choose how this image will be used on the website
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={handleCloseUploadModal}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            disabled={!selectedFile || uploading}
            onClick={handleUploadSubmit}
          >
            {uploading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Uploading...
              </>
            ) : (
              <>
                <i className="bi bi-cloud-upload me-2"></i>
                Upload Image
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Image Preview Modal */}
      <Modal show={!!selectedImage} onHide={() => setSelectedImage(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-image me-2"></i>
            {selectedImage?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedImage && (
            <>
              <img 
                src={getImageDisplayUrl(selectedImage.url)} 
                alt="Preview" 
                className="img-fluid rounded shadow"
                style={{ 
                  maxHeight: '60vh', 
                  maxWidth: '100%',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
                }}
              />
              <div className="mt-3 text-start">
                <p><strong>Name:</strong> {selectedImage.name}</p>
                <p>
                  <strong>Type:</strong> {' '}
                  <span className={`badge bg-${getImageTypeBadge(selectedImage.type)}`}>
                    {selectedImage.type.toUpperCase()}
                  </span>
                </p>
                <p><strong>Uploaded:</strong> {selectedImage.uploadDate}</p>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedImage(null)}>
            Close
          </Button>
          <Button 
            variant="outline-primary"
            onClick={() => {
              // Copy image URL to clipboard
              navigator.clipboard.writeText(getImageDisplayUrl(selectedImage.url));
              setMessage('✅ Image URL copied to clipboard!');
              setSelectedImage(null);
            }}
          >
            <i className="bi bi-clipboard me-2"></i>
            Copy URL
          </Button>
          <Button 
            variant="danger"
            onClick={() => {
              if (selectedImage) {
                handleDeleteImage(selectedImage.id);
              }
            }}
          >
            <i className="bi bi-trash me-2"></i>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ImageManagement;