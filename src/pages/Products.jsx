import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Alert, Spinner, Modal, Button, Badge } from 'react-bootstrap';
import { productService } from '../services/api';
import { handleApiError } from '../utils/errorHandler';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await productService.getAllProducts();
      console.log('📦 Products API Response:', response.data);
      setProducts(response.data);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ADDED: Helper function to get proper image URLs
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return '';
    }
    
    const pathString = String(imagePath);
    
    // If it's already a full URL, use it directly
    if (pathString.startsWith('http') || pathString.startsWith('blob:') || pathString.startsWith('data:')) {
      return pathString;
    }
    
    // If it starts with /api/images/, create full backend URL
    if (pathString.startsWith('/api/images/')) {
      return `http://localhost:8080${pathString}`;
    }
    
    // If it's just a file name, create full backend URL
    return `http://localhost:8080/api/images/${pathString}`;
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (category !== 'all') {
      filtered = filtered.filter(product => product.category === category);
    }

    setFilteredProducts(filtered);
  };

  // ✅ ADDED: Function to handle View Details click
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  };

  // ✅ ADDED: Function to close details modal
  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <Container className="my-4 my-md-5 text-center">
        <Spinner animation="border" role="status" className="me-2" />
        <span>Loading products...</span>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-4 my-md-5">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
        <div className="text-center">
          <button 
            className="btn btn-primary"
            onClick={fetchProducts}
          >
            Try Again
          </button>
        </div>
      </Container>
    );
  }

  const categories = ['all', ...new Set(products.map(product => product.category))];

  return (
    <div className="w-100">
      <Container fluid className="px-3 px-md-4 my-4 my-md-5">
        {/* Updated Heading Section */}
        <div className="text-center mb-4 mb-md-5">
          <h1 className="products-main-title h2 h1-md">
            Our <span className="title-accent">CCTV Products</span>
          </h1>
          <p className="products-subtitle fs-6 fs-md-4">
            Discover our range of high-quality security solutions
          </p>
        </div>
        
        {/* Filters - Stack on mobile */}
        <Row className="mb-4">
          <Col xs={12} md={6} className="mb-3 mb-md-0">
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Search products by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="lg"
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                size="lg"
              >
                <option value="all">All Categories</option>
                {categories
                  .filter(cat => cat !== 'all')
                  .map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))
                }
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Products Grid */}
        <Row>
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => {
              const imageUrl = getImageUrl(product.image);
              console.log(`🖼️ Product ${product.id}:`, {
                name: product.name,
                imageField: product.image,
                imageUrl: imageUrl
              });

              return (
                <Col key={product.id} xs={12} sm={6} lg={4} className="mb-4">
                  <div className="card h-100 shadow-sm product-card">
                    <div 
                      className="product-image d-flex align-items-center justify-content-center"
                      style={{ 
                        height: '200px',
                        background: imageUrl ? `url(${imageUrl}) center/cover` : '#6c757d'
                      }}
                    >
                      {!imageUrl && (
                        <span className="text-white">No Image</span>
                      )}
                    </div>
                    <div className="card-body d-flex flex-column p-3 p-md-4">
                      <h5 className="card-title h6 h5-md">{product.name}</h5>
                      <span className={`badge ${getCategoryBadgeColor(product.category)} mb-2`}>
                        {product.category}
                      </span>
                      <p className="card-text flex-grow-1 fs-6">{product.description}</p>
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h5 className="text-primary mb-0 fs-6 fs-md-5">₹{product.price}</h5>
                          <span className={`badge ${product.inStock ? 'bg-success' : 'bg-success'} fs-6`}>
                            {product.inStock ? 'In Stock' : 'In Stock'}
                          </span>
                        </div>
                        {/* ✅ UPDATED: Added onClick handler */}
                        <button 
                          className="btn btn-primary w-100 fs-6"
                          onClick={() => handleViewDetails(product)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </Col>
              );
            })
          ) : (
            <Col>
              <div className="text-center py-5">
                <h4 className="h5 h4-md">No products found</h4>
                <p className="text-muted fs-6">
                  {searchTerm || category !== 'all' 
                    ? 'Try adjusting your search or filter criteria' 
                    : 'No products available at the moment'
                  }
                </p>
                {(searchTerm || category !== 'all') && (
                  <button 
                    className="btn btn-outline-primary mt-2"
                    onClick={() => {
                      setSearchTerm('');
                      setCategory('all');
                    }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </Col>
          )}
        </Row>
      </Container>

      {/* ✅ ADDED: Product Details Modal */}
      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal} size="lg" centered>
        <Modal.Header closeButton className="p-3 p-md-4">
          <Modal.Title className="h5 h4-md">
            <i className="bi bi-info-circle me-2"></i>
            Product Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-3 p-md-4">
          {selectedProduct && (
            <div className="product-details">
              <Row>
                <Col xs={12} md={6}>
                  {/* Product Image */}
                  <div className="text-center mb-4">
                    <div 
                      className="product-detail-image rounded"
                      style={{
                        height: '300px',
                        background: getImageUrl(selectedProduct.image) 
                          ? `url(${getImageUrl(selectedProduct.image)}) center/cover` 
                          : '#6c757d',
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat'
                      }}
                    >
                      {!getImageUrl(selectedProduct.image) && (
                        <div className="d-flex align-items-center justify-content-center h-100">
                          <span className="text-white fs-5">No Image Available</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
                <Col xs={12} md={6}>
                  {/* Product Information */}
                  <div className="product-info">
                    <h3 className="h4 h3-md mb-3">{selectedProduct.name}</h3>
                    
                    <div className="mb-3">
                      <Badge bg={getCategoryBadgeColor(selectedProduct.category).replace('bg-', '')} className="fs-6">
                        {selectedProduct.category}
                      </Badge>
                      <Badge bg="success" className="ms-2 fs-6">
                        {selectedProduct.inStock ? 'In Stock' : 'In Stock'}
                      </Badge>
                    </div>

                    <div className="price-section mb-3">
                      <h4 className="text-primary h3 h2-md">₹{selectedProduct.price}</h4>
                    </div>

                    <div className="description-section mb-4">
                      <h5 className="h6 h5-md mb-2">Description</h5>
                      <p className="text-muted fs-6" style={{ whiteSpace: 'pre-wrap' }}>
                        {selectedProduct.description || 'No description available.'}
                      </p>
                    </div>

                    {/* Specifications */}
                    {selectedProduct.specifications && (
                      <div className="specifications-section mb-4">
                        <h5 className="h6 h5-md mb-2">Specifications</h5>
                        <div className="bg-light p-3 rounded">
                          <p className="mb-0 fs-6" style={{ whiteSpace: 'pre-wrap' }}>
                            {selectedProduct.specifications}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Additional Info */}
                    <div className="additional-info">
                      <Row>
                        <Col xs={6}>
                          <div className="text-muted fs-6">Category</div>
                          <div className="fw-semibold fs-6">{selectedProduct.category}</div>
                        </Col>
                        <Col xs={6}>
                          <div className="text-muted fs-6">Stock Status</div>
                          <div className="fw-semibold fs-6 text-success">
                            {selectedProduct.inStock ? 'Available' : 'In Stock'}
                          </div>
                        </Col>
                      </Row>
                      {/* {selectedProduct.stockQuantity !== undefined && (
                        <Row className="mt-2">
                          <Col xs={12}>
                            <div className="text-muted fs-6">Available Quantity</div>
                            <div className="fw-semibold fs-6">{selectedProduct.stockQuantity} units</div>
                          </Col>
                        </Row>
                      )} */}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="p-3 p-md-4">
          <Button variant="secondary" onClick={handleCloseDetailsModal} className="fs-6">
            Close
          </Button>
          {/* <Button variant="primary" className="fs-6">
            <i className="bi bi-cart me-2"></i>
            Add to Cart
          </Button>
          <Button variant="outline-primary" className="fs-6">
            <i className="bi bi-whatsapp me-2"></i>
            Contact via WhatsApp
          </Button> */}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

// Helper function for category badge colors
const getCategoryBadgeColor = (category) => {
  const colors = {
    dome: 'bg-primary',
    bullet: 'bg-success',
    ptz: 'bg-warning text-dark',
    ip: 'bg-info',
    wireless: 'bg-secondary'
  };
  return colors[category] || 'bg-secondary';
};

export default Products;