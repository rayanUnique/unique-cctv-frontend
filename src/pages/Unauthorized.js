import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="container text-center py-5">
      <h1>401 - Unauthorized</h1>
      <p>You don't have permission to access this page.</p>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
  );
};

export default Unauthorized;