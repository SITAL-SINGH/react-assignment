import "./Assignment.css"
// AssignmentManager.jsx
import React, { useState, useEffect } from 'react';


const Assignment = () => {
  // Mock assignment data
  const initialAssignments = [
    {
      id: 1,
      title: 'Math Homework',
      description: 'Complete exercises 1-10 on page 45',
      dueDate: '2023-11-15',
      status: 'pending',
      subject: 'Mathematics',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Science Project',
      description: 'Research on renewable energy sources',
      dueDate: '2023-11-20',
      status: 'in-progress',
      subject: 'Science',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'History Essay',
      description: 'Write a 1000-word essay on World War II',
      dueDate: '2023-11-10',
      status: 'completed',
      subject: 'History',
      priority: 'low'
    }
  ];

  const [assignments, setAssignments] = useState(initialAssignments);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Get unique subjects for filter
  const subjects = ['all', ...new Set(assignments.map(a => a.subject))];

  // Filter assignments based on search term and filters
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    const matchesSubject = filterSubject === 'all' || assignment.subject === filterSubject;
    
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const handleAddAssignment = () => {
    setIsEditMode(false);
    setCurrentAssignment(null);
    setIsFormOpen(true);
  };

  const handleEditAssignment = (assignment) => {
    setIsEditMode(true);
    setCurrentAssignment(assignment);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (assignment) => {
    setAssignmentToDelete(assignment);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = (id) => {
    setAssignments(prev => prev.filter(assignment => assignment.id !== id));
    setIsDeleteModalOpen(false);
    showNotification('Assignment deleted successfully', 'success');
  };

  const handleSubmit = (data) => {
    if (isEditMode) {
      // Update existing assignment
      setAssignments(prev => 
        prev.map(assignment => 
          assignment.id === currentAssignment.id 
            ? { ...data, id: currentAssignment.id } 
            : assignment
        )
      );
      showNotification('Assignment updated successfully', 'success');
    } else {
      // Add new assignment
      const newAssignment = {
        ...data,
        id: Date.now() // Simple ID generation
      };
      setAssignments(prev => [...prev, newAssignment]);
      showNotification('Assignment added successfully', 'success');
    }
    setIsFormOpen(false);
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
  };

  const closeNotification = () => {
    setNotification({ show: false, message: '', type: '' });
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status display text
  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Pending';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  // Get priority display text
  const getPriorityText = (priority) => {
    switch(priority) {
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return priority;
    }
  };

  return (
    <div className="assignment-manager">
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1><i className="fas fa-tasks"></i> Assignment Manager</h1>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={handleAddAssignment}>
              <i className="fas fa-plus"></i> Add Assignment
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="controls">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filters">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              <option value="all">All Subjects</option>
              {subjects.filter(s => s !== 'all').map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Assignments List */}
        <div className="assignments-container">
          {filteredAssignments.length > 0 ? (
            <div className="assignments-grid">
              {filteredAssignments.map(assignment => (
                <div key={assignment.id} className="assignment-card">
                  <div className="card-header">
                    <h3>{assignment.title}</h3>
                    <span className={`priority-badge priority-${assignment.priority}`}>
                      {getPriorityText(assignment.priority)}
                    </span>
                  </div>
                  
                  <div className="card-body">
                    <p className="assignment-description">{assignment.description}</p>
                    
                    <div className="assignment-details">
                      <div className="detail-item">
                        <i className="fas fa-book"></i>
                        <span>{assignment.subject}</span>
                      </div>
                      
                      <div className="detail-item">
                        <i className="fas fa-calendar"></i>
                        <span>Due: {formatDate(assignment.dueDate)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-footer">
                    <span className={`status-badge status-${assignment.status}`}>
                      {getStatusText(assignment.status)}
                    </span>
                    
                    <div className="action-buttons">
                      <button 
                        className="btn-icon btn-edit"
                        onClick={() => handleEditAssignment(assignment)}
                        aria-label={`Edit ${assignment.title}`}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      
                      <button 
                        className="btn-icon btn-delete"
                        onClick={() => handleDeleteClick(assignment)}
                        aria-label={`Delete ${assignment.title}`}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <i className="fas fa-clipboard-list"></i>
              <h2>No assignments found</h2>
              <p>Create your first assignment to get started</p>
            </div>
          )}
        </div>

        {/* Assignment Form Modal */}
        {isFormOpen && (
          <AssignmentForm
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleSubmit}
            initialData={currentAssignment}
            isEdit={isEditMode}
          />
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={() => confirmDelete(assignmentToDelete.id)}
            assignment={assignmentToDelete}
          />
        )}

        {/* Notification */}
        {notification.show && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={closeNotification}
          />
        )}
      </div>
    </div>
  );
};

// Assignment Form Component
const AssignmentForm = ({ isOpen, onClose, onSubmit, initialData, isEdit }) => {
  const [formData, setFormData] = useState(
    initialData || {
      title: '',
      description: '',
      dueDate: '',
      status: 'pending',
      subject: '',
      priority: 'medium'
    }
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Assignment' : 'Add New Assignment'}</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="assignment-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Assignment title"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Assignment description"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="dueDate">Due Date *</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEdit ? 'Update Assignment' : 'Add Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, assignment }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Confirm Deletion</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        
        <div className="modal-body">
          <p>Are you sure you want to delete the assignment "{assignment.title}"? This action cannot be undone.</p>
        </div>
        
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete Assignment
          </button>
        </div>
      </div>
    </div>
  );
};

// Notification Component
const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification notification-${type}`}>
      <div className="notification-content">
        <i className={`fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
        <span>{message}</span>
      </div>
      <button className="notification-close" onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

export default Assignment;