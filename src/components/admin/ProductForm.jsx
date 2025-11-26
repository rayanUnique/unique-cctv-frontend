import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert, Card, Badge } from 'react-bootstrap';
import { productService } from '../../services/api';

const ProductForm = ({ product, onSave, onCancel, onError }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'dome',
    specifications: '',
    stockQuantity: 0
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ FIXED: All products are always in stock
  const inStock = true;

  // ✅ CORRECT: Image URL helper function
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    
    const pathString = String(imagePath);
    
    if (pathString.startsWith('http') || pathString.startsWith('blob:') || pathString.startsWith('data:')) {
      return pathString;
    }
    
    if (pathString.startsWith('/api/images/')) {
      return `http://localhost:8080${pathString}`;
    }
    
    return `http://localhost:8080/api/images/${pathString}`;
  };

  useEffect(() => {
    console.log('🔄 useEffect - product changed:', product);
    if (product) {
      const newFormData = {
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || 'dome',
        specifications: product.specifications || '',
        stockQuantity: product.stockQuantity || 0
      };
      console.log('📝 Setting form data:', newFormData);
      console.log('🖼️ Product image field:', product.image);
      setFormData(newFormData);
      
      const previewUrl = product.image ? getImageUrl(product.image) : '';
      setImagePreview(previewUrl);
      setImageFile(null);
    } else {
      // Reset form for new product
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'dome',
        specifications: '',
        stockQuantity: 0
      });
      setImagePreview('');
      setImageFile(null);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    console.log(`📝 handleChange - Field: ${name}, Value: ${value}`);
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log('🖼️ Image selected:', file);
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      const previewUrl = product?.image ? getImageUrl(product.image) : '';
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('🔐 Debug - Token check:');
    console.log('   Token exists:', !!localStorage.getItem('token'));

    try {
      let image = product?.image || '';

      // Upload image if new file selected
      if (imageFile) {
        console.log('📤 Uploading image...');
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);
        
        const uploadResponse = await fetch('http://localhost:8080/api/upload/image', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: uploadFormData
        });

        if (!uploadResponse.ok) {
          throw new Error('Image upload failed');
        }

        const uploadResult = await uploadResponse.json();
        image = uploadResult.fileName;
        console.log('✅ Image uploaded, filename:', image);
      }

      // ✅ IMPROVED: Better number validation
      const finalPrice = formData.price === '' ? 0 : parseFloat(formData.price);
      const finalStockQuantity = formData.stockQuantity === '' ? 0 : parseInt(formData.stockQuantity);

      console.log('🔢 Final numeric values:', {
        stockQuantity: { raw: formData.stockQuantity, final: finalStockQuantity },
        price: { raw: formData.price, final: finalPrice }
      });

      // Enhanced validation
      if (isNaN(finalPrice) || finalPrice < 0) {
        throw new Error('Price must be a valid positive number');
      }
      if (isNaN(finalStockQuantity) || finalStockQuantity < 0) {
        throw new Error('Stock quantity must be a valid non-negative number');
      }

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: finalPrice,
        category: formData.category,
        specifications: formData.specifications?.trim() || '',
        inStock: true, // ✅ FIXED: Always true - all products are in stock
        stockQuantity: finalStockQuantity,
        image: image
      };

      console.log('📦 FINAL product data:', productData);

      if (product) {
        await productService.updateProduct(product.id, productData);
      } else {
        await productService.createProduct(productData);
      }

      console.log('✅ Product saved successfully!');
      onSave();
      
    } catch (err) {
      console.error('❌ API Error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save product';
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {/* ✅ SIMPLIFIED: Stock Status Indicator */}
      <div className="mb-3 p-3 bg-success bg-opacity-10 rounded border border-success">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <strong>Stock Status:</strong>
          </div>
          <Badge bg="success">
            ✅ ALL PRODUCTS IN STOCK
          </Badge>
        </div>
        <small className="text-muted">
          All products are marked as in stock regardless of quantity.
        </small>
      </div>
      
      <Row>
        <Col md={8}>
          <Form.Group className="mb-3">
            <Form.Label>Product Name *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter product name"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter product description"
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Price (₹) *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="0.00"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Category *</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="dome">Dome Camera</option>
                  <option value="bullet">Bullet Camera</option>
                  <option value="ptz">PTZ Camera</option>
                  <option value="ip">IP Camera</option>
                  <option value="wireless">Wireless Camera</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Specifications</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="specifications"
              value={formData.specifications}
              onChange={handleChange}
              disabled={loading}
              placeholder="Enter product specifications"
            />
          </Form.Group>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Stock Quantity (Optional)</Form.Label>
                <Form.Control
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  min="0"
                  disabled={loading}
                  placeholder="0"
                />
                <Form.Text className="text-muted">
                  Quantity is for reference only. All products are always in stock.
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header>
              <Card.Title>Product Image</Card.Title>
            </Card.Header>
            <Card.Body className="text-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="img-fluid rounded mb-3"
                  style={{ maxHeight: '200px', objectFit: 'cover' }}
                  onError={(e) => {
                    console.error('❌ Preview image failed to load:', imagePreview);
                    e.target.src = '/images/default-camera.jpg';
                    e.target.onerror = null;
                  }}
                />
              ) : (
                <div 
                  className="bg-light rounded d-flex align-items-center justify-content-center mb-3"
                  style={{ height: '200px' }}
                >
                  <span className="text-muted">No Image</span>
                </div>
              )}
              
              <Form.Group>
                <Form.Label>
                  {product?.image ? 'Change Image' : 'Upload Image'}
                </Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={loading}
                />
                <Form.Text className="text-muted">
                  Recommended: 500x500px, JPG/PNG format
                </Form.Text>
              </Form.Group>
            </Card.Body>
          </Card>
          
          {/* ✅ SIMPLIFIED: Stock Summary Card */}
          <Card className="mt-3 border-success">
            <Card.Header className="bg-success bg-opacity-10">
              <Card.Title className="h6 mb-0">📦 Stock Policy</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="small text-center">
                <Badge bg="success" className="mb-2">✅ IN STOCK</Badge>
                <p className="mb-0 text-muted">
                  All products are always available for purchase
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="d-flex gap-2 justify-content-end mt-3">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              {product ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            product ? 'Update Product' : 'Create Product'
          )}
        </Button>
      </div>
    </Form>
  );
};

export default ProductForm;