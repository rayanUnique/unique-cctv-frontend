import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Alert, Row, Col, Badge } from 'react-bootstrap';
import { productService } from '../../services/api';
import ProductForm from './ProductForm';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

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

  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading products...');
      const response = await productService.getAllProducts();
      console.log('✅ Products loaded:', response.data);
      
      // ✅ ADDED: Debug logging for image fields
      response.data.forEach(product => {
        console.log(`🖼️ Product ${product.id}:`, {
          name: product.name,
          imageField: product.image,
          imageUrl: getImageUrl(product.image)
        });
      });
      
      setProducts(response.data);
    } catch (err) {
      console.error('❌ Error loading products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    console.log('🆕 Creating new product');
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    console.log('✏️ Editing product:', product);
    console.log('🖼️ Product image data:', {
      imageField: product.image,
      imageUrl: getImageUrl(product.image)
    });
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        console.log('🗑️ Deleting product:', productId);
        await productService.deleteProduct(productId);
        loadProducts();
      } catch (err) {
        console.error('❌ Error deleting product:', err);
        setError('Failed to delete product');
      }
    }
  };

  const handleSave = () => {
    console.log('💾 Save completed, reloading products...');
    setShowModal(false);
    loadProducts();
  };

  const handleSaveError = (errorMessage) => {
    console.error('❌ Save error:', errorMessage);
    setError(errorMessage);
    setShowModal(false);
  };

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Product Management</h5>
        <Button variant="primary" onClick={handleCreate}>
          <i className="bi bi-plus-circle me-2"></i>
          Add New Product
        </Button>
      </Card.Header>
      
      <Card.Body>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                // ✅ UPDATED: Use the new image field and getImageUrl function
                const imageUrl = getImageUrl(product.image);
                
                return (
                  <tr key={product.id}>
                    <td>
                      {imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt={product.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          className="rounded"
                          onError={(e) => {
                            console.error('❌ Product image failed to load:', imageUrl);
                            e.target.src = '/images/default-camera.jpg';
                          }}
                        />
                      ) : (
                        <div 
                          className="bg-secondary rounded d-flex align-items-center justify-content-center text-white"
                          style={{ width: '50px', height: '50px' }}
                        >
                          <i className="bi bi-image"></i>
                        </div>
                      )}
                    </td>
                    <td>
                      <div>
                        <strong>{product.name}</strong>
                        <br />
                        <small className="text-muted">
                          {product.description ? product.description.substring(0, 50) + '...' : 'No description'}
                        </small>
                      </div>
                    </td>
                    <td>
                      <Badge bg="primary">{product.category}</Badge>
                    </td>
                    <td>₹{product.price}</td>
                    <td>
                      <Badge bg={product.inStock ? "success" : "danger"}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                      {product.inStock && product.stockQuantity > 0 && (
                        <div className="small text-muted">
                          Qty: {product.stockQuantity}
                        </div>
                      )}
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(product)}
                        title="Edit Product"
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        title="Delete Product"
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}

        {products.length === 0 && !loading && (
          <div className="text-center py-5">
            <i className="bi bi-inbox display-1 text-muted"></i>
            <h5 className="mt-3 text-muted">No products found</h5>
            <p className="text-muted">Get started by adding your first product.</p>
            <Button variant="primary" onClick={handleCreate}>
              Add First Product
            </Button>
          </div>
        )}
      </Card.Body>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProductForm 
            product={editingProduct} 
            onSave={handleSave}
            onCancel={() => setShowModal(false)}
            onError={handleSaveError}
          />
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default ProductManagement;