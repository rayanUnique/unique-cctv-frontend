import axios from 'axios';

const API_BASE_URL = 'http://unique-cctv-backend.onrender.com/api';

// Create axios instance for authenticated calls
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance for public calls (no interceptors)
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token (only for authenticated API)
// In services/api.js - add debugging to the interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('🔐 API Interceptor - Token:', token ? 'Exists' : 'Missing');
    console.log('🔐 API Interceptor - Request:', config.method?.toUpperCase(), config.url);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Authorization header set');
    } else {
      console.log('❌ No token found for authenticated request');
    }
    return config;
  },
  (error) => {
    console.error('❌ Interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors (only for authenticated API)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      
      // Only redirect if we're not already on a public page
      const currentPath = window.location.pathname;
      const publicRoutes = ['/', '/login', '/register', '/about'];
      
      if (!publicRoutes.includes(currentPath)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Service - Use public API for login/register
export const authService = {
  login: (email, password) => 
    publicApi.post('/auth/login', { email, password }),

  register: (userData) => 
    publicApi.post('/auth/register', userData),

  getCurrentUser: () =>
    api.get('/auth/me'),
};

// User Management Service - Requires auth
export const userService = {
  getAllUsers: () => 
    api.get('/users'),

  getUserStats: () => 
    api.get('/users/stats'),

  updateUserRole: (userId, role) => {
    console.log('🔄 Updating user role:', { userId, role });
    return api.put(`/users/${userId}/role`, { role: role }); // Add /api/ prefix
  },

  deleteUser: (userId) => 
    api.delete(`/users/${userId}`),

  updateProfile: (userData) =>
    api.put('/users/profile', userData),

  changePassword: (passwordData) =>
    api.put('/users/password', passwordData),
};

// Product Service - GET methods are public, others require auth
export const productService = {
  getAllProducts: () => 
    publicApi.get('/products'),

  getProductById: (id) => 
    publicApi.get(`/products/${id}`),

  getProductsByCategory: (category) => 
    publicApi.get(`/products/category/${category}`),

  searchProducts: (keyword) => 
    publicApi.get(`/products/search?keyword=${keyword}`),

  createProduct: (product) => 
    api.post('/products', product),

 
  updateProduct: (id, productData) => {
    console.log('📤 Updating product:', id, productData); // Debug log
    return api.put(`/products/${id}`, productData);
  },

  deleteProduct: (id) => 
    api.delete(`/products/${id}`),

  getProductCategories: () =>
    publicApi.get('/products/categories'),
};

// File Upload Service - Requires auth (admin only)
export const fileUploadService = {
  uploadImage: (formData) => {
    // Get token manually to ensure it's included with FormData
    const token = localStorage.getItem('token');
    
    return api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token ? `Bearer ${token}` : '' // Manually include token
      },
    });
  },

  uploadMultipleImages: (formData) => {
    const token = localStorage.getItem('token');
    
    return api.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token ? `Bearer ${token}` : ''
      },
    });
  },

  deleteImage: (imagePath) =>
    api.delete('/upload/image', { data: { imagePath } }),
};

// Homepage Content Service - GET is public, updates require auth
export const homepageService = {
  getHomepageContent: () => 
    publicApi.get('/homepage'),

  updateHomepageContent: (content) => 
    api.put('/homepage', content),

  uploadHeroImage: (formData) => {
    const token = localStorage.getItem('token');
    
    return api.post('/homepage/hero-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token ? `Bearer ${token}` : ''
      },
    });
  },
};

// Contact Service - Requires auth
export const contactService = {
  getAllContacts: () => api.get('/contact'),
  getUnreadCount: () => api.get('/contact/unread/count'),
  markAsRead: (id) => api.put(`/contact/${id}/read`),
  deleteContact: (id) => api.delete(`/contact/${id}`),
  submitContactForm: (formData) => api.post('/contact', formData)
};

// Order Service - Requires auth
export const orderService = {
  createOrder: (orderData) =>
    api.post('/orders', orderData),

  getUserOrders: () =>
    api.get('/orders/my-orders'),

  getAllOrders: () =>
    api.get('/orders'),

  getOrderById: (id) =>
    api.get(`/orders/${id}`),

  updateOrderStatus: (id, status) =>
    api.put(`/orders/${id}/status`, { status }),

  cancelOrder: (id) =>
    api.put(`/orders/${id}/cancel`),
};

// Category Service - Public for GET, auth for modifications
export const categoryService = {
  getAllCategories: () =>
    publicApi.get('/categories'),

  getCategoryById: (id) =>
    publicApi.get(`/categories/${id}`),

  createCategory: (categoryData) =>
    api.post('/categories', categoryData),

  updateCategory: (id, categoryData) =>
    api.put(`/categories/${id}`, categoryData),

  deleteCategory: (id) =>
    api.delete(`/categories/${id}`),
};

// Dashboard Service - Requires admin auth
export const dashboardService = {
  getAdminStats: () =>
    api.get('/admin/dashboard/stats'),

  getSalesData: (period) =>
    api.get(`/admin/dashboard/sales?period=${period}`),

  getRecentActivities: () =>
    api.get('/admin/dashboard/activities'),
};

// Utility function to check if user is authenticated
export const checkAuth = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Utility function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Utility function to handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.message || 'An error occurred',
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    // Request made but no response received
    return {
      message: 'No response from server. Please check your connection.',
      status: 0
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: -1
    };
  }
};

// Add to your existing api.js file
export const appointmentService = {
  bookAppointment: (appointmentData) => 
    api.post('/appointments', appointmentData),
  
  getAppointments: () => 
    api.get('/appointments'),
  
  getAppointmentById: (id) => 
    api.get(`/appointments/${id}`),
  
  updateAppointment: (id, appointmentData) => 
    api.put(`/appointments/${id}`, appointmentData),
  
  deleteAppointment: (id) => 
    api.delete(`/appointments/${id}`),
  
  getAppointmentsByEmail: (email) => 
    api.get(`/appointments/email/${email}`),
  
  getAppointmentsByDate: (date) => 
    api.get(`/appointments/date/${date}`),

  updateAppointmentStatus: (id, status) => 
  api.patch(`/appointments/${id}/status`, { status })
};

// Add to your api.js
export const emailService = {
  sendAppointmentReply: (emailData) => 
    api.post('/email/appointment-reply', emailData),
};

export const projectService = {
  getAllProjects: () => api.get('/projects'),
  getActiveProjects: () => api.get('/projects/active'),
  getProjectById: (id) => api.get(`/projects/${id}`),
  createProject: (projectData) => api.post('/projects', projectData),
  updateProject: (id, projectData) => api.put(`/projects/${id}`, projectData),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  toggleProjectStatus: (id) => api.patch(`/projects/${id}/toggle-status`),
  getProjectsByType: (type) => api.get(`/projects/type/${type}`),
  getProjectsCount: () => api.get('/projects/stats/count')
};
export default api;