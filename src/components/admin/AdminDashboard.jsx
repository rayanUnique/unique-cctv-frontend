import React, { useState, useEffect } from 'react';
import HomepageManagement from './HomepageManagement';
import { Container, Row, Col, Card, Button, Badge, Nav, Table, Alert, Modal, Form, Spinner } from 'react-bootstrap';
import { userService, productService, contactService, appointmentService, emailService, projectService} from '../../services/api';
import api from '../../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    adminUsers: 0,
    activeUsers: 0,
    totalContacts: 0,
    unreadContacts: 0,
    totalAppointments: 0,
    pendingAppointments: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [projects, setProjects] = useState([]);

const loadServiceStats = async () => {
  try {
    const response = await appointmentService.getServiceStatistics();
    console.log('Service statistics:', response.data);
    // You can use this data to show service-based analytics
  } catch (error) {
    console.error('Failed to load service statistics:', error);
  }
};

// Call it in your useEffect or when needed
useEffect(() => {
  if (activeTab === 'appointments') {
    loadServiceStats();
  }
}, [activeTab]);

   // ✅ ADDED: Consistent image URL helper
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
  return `https://unique-cctv-backend.onrender.com${pathString}`;
}

// If it's just a file name, create the full URL
return `https://unique-cctv-backend.onrender.com/api/images/${pathString}`;
  };

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'products') {
      loadProducts();
    } else if (activeTab === 'messages') {
      loadContacts();
    } else if (activeTab === 'appointments') {
      loadAppointments();
    } else if (activeTab === 'overview') {
      loadContacts();
      loadAppointments();
     } else if (activeTab === 'projects') { // NEW
    loadProjects();
    }
    loadStats();
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const loadContacts = async () => {
    try {
      const response = await contactService.getAllContacts();
      setContacts(response.data || []);
    } catch (error) {
      console.error('Failed to load contacts:', error);
      setContacts([]);
    }
  };

  const loadAppointments = async () => {
    try {
      const response = await appointmentService.getAppointments();
      setAppointments(response.data || []);
    } catch (error) {
      console.error('Failed to load appointments:', error);
      setAppointments([]);
    }
  };

  const handleViewMessage = async (contact) => {
    setSelectedContact(contact);
    setShowMessageModal(true);
    
    if (!contact.isRead) {
      try {
        await contactService.markAsRead(contact.id);
        setContacts(prev => prev.map(c => 
          c.id === contact.id ? { ...c, isRead: true } : c
        ));
        setStats(prev => ({
          ...prev,
          unreadContacts: Math.max(0, prev.unreadContacts - 1)
        }));
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    }
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setReplyMessage('');
    setShowAppointmentModal(true);
  };

  const handleCloseMessageModal = () => {
    setShowMessageModal(false);
    setSelectedContact(null);
  };

  const handleCloseAppointmentModal = () => {
    setShowAppointmentModal(false);
    setSelectedAppointment(null);
    setReplyMessage('');
  };

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Failed to load users:', error);
      setError('Failed to load users from database');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await productService.getAllProducts();
      setProducts(response.data || []);
    } catch (error) {
      console.error('Failed to load products:', error);
      setError('Failed to load products from database');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
  const loadProjects = async () => {
  setLoading(true);
  setError('');
  try {
    const response = await projectService.getAllProjects();
    setProjects(response.data || []);
  } catch (error) {
    console.error('Failed to load projects:', error);
    setError('Failed to load projects from database');
    setProjects([]);
  } finally {
    setLoading(false);
  }
};

const handleProjectCreate = async (projectData) => {
  setLoading(true);
  setError('');
  try {
    const response = await projectService.createProject(projectData);
    const newProject = response.data;
    
    setProjects(prev => [...prev, newProject]);
    setStats(prev => ({ ...prev, totalProjects: (prev.totalProjects || 0) + 1 }));
    
  } catch (error) {
    console.error('Failed to create project:', error);
    setError('Failed to create project');
  } finally {
    setLoading(false);
  }
};

const handleProjectUpdate = async (projectId, projectData) => {
  setLoading(true);
  setError('');
  try {
    const response = await projectService.updateProject(projectId, projectData);
    const updatedProject = response.data;
    
    setProjects(prev => prev.map(project => 
      project.id === projectId ? updatedProject : project
    ));
    
  } catch (error) {
    console.error('Failed to update project:', error);
    setError('Failed to update project');
  } finally {
    setLoading(false);
  }
};

const handleProjectDelete = async (projectId) => {
  if (!window.confirm('Are you sure you want to delete this project?')) return;
  
  setLoading(true);
  setError('');
  try {
    await projectService.deleteProject(projectId);
    setProjects(prev => prev.filter(project => project.id !== projectId));
    setStats(prev => ({ ...prev, totalProjects: Math.max(0, (prev.totalProjects || 0) - 1) }));
    
  } catch (error) {
    console.error('Failed to delete project:', error);
    setError('Failed to delete project');
  } finally {
    setLoading(false);
  }
};

const handleToggleProjectStatus = async (projectId) => {
  try {
    const response = await projectService.toggleProjectStatus(projectId);
    const updatedProject = response.data;
    
    setProjects(prev => prev.map(project => 
      project.id === projectId ? updatedProject : project
    ));
    
  } catch (error) {
    console.error('Failed to toggle project status:', error);
    setError('Failed to toggle project status');
  }
};

  const loadStats = async () => {
    try {
      const userStatsResponse = await userService.getUserStats();
      const userStats = userStatsResponse.data;
      
      const productsResponse = await productService.getAllProducts();
      const productsData = productsResponse.data || [];

      const contactsResponse = await contactService.getAllContacts();
      const contactsData = contactsResponse.data || [];
      const unreadCountResponse = await contactService.getUnreadCount();
      const unreadCount = unreadCountResponse.data.count || 0;

      const appointmentsResponse = await appointmentService.getAppointments();
      const appointmentsData = appointmentsResponse.data || [];
      const pendingAppointments = appointmentsData.filter(apt => apt.status === 'PENDING' || !apt.status).length;
      
      const projectsResponse = await projectService.getAllProjects();
      const projectsData = projectsResponse.data || [];
      const activeProjectsCount = projectsData.filter(project => project.isActive).length;


      setStats({
        totalUsers: userStats.totalUsers || 0,
        totalProducts: productsData.length,
         totalProjects: projectsData.length, // NEW
        activeProjects: activeProjectsCount, // NEW
        adminUsers: userStats.adminUsers || 0,
        activeUsers: userStats.activeUsers || 0,
        totalContacts: contactsData.length,
        unreadContacts: unreadCount,
        totalAppointments: appointmentsData.length,
        pendingAppointments: pendingAppointments
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
      setStats({
        totalUsers: users.length,
        totalProducts: products.length,
        adminUsers: users.filter(u => u.role === 'ADMIN').length,
        activeUsers: users.filter(u => u.isActive).length,
        totalContacts: contacts.length,
        unreadContacts: contacts.filter(c => !c.isRead).length,
        totalAppointments: appointments.length,
        pendingAppointments: appointments.filter(apt => apt.status === 'PENDING' || !apt.status).length
      });
    }
  };

  const handleMarkAsRead = async (contactId) => {
    try {
      await contactService.markAsRead(contactId);
      setContacts(prev => prev.map(contact => 
        contact.id === contactId ? { ...contact, isRead: true } : contact
      ));
      setStats(prev => ({
        ...prev,
        unreadContacts: Math.max(0, prev.unreadContacts - 1)
      }));
    } catch (error) {
      console.error('Failed to mark as read:', error);
      setError('Failed to mark message as read');
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await contactService.deleteContact(contactId);
      const contactToDelete = contacts.find(c => c.id === contactId);
      
      setContacts(prev => prev.filter(contact => contact.id !== contactId));
      
      setStats(prev => ({
        ...prev,
        totalContacts: Math.max(0, prev.totalContacts - 1),
        unreadContacts: prev.unreadContacts - (contactToDelete?.isRead ? 0 : 1)
      }));

      if (selectedContact && selectedContact.id === contactId) {
        handleCloseMessageModal();
      }
    } catch (error) {
      console.error('Failed to delete contact:', error);
      setError('Failed to delete message');
    }
  };

  const handleAppointmentStatus = async (appointmentId, status) => {
  try {
    console.log('🔄 Updating appointment status:', { appointmentId, status });
    
    // Use the dedicated status update endpoint
    const response = await appointmentService.updateAppointmentStatus(appointmentId, status);
    console.log('✅ Status update response:', response);
    
    // Update local state
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId ? { ...apt, status } : apt
    ));
    
    // Update stats
    setStats(prev => ({
      ...prev,
      pendingAppointments: status === 'COMPLETED' || status === 'RESOLVED' 
        ? Math.max(0, prev.pendingAppointments - 1)
        : prev.pendingAppointments
    }));

  } catch (error) {
    console.error('❌ Failed to update appointment status:', error);
    setError('Failed to update appointment status: ' + (error.response?.data?.message || error.message));
  }
};

 const handleSendReply = async () => {
  if (!replyMessage.trim()) {
    setError('Please enter a reply message');
    return;
  }

  try {
    console.log('🔄 Starting email send process...');

    // Get admin user info
    const userData = JSON.parse(localStorage.getItem('userData'));
    const adminName = userData?.name || 'Admin';

    // Prepare email data
    const emailData = {
      toEmail: selectedAppointment.email,
      customerName: selectedAppointment.name,
      appointmentDate: selectedAppointment.appointmentDate ? 
        new Date(selectedAppointment.appointmentDate).toLocaleDateString() : 'Not specified',
      appointmentTime: selectedAppointment.appointmentTime || 'Not specified',
      adminReply: replyMessage,
      adminName: adminName
    };

    console.log('📧 Sending email with data:', emailData);

    // Send email using direct API call
    const response = await api.post('/email/appointment-reply', emailData);
    console.log('✅ Email response:', response.data);
    
    // Mark as resolved after sending reply
    await handleAppointmentStatus(selectedAppointment.id, 'RESOLVED');
    
    // Show success message
    setMessage({ type: 'success', text: `Reply sent successfully to ${selectedAppointment.email}` });
    
    setReplyMessage('');
    handleCloseAppointmentModal();
    
  } catch (error) {
    console.error('❌ Failed to send reply:', error);
    console.log('🔍 Error response data:', error.response?.data);
    
    const errorMessage = error.response?.data?.details || 
                        error.response?.data?.error || 
                        error.message || 
                        'Failed to send email. Please check email configuration.';
    
    setError('Email failed: ' + errorMessage);
  }
};
  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    
    try {
      await appointmentService.deleteAppointment(appointmentId);
      const appointmentToDelete = appointments.find(apt => apt.id === appointmentId);
      
      setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
      
      setStats(prev => ({
        ...prev,
        totalAppointments: Math.max(0, prev.totalAppointments - 1),
        pendingAppointments: prev.pendingAppointments - 
          ((appointmentToDelete?.status === 'PENDING' || !appointmentToDelete?.status) ? 1 : 0)
      }));

      if (selectedAppointment && selectedAppointment.id === appointmentId) {
        handleCloseAppointmentModal();
      }
    } catch (error) {
      console.error('Failed to delete appointment:', error);
      setError('Failed to delete appointment');
    }
  };

  const handleProductCreate = async (productData) => {
    setLoading(true);
    setError('');
    try {
      const response = await productService.createProduct(productData);
      const newProduct = response.data;
      
      setProducts(prev => [...prev, newProduct]);
      setStats(prev => ({ ...prev, totalProducts: prev.totalProducts + 1 }));
      
    } catch (error) {
      console.error('Failed to create product:', error);
      setError('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setLoading(true);
    setError('');
    try {
      await userService.updateUserRole(userId, newRole);
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      setStats(prev => ({
        ...prev,
        adminUsers: newRole === 'ADMIN' ? prev.adminUsers + 1 : prev.adminUsers - 1
      }));
      
    } catch (error) {
      console.error('Failed to update user role:', error);
      setError('Failed to update user role');
    } finally {
      setLoading(false);
    }
  };

  const handleUserDelete = async (userId) => {
    if (!userId) {
      setError('Invalid user ID');
      return;
    }

    let currentUser;
    try {
      currentUser = JSON.parse(localStorage.getItem('userData'));
    } catch (e) {
      console.error('Error parsing user data:', e);
      setError('Error reading user session');
      return;
    }

    if (userId === currentUser?.id) {
      setError('Security restriction: You cannot delete your own account while logged in. Please ask another administrator to delete your account.');
      return;
    }

    const userToDelete = users.find(user => user.id === userId);
    if (!userToDelete) {
      setError('User not found in local data');
      return;
    }

    const confirmMessage = `Are you sure you want to delete user "${userToDelete.name || userToDelete.email}"? This action cannot be undone.`;
    
    if (!window.confirm(confirmMessage)) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await userService.deleteUser(userId);
      
      setUsers(prev => prev.filter(user => user.id !== userId));
      
      setStats(prev => ({
        ...prev,
        totalUsers: Math.max(0, prev.totalUsers - 1),
        activeUsers: prev.activeUsers - (userToDelete.isActive ? 1 : 0),
        adminUsers: prev.adminUsers - (userToDelete.role === 'ADMIN' ? 1 : 0)
      }));
      
    } catch (error) {
      console.error('Delete user error:', error);
      
      if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          window.location.href = '/login';
        }, 3000);
      } else if (error.response?.status === 403) {
        setError('Access denied. You do not have permission to delete users.');
      } else if (error.response?.status === 404) {
        setError('User not found on server. It may have been already deleted.');
        setUsers(prev => prev.filter(user => user.id !== userId));
      } else if (error.code === 'NETWORK_ERROR') {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(`Delete failed: ${error.response?.data?.message || error.message || 'Please try again'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProductUpdate = async (productId, productData) => {
    setLoading(true);
    setError('');
    try {
      const response = await productService.updateProduct(productId, productData);
      const updatedProduct = response.data;
      
      setProducts(prev => prev.map(product => 
        product.id === productId ? updatedProduct : product
      ));
      
    } catch (error) {
      console.error('Failed to update product:', error);
      setError('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleProductDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    setLoading(true);
    setError('');
    try {
      await productService.deleteProduct(productId);
      setProducts(prev => prev.filter(product => product.id !== productId));
      setStats(prev => ({ ...prev, totalProducts: prev.totalProducts - 1 }));
      
    } catch (error) {
      console.error('Failed to delete product:', error);
      setError('Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

   const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <DashboardOverview 
            stats={stats} 
            users={users} 
            products={products} 
            contacts={contacts}
            appointments={appointments}
            onTabChange={setActiveTab}
          />
        );
      case 'users':
        return (
          <UsersManagement 
            users={users} 
            loading={loading}
            onRoleChange={handleRoleChange}
            onDeleteUser={handleUserDelete}
            error={error}
          />
        );
      case 'products':
        return (
          <ProductsManagement 
            products={products}
            loading={loading}
            onCreateProduct={handleProductCreate}
            onUpdateProduct={handleProductUpdate}
            onDeleteProduct={handleProductDelete}
            error={error}
            getImageUrl={getImageUrl} // ✅ ADDED: Pass the helper function
          />
        );
      case 'messages':
        return (
          <MessagesManagement 
            contacts={contacts}
            loading={loading}
            onViewMessage={handleViewMessage}
            onMarkAsRead={handleMarkAsRead}
            onDeleteContact={handleDeleteContact}
            error={error}
          />
        );
      case 'appointments':
        return (
          <AppointmentsManagement 
            appointments={appointments}
            loading={loading}
            onViewAppointment={handleViewAppointment}
            onStatusChange={handleAppointmentStatus}
            onDeleteAppointment={handleDeleteAppointment}
            error={error}
          />
        );
      case 'homepage':
        return <HomepageManagement />;
      case 'images':
        return <ImageManagement />;
        // NEW: Projects Management
    case 'projects':
      return (
        <ProjectsManagement 
          projects={projects}
          loading={loading}
          onCreateProject={handleProjectCreate}
          onUpdateProject={handleProjectUpdate}
          onDeleteProject={handleProjectDelete}
          onToggleProjectStatus={handleToggleProjectStatus}
          error={error}
          getImageUrl={getImageUrl}
        />
      );
      default:
        return (
          <DashboardOverview 
            stats={stats} 
            users={users} 
            products={products} 
            contacts={contacts}
            appointments={appointments}
            onTabChange={setActiveTab}
          />
        );
    }
  };

  return (
    <Container fluid className="admin-dashboard">
      {/* Header */}
      <Row className="mb-3 mb-md-4">
        <Col>
          <div className="dashboard-header">
            <h1 className="h3 h1-md fw-bold text-primary">Admin Dashboard</h1>
            <p className="lead text-muted fs-6 fs-md-4">Manage your website content and users</p>
            {error && (
              <Alert variant="warning" className="mt-2">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </Alert>
            )}
          </div>
        </Col>
      </Row>

      <Row>
        {/* Sidebar Navigation */}
        <Col xs={12} lg={3} className="mb-4">
          <Card className="admin-sidebar shadow-sm">
            <Card.Body className="p-2 p-md-3">
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'overview'} 
                    onClick={() => setActiveTab('overview')}
                    className="admin-nav-item fs-6"
                  >
                    <i className="bi bi-speedometer2 me-2"></i>
                    Dashboard Overview
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'users'} 
                    onClick={() => setActiveTab('users')}
                    className="admin-nav-item fs-6"
                  >
                    <i className="bi bi-people me-2"></i>
                    User Management
                    <Badge bg="primary" className="ms-2">{stats.totalUsers}</Badge>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'products'} 
                    onClick={() => setActiveTab('products')}
                    className="admin-nav-item fs-6"
                  >
                    <i className="bi bi-box-seam me-2"></i>
                    Product Management
                    <Badge bg="success" className="ms-2">{stats.totalProducts}</Badge>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'messages'} 
                    onClick={() => setActiveTab('messages')}
                    className="admin-nav-item fs-6"
                  >
                    <i className="bi bi-envelope me-2"></i>
                    Messages
                    <Badge bg="warning" className="ms-2">{stats.unreadContacts}</Badge>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'appointments'} 
                    onClick={() => setActiveTab('appointments')}
                    className="admin-nav-item fs-6"
                  >
                    <i className="bi bi-calendar-check me-2"></i>
                    Appointments
                    <Badge bg="info" className="ms-2">{stats.pendingAppointments}</Badge>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'homepage'} 
                    onClick={() => setActiveTab('homepage')}
                    className="admin-nav-item fs-6"
                  >
                    <i className="bi bi-house-door me-2"></i>
                    Homepage Content
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'projects'} 
                    onClick={() => setActiveTab('projects')}
                    className="admin-nav-item fs-6"
                  >
                    <i className="bi bi-folder2-open me-2"></i>
                    Project Management
                    <Badge bg="secondary" className="ms-2">{stats.totalProjects || 0}</Badge>
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Body>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-3 shadow-sm">
            <Card.Header className="bg-light p-2 p-md-3">
              <h6 className="mb-0 fs-6">Live Stats</h6>
            </Card.Header>
            <Card.Body className="p-2 p-md-3">
              <div className="quick-stats">
                <div className="stat-item d-flex justify-content-between align-items-center mb-2">
                  <span className="stat-label fs-6">Total Users</span>
                  <span className="stat-value fs-6 fw-bold">{stats.totalUsers}</span>
                </div>
                <div className="stat-item d-flex justify-content-between align-items-center mb-2">
                  <span className="stat-label fs-6">Products</span>
                  <span className="stat-value fs-6 fw-bold">{stats.totalProducts}</span>
                </div>
                <div className="stat-item d-flex justify-content-between align-items-center mb-2">
                  <span className="stat-label fs-6">Messages</span>
                  <span className="stat-value fs-6 fw-bold">{stats.totalContacts}</span>
                </div>
                <div className="stat-item d-flex justify-content-between align-items-center mb-2">
                  <span className="stat-label fs-6">Unread Msgs</span>
                  <span className="stat-value fs-6 fw-bold text-warning">{stats.unreadContacts}</span>
                </div>
                <div className="stat-item d-flex justify-content-between align-items-center">
                  <span className="stat-label fs-6">Appointments</span>
                  <span className="stat-value fs-6 fw-bold text-info">{stats.totalAppointments}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Main Content */}
        <Col xs={12} lg={9}>
          {renderContent()}
        </Col>
      </Row>

      {/* Message View Modal */}
      <Modal show={showMessageModal} onHide={handleCloseMessageModal} size="lg">
        <Modal.Header closeButton className="p-3 p-md-4">
          <Modal.Title className="h5 h4-md">
            <i className="bi bi-envelope me-2"></i>
            Contact Message
            {selectedContact && !selectedContact.isRead && (
              <Badge bg="warning" className="ms-2 fs-6">New</Badge>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-3 p-md-4">
          {selectedContact && (
            <div className="message-details">
              <Row className="mb-3">
                <Col xs={12} md={6}>
                  <strong className="fs-6 d-block">From:</strong>
                  <p className="fs-6">{selectedContact.name}</p>
                </Col>
                <Col xs={12} md={6}>
                  <strong className="fs-6 d-block">Email:</strong>
                  <p className="fs-6">
                    <a href={`mailto:${selectedContact.email}`} className="text-decoration-none">
                      {selectedContact.email}
                    </a>
                  </p>
                </Col>
              </Row>
              
              {selectedContact.phone && (
                <Row className="mb-3">
                  <Col xs={12}>
                    <strong className="fs-6 d-block">Phone:</strong>
                    <p className="fs-6">{selectedContact.phone}</p>
                  </Col>
                </Row>
              )}
              
              <Row className="mb-3">
                <Col xs={12}>
                  <strong className="fs-6 d-block">Date:</strong>
                  <p className="fs-6 text-muted">
                    {selectedContact.createdAt ? new Date(selectedContact.createdAt).toLocaleString() : 'N/A'}
                  </p>
                </Col>
              </Row>
              
              <Row>
                <Col xs={12}>
                  <strong className="fs-6 d-block">Message:</strong>
                  <div className="message-content p-3 bg-light rounded mt-2">
                    <p className="mb-0 fs-6" style={{ whiteSpace: 'pre-wrap' }}>
                      {selectedContact.message}
                    </p>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="p-3 p-md-4">
          <Button 
            variant="secondary" 
            onClick={handleCloseMessageModal}
            className="fs-6"
          >
            Close
          </Button>
          {selectedContact && (
            <Button 
              variant="danger" 
              onClick={() => handleDeleteContact(selectedContact.id)}
              className="fs-6"
            >
              <i className="bi bi-trash me-1"></i>
              Delete Message
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Appointment View Modal */}
      <Modal show={showAppointmentModal} onHide={handleCloseAppointmentModal} size="lg">
        <Modal.Header closeButton className="p-3 p-md-4">
          <Modal.Title className="h5 h4-md">
            <i className="bi bi-calendar-check me-2"></i>
            Appointment Details
            {selectedAppointment && (
              <Badge 
                bg={
                  selectedAppointment.status === 'COMPLETED' ? 'success' :
                  selectedAppointment.status === 'RESOLVED' ? 'info' : 'warning'
                } 
                className="ms-2 fs-6"
              >
                {selectedAppointment.status || 'PENDING'}
              </Badge>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-3 p-md-4">
  {selectedAppointment && (
    <div className="appointment-details">
      {/* Customer Information */}
      <Row className="mb-3">
        <Col xs={12} md={6}>
          <strong className="fs-6 d-block">Customer Name:</strong>
          <p className="fs-6">{selectedAppointment.name}</p>
        </Col>
        <Col xs={12} md={6}>
          <strong className="fs-6 d-block">Email:</strong>
          <p className="fs-6">
            <a href={`mailto:${selectedAppointment.email}`} className="text-decoration-none">
              {selectedAppointment.email}
            </a>
          </p>
        </Col>
      </Row>
      
      {/* Contact & Appointment Details */}
      <Row className="mb-3">
        <Col xs={12} md={6}>
          <strong className="fs-6 d-block">Mobile:</strong>
          <p className="fs-6">
            <a href={`tel:${selectedAppointment.mobNo}`} className="text-decoration-none">
              {selectedAppointment.mobNo}
            </a>
          </p>
        </Col>
        <Col xs={12} md={6}>
          <strong className="fs-6 d-block">Appointment Date:</strong>
          <p className="fs-6">
            {selectedAppointment.appointmentDate ? 
              new Date(selectedAppointment.appointmentDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'N/A'}
          </p>
        </Col>
      </Row>
      
      {/* Time & Status */}
      <Row className="mb-3">
        <Col xs={12} md={6}>
          <strong className="fs-6 d-block">Appointment Time:</strong>
          <p className="fs-6">
            {selectedAppointment.appointmentTime ? 
              (() => {
                // Format time to 12-hour format
                try {
                  const [hours, minutes] = selectedAppointment.appointmentTime.split(':');
                  const hour = parseInt(hours);
                  const ampm = hour >= 12 ? 'PM' : 'AM';
                  const formattedHour = hour % 12 || 12;
                  return `${formattedHour}:${minutes} ${ampm}`;
                } catch (error) {
                  return selectedAppointment.appointmentTime;
                }
              })() : 'Not specified'}
          </p>
        </Col>
        <Col xs={12} md={6}>
          <strong className="fs-6 d-block">Current Status:</strong>
          <Badge 
            bg={
              selectedAppointment.status === 'COMPLETED' ? 'success' :
              selectedAppointment.status === 'RESOLVED' ? 'info' : 'warning'
            } 
            className="fs-6"
          >
            {selectedAppointment.status || 'PENDING'}
          </Badge>
        </Col>
      </Row>
      
      {/* Address */}
      <Row className="mb-3">
        <Col xs={12}>
          <strong className="fs-6 d-block">Address:</strong>
          <div className="address-content p-3 bg-light rounded mt-2">
            <p className="mb-0 fs-6" style={{ whiteSpace: 'pre-wrap' }}>
              {selectedAppointment.address}
            </p>
          </div>
        </Col>
      </Row>
     
<Row className="mb-3">
  <Col xs={12} md={6}>
    <strong className="fs-6 d-block">Service Requested:</strong>
    <Badge bg="primary" className="fs-6">
      <i className="bi bi-tools me-1"></i>
      {selectedAppointment.selectedService || 'Not specified'}
    </Badge>
  </Col>
  <Col xs={12} md={6}>
    <strong className="fs-6 d-block">Current Status:</strong>
    <Badge 
      bg={
        selectedAppointment.status === 'COMPLETED' ? 'success' :
        selectedAppointment.status === 'RESOLVED' ? 'info' : 'warning'
      } 
      className="fs-6"
    >
      {selectedAppointment.status || 'PENDING'}
    </Badge>
  </Col>
</Row>
      {/* Requirements */}
      {selectedAppointment.description && (
        <Row className="mb-4">
          <Col xs={12}>
            <strong className="fs-6 d-block">Customer Requirements:</strong>
            <div className="requirements-content p-3 bg-light rounded mt-2">
              <p className="mb-0 fs-6" style={{ whiteSpace: 'pre-wrap' }}>
                {selectedAppointment.description}
              </p>
            </div>
          </Col>
        </Row>
      )}
      
      {/* Reply Section */}
      <Row className="mb-3">
        <Col xs={12}>
          <strong className="fs-6 d-block">
            <i className="bi bi-reply me-2"></i>
            Reply to Customer
          </strong>
          <Form.Control
            as="textarea"
            rows={4}
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            placeholder={`Type your reply message to ${selectedAppointment.name}...\n\nYou can include:\n• Confirmation details\n• Follow-up instructions\n• Additional questions\n• Contact information`}
            className="mt-2"
          />
          <Form.Text className="text-muted">
            This message will be sent to {selectedAppointment.email}
          </Form.Text>
        </Col>
      </Row>
    </div>
  )}
</Modal.Body>
<Modal.Footer className="p-3 p-md-4">
  <div className="w-100 d-flex justify-content-between align-items-center">
    <div>
      <small className="text-muted">
        Appointment ID: #{selectedAppointment?.id} • 
        Created: {selectedAppointment?.bookingDate ? 
          new Date(selectedAppointment.bookingDate).toLocaleDateString() : 'N/A'}
      </small>
    </div>
    <div className="d-flex gap-2">
      <Button 
        variant="outline-secondary" 
        onClick={handleCloseAppointmentModal}
        className="fs-6"
      >
        <i className="bi bi-x-lg me-1"></i>
        Close
      </Button>
      {selectedAppointment && (
        <>
          <Button 
            variant="success" 
            onClick={handleSendReply}
            disabled={!replyMessage.trim()}
            className="fs-6"
          >
            <i className="bi bi-send me-1"></i>
            Send Reply
          </Button>
          {selectedAppointment.status !== 'RESOLVED' && (
            <Button 
              variant="info" 
              onClick={() => handleAppointmentStatus(selectedAppointment.id, 'RESOLVED')}
              className="fs-6"
            >
              <i className="bi bi-check-circle me-1"></i>
              Mark Resolved
            </Button>
          )}
          <Button 
            variant="danger" 
            onClick={() => handleDeleteAppointment(selectedAppointment.id)}
            className="fs-6"
          >
            <i className="bi bi-trash me-1"></i>
            Delete
          </Button>
        </>
      )}
    </div>
  </div>
</Modal.Footer>
      </Modal>
    </Container>
  );
};

// Updated Dashboard Overview Component
const DashboardOverview = ({ 
  stats, 
  users, 
  products, 
  contacts, 
  appointments,
  onTabChange
}) => (
  <Card className="shadow-sm">
    <Card.Header className="bg-white p-3 p-md-4">
      <h5 className="mb-0 h5 h4-md">📊 Dashboard Overview</h5>
    </Card.Header>
    <Card.Body className="p-3 p-md-4">
      <Row>
        <Col xs={6} md={3} className="mb-3">
          <Card className="stat-card text-center h-100">
            <Card.Body className="p-3">
              <div className="stat-icon users">
                <i className="bi bi-people fs-2"></i>
              </div>
              <h4 className="h5 h4-md">{stats.totalUsers}</h4>
              <p className="text-muted mb-0 fs-6">Total Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3} className="mb-3">
          <Card className="stat-card text-center h-100">
            <Card.Body className="p-3">
              <div className="stat-icon products">
                <i className="bi bi-box-seam fs-2"></i>
              </div>
              <h4 className="h5 h4-md">{stats.totalProducts}</h4>
              <p className="text-muted mb-0 fs-6">Products</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3} className="mb-3">
          <Card className="stat-card text-center h-100">
            <Card.Body className="p-3">
              <div className="stat-icon messages">
                <i className="bi bi-envelope fs-2"></i>
              </div>
              <h4 className="h5 h4-md">{stats.totalContacts}</h4>
              <p className="text-muted mb-0 fs-6">Messages</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3} className="mb-3">
          <Card className="stat-card text-center h-100">
            <Card.Body className="p-3">
              <div className="stat-icon appointments">
                <i className="bi bi-calendar-check fs-2"></i>
              </div>
              <h4 className="h5 h4-md">{stats.totalAppointments}</h4>
              <p className="text-muted mb-0 fs-6">Appointments</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-3 mt-md-4">
        <Col xs={12} lg={6} className="mb-3 mb-lg-0">
          <Card className="h-100">
            <Card.Header className="p-3">
              <h6 className="mb-0 fs-6">🚀 Quick Actions</h6>
            </Card.Header>
            <Card.Body className="p-3">
              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => onTabChange('products')}
                  className="fs-6"
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Add New Product
                </Button>
                <Button 
                  variant="info" 
                  size="lg"
                  onClick={() => onTabChange('homepage')}
                  className="fs-6"
                >
                  <i className="bi bi-house me-2"></i>
                  Update Homepage
                </Button>
                <Button 
                  variant="warning" 
                  size="lg"
                  onClick={() => onTabChange('messages')}
                  className="fs-6"
                >
                  <i className="bi bi-envelope me-2"></i>
                  View Messages ({stats.unreadContacts} unread)
                </Button>
                <Button 
                  variant="success" 
                  size="lg"
                  onClick={() => onTabChange('appointments')}
                  className="fs-6"
                >
                  <i className="bi bi-calendar-check me-2"></i>
                  View Appointments ({stats.pendingAppointments} pending)
                </Button>
                {/* NEW: Project Management Button */}
                <Button 
                  variant="dark" 
                  size="lg"
                  onClick={() => onTabChange('projects')}
                  className="fs-6"
                >
                  <i className="bi bi-folder2-open me-2"></i>
                  Manage Projects
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card className="h-100">
            <Card.Header className="p-3">
              <h6 className="mb-0 fs-6">📈 Recent Activity</h6>
            </Card.Header>
            <Card.Body className="p-3">
              <div className="activity-list">
                <div className="activity-item d-flex align-items-center mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2 fs-6"></i>
                  <span className="fs-6">Live data loaded</span>
                  <small className="text-muted ms-2 fs-6">Just now</small>
                </div>
                {users.length > 0 && (
                  <div className="activity-item d-flex align-items-center mb-2">
                    <i className="bi bi-people text-info me-2 fs-6"></i>
                    <span className="fs-6">{users.length} users in database</span>
                    <small className="text-muted ms-2 fs-6">Live</small>
                  </div>
                )}
                {products.length > 0 && (
                  <div className="activity-item d-flex align-items-center mb-2">
                    <i className="bi bi-box-seam text-primary me-2 fs-6"></i>
                    <span className="fs-6">{products.length} products in database</span>
                    <small className="text-muted ms-2 fs-6">Live</small>
                  </div>
                )}
                {contacts.length > 0 && (
                  <div className="activity-item d-flex align-items-center mb-2">
                    <i className="bi bi-envelope text-warning me-2 fs-6"></i>
                    <span className="fs-6">{contacts.length} contact messages</span>
                    <small className="text-muted ms-2 fs-6">Live</small>
                  </div>
                )}
                {appointments.length > 0 && (
                  <div className="activity-item d-flex align-items-center">
                    <i className="bi bi-calendar-check text-success me-2 fs-6"></i>
                    <span className="fs-6">{appointments.length} appointments</span>
                    <small className="text-muted ms-2 fs-6">Live</small>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Card.Body>
  </Card>
);

// Users Management Component (No changes)
const UsersManagement = ({ users, loading, onRoleChange, onDeleteUser, error }) => {
  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center p-3 p-md-4">
        <h5 className="mb-0 h5 h4-md">👥 User Management</h5>
        <Badge bg="primary" className="fs-6">{users.length} Users</Badge>
      </Card.Header>
      <Card.Body className="p-3 p-md-4">
        {error && (
          <Alert variant="warning">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-4 py-md-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted fs-6">Loading users from database...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-4 py-md-5">
            <i className="bi bi-people text-muted" style={{ fontSize: '2rem' }}></i>
            <h5 className="mt-3 text-muted h5 h4-md">No Users Found</h5>
            <p className="text-muted fs-6">No users are currently registered in the database.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover className="fs-6">
              <thead className="table-light">
                <tr>
                  <th>User</th>
                  <th className="d-none d-md-table-cell">Email</th>
                  <th>Role</th>
                  <th className="d-none d-lg-table-cell">Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="user-avatar bg-primary text-white rounded-circle me-2 me-md-3 d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px', fontSize: '0.8rem' }}>
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <strong className="fs-6">{user.name || 'Unknown User'}</strong>
                          <div className="d-md-none text-muted small">{user.email}</div>
                          {user.phone && <div className="text-muted small d-none d-md-block">{user.phone}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="d-none d-md-table-cell">{user.email}</td>
                    <td>
                      <Badge bg={user.role === 'ADMIN' ? 'danger' : 'primary'} className="fs-6">
                        {user.role || 'USER'}
                      </Badge>
                    </td>
                    <td className="d-none d-lg-table-cell">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        {user.role !== 'ADMIN' && (
                          <Button
                            size="sm"
                            variant="outline-warning"
                            disabled={loading}
                            onClick={() => onRoleChange(user.id, 'ADMIN')}
                            className="fs-6"
                          >
                            Make Admin
                          </Button>
                        )}
                        {user.role === 'ADMIN' && (
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            disabled={loading}
                            onClick={() => onRoleChange(user.id, 'USER')}
                            className="fs-6"
                          >
                            Make User
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline-danger"
                          onClick={() => onDeleteUser(user.id)}
                          disabled={loading}
                          className="fs-6"
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

// Products Management Component (No changes)
// Products Management Component - FIXED VERSION
 // ✅ FIXED: ProductsManagement Component with proper image handling
  const ProductsManagement = ({ 
    products, 
    loading, 
    onCreateProduct, 
    onUpdateProduct, 
    onDeleteProduct, 
    error,
    getImageUrl
  }) => {
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
      name: '',
      category: '',
      price: '',
      description: '',
      image: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [localError, setLocalError] = useState('');
    
    const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      console.log('📤 Selected file:', file.name, file.type, file.size);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setLocalError('Please select a valid image file (JPG, PNG, etc.)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setLocalError('Image size should be less than 5MB');
        return;
      }

      setUploading(true);
      setLocalError('');

      try {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        console.log('🔄 Uploading image to server...');
        
        // ✅ FIXED: Use the api service instead of direct fetch
        const response = await api.post('/upload/image', uploadFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        console.log('✅ Image upload successful:', response.data);

        if (!response.data.fileName) {
          throw new Error('No filename returned from server');
        }

        setFormData(prev => ({
          ...prev,
          image: response.data.fileName
        }));

        setImageFile(file);
        console.log('📝 Updated form image field:', response.data.fileName);

      } catch (err) {
        console.error('❌ Image upload failed:', err);
        setLocalError(`Failed to upload image: ${err.response?.data?.message || err.message}`);
      } finally {
        setUploading(false);
      }
    };

    const handleShowModal = (product = null) => {
      setLocalError('');
      if (product) {
        setEditingProduct(product);
        setFormData({
          name: product.name || '',
          category: product.category || '',
          price: product.price || '',
          description: product.description || '',
          image: product.image || ''
        });
        setImageFile(null);
      } else {
        setEditingProduct(null);
        setFormData({
          name: '',
          category: '',
          price: '',
          description: '',
          image: ''
        });
        setImageFile(null);
      }
      setShowModal(true);
    };

    const handleCloseModal = () => {
      setShowModal(false);
      setEditingProduct(null);
      setImageFile(null);
      setLocalError('');
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      
      console.log('🔄 handleSubmit called');
      console.log('📝 Form data before processing:', formData);
      
      const productData = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        price: parseFloat(formData.price) || 0,
        description: formData.description.trim(),
        image: formData.image.trim()
      };

      console.log('📦 Final product data to send:', productData);

      if (!productData.name || !productData.category) {
        setLocalError('Product name and category are required');
        return;
      }

      if (productData.price < 0) {
        setLocalError('Price cannot be negative');
        return;
      }

      console.log('🚀 Making API call...');
      
      if (editingProduct) {
        onUpdateProduct(editingProduct.id, productData);
      } else {
        onCreateProduct(productData);
      }
      handleCloseModal();
    };

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    return (
      <>
        <Card className="shadow-sm">
          <Card.Header className="bg-white d-flex justify-content-between align-items-center p-3 p-md-4">
            <h5 className="mb-0 h5 h4-md">🛍️ Product Management</h5>
            <div>
              <Badge bg="success" className="me-2 fs-6 d-none d-md-inline">{products.length} Products</Badge>
              <Button variant="primary" size="sm" onClick={() => handleShowModal()} className="fs-6">
                <i className="bi bi-plus-circle me-1"></i>
                Add Product
              </Button>
            </div>
          </Card.Header>
          <Card.Body className="p-3 p-md-4">
            {error && (
              <Alert variant="warning">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </Alert>
            )}

            {loading ? (
              <div className="text-center py-4 py-md-5">
                <Spinner animation="border" role="status" />
                <p className="mt-2 text-muted fs-6">Loading products from database...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-4 py-md-5">
                <i className="bi bi-box-seam text-muted" style={{ fontSize: '2rem' }}></i>
                <h5 className="mt-3 text-muted h5 h4-md">No Products Found</h5>
                <p className="text-muted fs-6 mb-3">No products are currently available in the database.</p>
                <Button variant="primary" onClick={() => handleShowModal()} className="fs-6">
                  <i className="bi bi-plus-circle me-2"></i>
                  Add First Product
                </Button>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="fs-6">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th className="d-none d-sm-table-cell">Category</th>
                      <th>Price</th>
                      <th className="d-none d-md-table-cell">Status</th>
                      <th className="d-none d-lg-table-cell">Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => {
                      const imageUrl = getImageUrl(product.image);
                      console.log(`🖼️ Product ${product.id}:`, {
                        name: product.name,
                        imageField: product.image,
                        imageUrl: imageUrl
                      });
                      
                      return (
                        <tr key={product.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div 
                                className="product-image bg-light rounded me-2 me-md-3 d-flex align-items-center justify-content-center"
                                style={{ width: '50px', height: '50px', overflow: 'hidden' }}
                              >
                                {imageUrl ? (
                                  <img 
                                    src={imageUrl} 
                                    alt={product.name}
                                    style={{ 
                                      width: '100%', 
                                      height: '100%', 
                                      objectFit: 'cover' 
                                    }}
                                    onError={(e) => {
                                      console.error('❌ Product image failed to load:', imageUrl);
                                      e.target.style.display = 'none';
                                      // Show fallback icon
                                      const parent = e.target.parentElement;
                                      const fallback = parent.querySelector('.image-fallback');
                                      if (fallback) fallback.style.display = 'block';
                                    }}
                                  />
                                ) : null}
                                <i className="bi bi-image text-muted fs-5 image-fallback" 
                                   style={{ display: imageUrl ? 'none' : 'block' }}></i>
                              </div>
                              <div>
                                <strong className="fs-6">{product.name}</strong>
                                <div className="d-sm-none text-muted small">
                                  <Badge bg="secondary" className="fs-6">{product.category}</Badge>
                                </div>
                                {product.description && (
                                  <div className="text-muted small text-truncate d-none d-md-block" style={{ maxWidth: '200px' }}>
                                    {product.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="d-none d-sm-table-cell">
                            <Badge bg="secondary" className="fs-6">{product.category}</Badge>
                          </td>
                          <td>
                            ₹{product.price}
                          </td>
                          <td className="d-none d-md-table-cell">
                            <Badge bg="success" className="fs-6">
                              Available
                            </Badge>
                          </td>
                          <td className="d-none d-lg-table-cell">
                            {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() => handleShowModal(product)}
                                disabled={loading}
                                className="fs-6"
                              >
                                <i className="bi bi-pencil"></i>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => onDeleteProduct(product.id)}
                                disabled={loading}
                                className="fs-6"
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Add/Edit Product Modal */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton className="p-3 p-md-4">
            <Modal.Title className="h5 h4-md">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body className="p-3 p-md-4">
              {localError && (
                <Alert variant="danger" className="mb-3">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {localError}
                </Alert>
              )}
              
              <Row>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fs-6">Product Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter product name"
                      size="lg"
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fs-6">Category *</Form.Label>
                    <Form.Control
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      placeholder="Enter category"
                      size="lg"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fs-6">Price (₹) *</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      min="0"
                      name="price"
                      value={formData.price}
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : parseFloat(e.target.value);
                        setFormData(prev => ({ 
                          ...prev, 
                          price: isNaN(value) ? '' : value 
                        }));
                      }}
                      required
                      placeholder="0.00"
                      size="lg"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label className="fs-6">Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  size="lg"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fs-6">Product Image</Form.Label>
                
                {/* Image Preview */}
                {formData.image && (
                  <div className="mb-3 text-center">
                    <img 
                      src={getImageUrl(formData.image)}
                      alt="Product preview" 
                      className="img-fluid rounded border"
                      style={{ maxHeight: '200px', maxWidth: '100%', objectFit: 'contain' }}
                      onError={(e) => {
                        console.error('❌ Preview image failed to load:', formData.image);
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="mt-2">
                      <small className="text-muted">
                        Current image: <strong>{formData.image}</strong>
                      </small>
                    </div>
                  </div>
                )}
                
                {/* File Upload Input */}
                <div className="mb-2">
                  <Form.Label className="fs-6">Upload New Image:</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    name="imageFile"
                    onChange={handleImageUpload}
                    disabled={uploading || loading}
                    size="lg"
                  />
                  {uploading && (
                    <div className="mt-2">
                      <Spinner animation="border" size="sm" className="me-2" />
                      <small className="text-muted">Uploading image...</small>
                    </div>
                  )}
                </div>
                
                {/* URL Input (Alternative) */}
                <div className="mt-3">
                  <Form.Label className="fs-6">Or Enter Image URL/Filename:</Form.Label>
                  <Form.Control
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="filename.jpg or https://example.com/image.jpg"
                    size="lg"
                  />
                  <Form.Text className="text-muted">
                    Enter just the filename (e.g., "camera.jpg") or full image URL
                  </Form.Text>
                </div>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="p-3 p-md-4">
              <Button variant="secondary" onClick={handleCloseModal} disabled={loading} className="fs-6">
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading || uploading} className="fs-6">
                {loading ? 'Saving...' : uploading ? 'Uploading...' : editingProduct ? 'Update Product' : 'Create Product'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </>
    );
  };



// New Messages Management Component
const MessagesManagement = ({ 
  contacts, 
  loading, 
  onViewMessage, 
  onMarkAsRead, 
  onDeleteContact, 
  error 
}) => {
  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center p-3 p-md-4">
        <h5 className="mb-0 h5 h4-md">📨 Contact Messages</h5>
        <Badge bg="warning" className="fs-6">
          {contacts.filter(c => !c.isRead).length} Unread
        </Badge>
      </Card.Header>
      <Card.Body className="p-3 p-md-4">
        {error && (
          <Alert variant="warning">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-4 py-md-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted fs-6">Loading messages from database...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-4 py-md-5">
            <i className="bi bi-envelope text-muted" style={{ fontSize: '2rem' }}></i>
            <h5 className="mt-3 text-muted h5 h4-md">No Messages Found</h5>
            <p className="text-muted fs-6">No contact messages have been received yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover className="fs-6">
              <thead className="table-light">
                <tr>
                  <th>From</th>
                  <th className="d-none d-md-table-cell">Email</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map(contact => (
                  <tr key={contact.id} className={!contact.isRead ? 'table-warning' : ''}>
                    <td>
                      <strong className="fs-6">{contact.name}</strong>
                      {contact.phone && (
                        <div className="text-muted small d-md-none">{contact.phone}</div>
                      )}
                    </td>
                    <td className="d-none d-md-table-cell">
                      <div className="text-truncate" style={{ maxWidth: '150px' }}>
                        {contact.email}
                      </div>
                    </td>
                    <td>
                      <div 
                        className="text-truncate" 
                        style={{ maxWidth: '200px' }} 
                        title={contact.message}
                      >
                        {contact.message}
                      </div>
                    </td>
                    <td>
                      <small className="text-muted">
                        {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : 'N/A'}
                      </small>
                    </td>
                    <td>
                      <Badge bg={contact.isRead ? 'secondary' : 'warning'} className="fs-6">
                        {contact.isRead ? 'Read' : 'Unread'}
                      </Badge>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <Button
                          size="sm"
                          variant={contact.isRead ? "outline-primary" : "outline-success"}
                          onClick={() => onViewMessage(contact)}
                          className="fs-6"
                          title={contact.isRead ? "View message" : "View message (mark as read)"}
                        >
                          👁‍🗨
                        </Button>
                        
                        {!contact.isRead && (
                          <Button
                            size="sm"
                            variant="outline-success"
                            onClick={() => onMarkAsRead(contact.id)}
                            className="fs-6"
                            title="Mark as read without viewing"
                          >
                            <i className="bi bi-check"></i>
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => onDeleteContact(contact.id)}
                          className="fs-6"
                          title="Delete message"
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

// In your AppointmentsManagement component, update the table headers and rows:
const AppointmentsManagement = ({ 
  appointments, 
  loading, 
  onViewAppointment, 
  onStatusChange, 
  onDeleteAppointment, 
  error 
}) => {
  
  // Helper function to format time nicely
  const formatTime = (timeString) => {
    if (!timeString) return 'Not set';
    
    try {
      // If time is in HH:MM format (like "14:30")
      if (timeString.includes(':')) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${ampm}`;
      }
      return timeString; // Return as is if format is unexpected
    } catch (error) {
      return timeString; // Return original if parsing fails
    }
  };

  // Sort appointments by date (most recent first)
  const sortedAppointments = [...appointments].sort((a, b) => {
    return new Date(b.appointmentDate) - new Date(a.appointmentDate);
  });

  // Filter for today's appointments
  const todaysAppointments = sortedAppointments.filter(apt => {
    const today = new Date().toDateString();
    const aptDate = new Date(apt.appointmentDate).toDateString();
    return today === aptDate;
  });

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center p-3 p-md-4">
        <div>
          <h5 className="mb-0 h5 h4-md">📅 Appointment Management</h5>
          {todaysAppointments.length > 0 && (
            <small className="text-success fw-bold">
              <i className="bi bi-star-fill me-1"></i>
              {todaysAppointments.length} appointment(s) today
            </small>
          )}
        </div>
        <div className="d-flex align-items-center gap-2">
          <Badge bg="warning" className="fs-6">
            {appointments.filter(apt => apt.status === 'PENDING' || !apt.status).length} Pending
          </Badge>
          <Badge bg="success" className="fs-6">
            {appointments.filter(apt => apt.status === 'COMPLETED').length} Completed
          </Badge>
        </div>
      </Card.Header>
      <Card.Body className="p-3 p-md-4">
        {error && (
          <Alert variant="warning">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-4 py-md-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted fs-6">Loading appointments from database...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-4 py-md-5">
            <i className="bi bi-calendar-check text-muted" style={{ fontSize: '2rem' }}></i>
            <h5 className="mt-3 text-muted h5 h4-md">No Appointments Found</h5>
            <p className="text-muted fs-6">No appointments have been booked yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover className="fs-6">
              <thead className="table-light">
                <tr>
                  <th>Customer</th>
                  <th className="d-none d-md-table-cell">Contact</th>
                  <th>Service</th> {/* NEW: Added Service column */}
                  <th>Date & Time</th>
                  <th className="d-none d-sm-table-cell">Requirements</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedAppointments.map(appointment => {
                  const isToday = new Date(appointment.appointmentDate).toDateString() === new Date().toDateString();
                  const isUpcoming = new Date(appointment.appointmentDate) > new Date();
                  
                  return (
                    <tr key={appointment.id} className={
                      appointment.status === 'PENDING' || !appointment.status ? 'table-warning' :
                      appointment.status === 'COMPLETED' ? 'table-success' :
                      appointment.status === 'RESOLVED' ? 'table-info' : ''
                    }>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="customer-avatar bg-primary text-white rounded-circle me-2 d-flex align-items-center justify-content-center" 
                               style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                            {appointment.name?.charAt(0).toUpperCase() || 'C'}
                          </div>
                          <div>
                            <strong className="fs-6">{appointment.name}</strong>
                            <div className="text-muted small d-md-none">
                              {appointment.email}
                            </div>
                            <div className="text-muted small d-md-none">
                              {appointment.mobNo}
                            </div>
                            {isToday && (
                              <Badge bg="success" className="ms-1 fs-6">Today</Badge>
                            )}
                            {isUpcoming && appointment.status === 'PENDING' && (
                              <Badge bg="info" className="ms-1 fs-6">Upcoming</Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="d-none d-md-table-cell">
                        <div className="text-truncate" style={{ maxWidth: '150px' }} title={appointment.email}>
                          {appointment.email}
                        </div>
                        <div className="text-muted small">{appointment.mobNo}</div>
                      </td>
                      <td>
                        {/* NEW: Service Badge */}
                        <Badge 
                          bg="secondary" 
                          className="fs-6 text-truncate" 
                          style={{ maxWidth: '120px' }}
                          title={appointment.selectedService}
                        >
                          <i className="bi bi-tools me-1"></i>
                          {appointment.selectedService || 'Not specified'}
                        </Badge>
                      </td>
                      <td>
                        <div>
                          <small className="text-muted d-block">
                            {appointment.appointmentDate ? 
                              new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              }) : 'N/A'}
                          </small>
                          <small className="text-primary fw-bold">
                            {formatTime(appointment.appointmentTime)}
                          </small>
                        </div>
                      </td>
                      <td className="d-none d-sm-table-cell">
                        <div 
                          className="text-truncate" 
                          style={{ maxWidth: '200px' }} 
                          title={appointment.description}
                        >
                          {appointment.description || 'No specific requirements'}
                        </div>
                      </td>
                      <td>
                        <Badge 
                          bg={
                            appointment.status === 'COMPLETED' ? 'success' :
                            appointment.status === 'RESOLVED' ? 'info' : 'warning'
                          } 
                          className="fs-6"
                        >
                          {appointment.status || 'PENDING'}
                        </Badge>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => onViewAppointment(appointment)}
                            className="fs-6"
                            title="View appointment details"
                          >
                            <i className="bi bi-eye"></i>
                          </Button>
                          
                          {(appointment.status === 'PENDING' || !appointment.status) && (
                            <Button
                              size="sm"
                              variant="outline-success"
                              onClick={() => onStatusChange(appointment.id, 'COMPLETED')}
                              className="fs-6"
                              title="Mark as completed"
                            >
                              <i className="bi bi-check-lg"></i>
                            </Button>
                          )}
                          
                          {appointment.status !== 'RESOLVED' && (
                            <Button
                              size="sm"
                              variant="outline-info"
                              onClick={() => onStatusChange(appointment.id, 'RESOLVED')}
                              className="fs-6"
                              title="Mark as resolved"
                            >
                              <i className="bi bi-check-circle"></i>
                            </Button>
                          )}
                          
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => onDeleteAppointment(appointment.id)}
                            className="fs-6"
                            title="Delete appointment"
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            
            {/* Summary footer */}
            <div className="d-flex justify-content-between align-items-center mt-3 p-2 bg-light rounded">
              <small className="text-muted">
                Showing {sortedAppointments.length} appointment(s)
              </small>
              <div className="d-flex gap-2">
                <Badge bg="warning" className="fs-6">
                  Pending: {appointments.filter(apt => apt.status === 'PENDING' || !apt.status).length}
                </Badge>
                <Badge bg="success" className="fs-6">
                  Completed: {appointments.filter(apt => apt.status === 'COMPLETED').length}
                </Badge>
                <Badge bg="info" className="fs-6">
                  Resolved: {appointments.filter(apt => apt.status === 'RESOLVED').length}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

// Image Management Component
const ImageManagement = () => (
  <Card className="shadow-sm">
    <Card.Header className="bg-white p-3 p-md-4">
      <h5 className="mb-0 h5 h4-md">🖼️ Media Library</h5>
    </Card.Header>
    <Card.Body className="p-3 p-md-4">
      <div className="text-center py-4 py-md-5">
        <i className="bi bi-images text-muted" style={{ fontSize: '2rem' }}></i>
        <h5 className="mt-3 text-muted h5 h4-md">Media Library</h5>
        <p className="text-muted mb-4 fs-6">Upload and manage all your website images.</p>
        <Button variant="success" size="lg" className="fs-6">
          <i className="bi bi-cloud-upload me-2"></i>
          Upload Images
        </Button>
      </div>
    </Card.Body>
  </Card>
);
// Add this component at the bottom of your file
const ProjectsManagement = ({ 
  projects, 
  loading, 
  onCreateProject, 
  onUpdateProject, 
  onDeleteProject, 
  onToggleProjectStatus,
  error,
  getImageUrl
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Residential',
    description: '',
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState('');

  const projectTypes = ['Residential', 'Commercial', 'Industrial', 'Government', 'Institutional'];
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('📤 Selected project image file:', file.name, file.type, file.size);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setLocalError('Please select a valid image file (JPG, PNG, etc.)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setLocalError('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    setLocalError('');

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      console.log('🔄 Uploading project image to server...');
      
      const response = await api.post('/upload/image', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('✅ Project image upload successful:', response.data);

      if (!response.data.fileName) {
        throw new Error('No filename returned from server');
      }

      setFormData(prev => ({
        ...prev,
        image: response.data.fileName
      }));

      setImageFile(file);
      console.log('📝 Updated project form image field:', response.data.fileName);

    } catch (err) {
      console.error('❌ Project image upload failed:', err);
      setLocalError(`Failed to upload image: ${err.response?.data?.message || err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleShowModal = (project = null) => {
    setLocalError('');
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title || '',
        type: project.type || 'Residential',
        description: project.description || '',
        image: project.image || ''
      });
      setImageFile(null);
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        type: 'Residential',
        description: '',
        image: ''
      });
      setImageFile(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setImageFile(null);
    setLocalError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('🔄 Project form submitted');
    console.log('📝 Project form data:', formData);
    
    const projectData = {
      title: formData.title.trim(),
      type: formData.type,
      description: formData.description.trim(),
      image: formData.image.trim()
    };

    console.log('📦 Final project data to send:', projectData);

    if (!projectData.title || !projectData.type) {
      setLocalError('Project title and type are required');
      return;
    }

    console.log('🚀 Making project API call...');
    
    if (editingProject) {
      onUpdateProject(editingProject.id, projectData);
    } else {
      onCreateProject(projectData);
    }
    handleCloseModal();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getBadgeVariant = (type) => {
    switch (type) {
      case 'Residential': return 'primary'
      case 'Commercial': return 'success'
      case 'Industrial': return 'warning'
      case 'Government': return 'danger'
      case 'Institutional': return 'info'
      default: return 'secondary'
    }
  };

  return (
    <>
      <Card className="shadow-sm">
        <Card.Header className="bg-white d-flex justify-content-between align-items-center p-3 p-md-4">
          <h5 className="mb-0 h5 h4-md">🏗️ Project Management</h5>
          <div>
            <Badge bg="secondary" className="me-2 fs-6 d-none d-md-inline">
              {projects.filter(p => p.isActive).length} Active / {projects.length} Total
            </Badge>
            <Button variant="primary" size="sm" onClick={() => handleShowModal()} className="fs-6">
              <i className="bi bi-plus-circle me-1"></i>
              Add Project
            </Button>
          </div>
        </Card.Header>
        <Card.Body className="p-3 p-md-4">
          {error && (
            <Alert variant="warning">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-4 py-md-5">
              <Spinner animation="border" role="status" />
              <p className="mt-2 text-muted fs-6">Loading projects from database...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-4 py-md-5">
              <i className="bi bi-folder2-open text-muted" style={{ fontSize: '2rem' }}></i>
              <h5 className="mt-3 text-muted h5 h4-md">No Projects Found</h5>
              <p className="text-muted fs-6 mb-3">No projects are currently available in the database.</p>
              <Button variant="primary" onClick={() => handleShowModal()} className="fs-6">
                <i className="bi bi-plus-circle me-2"></i>
                Add First Project
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="fs-6">
                <thead className="table-light">
                  <tr>
                    <th>Project</th>
                    <th>Type</th>
                    <th className="d-none d-md-table-cell">Description</th>
                    <th>Status</th>
                    <th className="d-none d-lg-table-cell">Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(project => {
                    const imageUrl = getImageUrl(project.image);
                    
                    return (
                      <tr key={project.id} className={!project.isActive ? 'table-secondary' : ''}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div 
                              className="project-image bg-light rounded me-2 me-md-3 d-flex align-items-center justify-content-center"
                              style={{ width: '50px', height: '50px', overflow: 'hidden' }}
                            >
                              {imageUrl ? (
                                <img 
                                  src={imageUrl} 
                                  alt={project.title}
                                  style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover' 
                                  }}
                                  onError={(e) => {
                                    console.error('❌ Project image failed to load:', imageUrl);
                                    e.target.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <i className="bi bi-image text-muted fs-5"></i>
                              )}
                            </div>
                            <div>
                              <strong className="fs-6">{project.title}</strong>
                              <div className="d-md-none text-muted small text-truncate" style={{ maxWidth: '150px' }}>
                                {project.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <Badge bg={getBadgeVariant(project.type)} className="fs-6">
                            {project.type}
                          </Badge>
                        </td>
                        <td className="d-none d-md-table-cell">
                          <div className="text-truncate" style={{ maxWidth: '200px' }} title={project.description}>
                            {project.description || 'No description'}
                          </div>
                        </td>
                        <td>
                          <Badge bg={project.isActive ? 'success' : 'secondary'} className="fs-6">
                            {project.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="d-none d-lg-table-cell">
                          {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => handleShowModal(project)}
                              disabled={loading}
                              className="fs-6"
                            >
                              <i className="bi bi-pencil"></i>
                            </Button>
                            <Button
                              size="sm"
                              variant={project.isActive ? "outline-warning" : "outline-success"}
                              onClick={() => onToggleProjectStatus(project.id)}
                              disabled={loading}
                              className="fs-6"
                              title={project.isActive ? "Deactivate" : "Activate"}
                            >
                              <i className={project.isActive ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => onDeleteProject(project.id)}
                              disabled={loading}
                              className="fs-6"
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Add/Edit Project Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton className="p-3 p-md-4">
          <Modal.Title className="h5 h4-md">
            {editingProject ? 'Edit Project' : 'Add New Project'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="p-3 p-md-4">
            {localError && (
              <Alert variant="danger" className="mb-3">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {localError}
              </Alert>
            )}
            
            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fs-6">Project Title *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter project title"
                    size="lg"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fs-6">Project Type *</Form.Label>
                  <Form.Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    size="lg"
                  >
                    {projectTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label className="fs-6">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter project description"
                size="lg"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="fs-6">Project Image</Form.Label>
              
              {/* Image Preview */}
              {formData.image && (
                <div className="mb-3 text-center">
                  <img 
                    src={getImageUrl(formData.image)}
                    alt="Project preview" 
                    className="img-fluid rounded border"
                    style={{ maxHeight: '200px', maxWidth: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      console.error('❌ Project preview image failed to load:', formData.image);
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="mt-2">
                    <small className="text-muted">
                      Current image: <strong>{formData.image}</strong>
                    </small>
                  </div>
                </div>
              )}
              
              {/* File Upload Input */}
              <div className="mb-2">
                <Form.Label className="fs-6">Upload Project Image:</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  name="imageFile"
                  onChange={handleImageUpload}
                  disabled={uploading || loading}
                  size="lg"
                />
                {uploading && (
                  <div className="mt-2">
                    <Spinner animation="border" size="sm" className="me-2" />
                    <small className="text-muted">Uploading image...</small>
                  </div>
                )}
              </div>
              
              {/* URL Input (Alternative) */}
              <div className="mt-3">
                <Form.Label className="fs-6">Or Enter Image URL/Filename:</Form.Label>
                <Form.Control
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="project-image.jpg or https://example.com/image.jpg"
                  size="lg"
                />
                <Form.Text className="text-muted">
                  Enter just the filename (e.g., "project1.jpg") or full image URL
                </Form.Text>
              </div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="p-3 p-md-4">
            <Button variant="secondary" onClick={handleCloseModal} disabled={loading} className="fs-6">
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading || uploading} className="fs-6">
              {loading ? 'Saving...' : uploading ? 'Uploading...' : editingProject ? 'Update Project' : 'Create Project'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AdminDashboard;