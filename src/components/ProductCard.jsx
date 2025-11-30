import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';

const ProductCard = ({ product }) => {
  // ✅ CORRECT: Helper function to get proper image URLs
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return '/images/default-camera.jpg';
    }
    
    const pathString = String(imagePath);
    
    // If it's already a full URL, use it directly
    if (pathString.startsWith('http') || pathString.startsWith('blob:') || pathString.startsWith('data:')) {
      return pathString;
    }
    
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
  };

  // ✅ CORRECT: Use the new image field
  const imageUrl = getImageUrl(product.image);
  
  // ✅ REMOVED: Stock quantity checks - all products are in stock
  
  // ✅ ADDED: Debug logging
  console.log(`🖼️ ProductCard ${product.id}:`, {
    name: product.name,
    imageField: product.image,
    imageUrl: imageUrl
  });
  
  return (
    <Card className="h-100 shadow-sm">
      <Card.Img 
        variant="top" 
        src={imageUrl} // ✅ CORRECT: Use constructed URL
        style={{ 
          height: '200px', 
          objectFit: 'cover'
        }}
        onError={(e) => {
          console.error('❌ Product image failed to load:', imageUrl);
          e.target.src = '/images/default-camera.jpg';
        }}
      />
      
      <Card.Body className="d-flex flex-column">
        <Card.Title>{product.name}</Card.Title>
        
        <div className="d-flex gap-2 mb-2">
          <Badge bg="secondary">{product.category}</Badge>
          <Badge bg="success">In Stock</Badge> {/* ✅ CHANGED: Always show in stock */}
        </div>
        
        <Card.Text className="flex-grow-1 text-muted">
          {product.description}
        </Card.Text>
        
        <div className="mt-auto">
          <h5 className="text-primary">₹{product.price}</h5>
          <Button variant="primary" className="w-100">
            View Details
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;