import "./Announcement.css"
import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';


// ANNOUNCEMENT CARD COMPONENT
const AnnouncementCard = ({ announcement, onEdit, onDelete }) => {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="announcement-card">
            <div className="card-header">
                <h3 className="card-title">{announcement.title}</h3>
                <span className="card-date">{formatDate(announcement.date)}</span>
            </div>
            <p className="card-description">{announcement.description}</p>
            <div className="card-footer">
                <span className="card-author">
                    <i className="fas fa-user"></i> {announcement.author}
                </span>
                <div className="card-actions">
                    <button
                        className="action-button edit-button"
                        onClick={() => onEdit(announcement)}
                        aria-label={`Edit announcement: ${announcement.title}`}
                    >
                        <i className="fas fa-edit"></i> Edit
                    </button>
                    <button
                        className="action-button delete-button"
                        onClick={() => onDelete(announcement)}
                        aria-label={`Delete announcement: ${announcement.title}`}
                    >
                        <i className="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

// ANNOUNCEMENT FORM COMPONENT
const AnnouncementForm = ({ isOpen, onClose, onSubmit, initialData, isEdit }) => {
    const [formData, setFormData] = React.useState({
        title: '',
        description: '',
        author: ''
    });

    const [errors, setErrors] = React.useState({});

    React.useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                author: initialData.author || ''
            });
        } else {
            setFormData({
                title: '',
                description: '',
                author: ''
            });
        }
        setErrors({});
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!formData.author.trim()) {
            newErrors.author = 'Author is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    if (!isOpen) return null;



    return (
        <div
            className="modal-overlay"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 999999,
            }}
        >
            <div
                className="modal"
                style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "12px",
                    zIndex: 1000000,
                }}
            >
                <h2>Test Modal</h2>
                <p>If you see this, modal works ✅</p>
            </div>

            <div className="modal">
                <div className="modal-header">
                    <h2 className="modal-title">
                        <i className={`fas ${isEdit ? 'fa-edit' : 'fa-plus'}`}></i>
                        {isEdit ? 'Edit Announcement' : 'Add New Announcement'}
                    </h2>
                    <button
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="title" className="form-label">Title *</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Enter announcement title"
                            />
                            {errors.title && <span className="error-message">{errors.title}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="description" className="form-label">Description *</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="form-textarea"
                                placeholder="Enter announcement description"
                            />
                            {errors.description && <span className="error-message">{errors.description}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="author" className="form-label">Author *</label>
                            <input
                                type="text"
                                id="author"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Enter author name"
                            />
                            {errors.author && <span className="error-message">{errors.author}</span>}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={onClose}
                        >
                            <i className="fas fa-times"></i> Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-button"
                        >
                            <i className={`fas ${isEdit ? 'fa-check' : 'fa-plus'}`}></i>
                            {isEdit ? 'Update Announcement' : 'Add Announcement'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// DELETE CONFIRMATION COMPONENT
const DeleteConfirmation = ({ isOpen, onClose, onConfirm, announcement }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="delete-modal-content">
                    <div className="delete-modal-icon">
                        <i className="fas fa-exclamation-circle"></i>
                    </div>
                    <p className="delete-modal-message">
                        Are you sure you want to delete the announcement<br />"{announcement?.title}"?
                    </p>
                    <div className="delete-modal-actions">
                        <button
                            className="cancel-button"
                            onClick={onClose}
                        >
                            <i className="fas fa-times"></i> Cancel
                        </button>
                        <button
                            className="action-button delete-button"
                            onClick={() => onConfirm(announcement.id)}
                            style={{ padding: '12px 25px' }}
                        >
                            <i className="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// MAIN ANNOUNCEMENTS PAGE COMPONENT
const Announcement = () => {
    const [announcements, setAnnouncements] = React.useState([
        {
            id: 1,
            title: 'Welcome to the New Semester',
            description: 'We are excited to welcome all students to the new semester. Classes will begin on Monday, and we have many exciting activities planned.',
            date: '2023-08-15',
            author: 'Principal Johnson'
        },
        {
            id: 2,
            title: 'Library Hours Update',
            description: 'Starting next week, the library will be open until 10 PM on weekdays to accommodate students who need extra study time.',
            date: '2023-08-18',
            author: 'Library Department'
        },
        {
            id: 3,
            title: 'Science Fair Registration',
            description: 'Registration for the annual science fair is now open. All students interested in participating should sign up by the end of the month.',
            date: '2023-08-20',
            author: 'Science Department'
        }
    ]);

    const [searchTerm, setSearchTerm] = React.useState('');
    const [sortOrder, setSortOrder] = React.useState('newest');
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = React.useState(null);
    const [announcementToDelete, setAnnouncementToDelete] = React.useState(null);

    // Filter and sort announcements
    const filteredAndSortedAnnouncements = React.useMemo(() => {
        return announcements
            .filter(announcement =>
                announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                announcement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                announcement.author.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => {
                if (sortOrder === 'newest') {
                    return new Date(b.date) - new Date(a.date);
                } else {
                    return new Date(a.date) - new Date(b.date);
                }
            });
    }, [announcements, searchTerm, sortOrder]);

    // Handlers
    const handleAddAnnouncement = () => {
        console.log("✅ Add button clicked"); // add this
        setEditingAnnouncement(null);
        setIsFormOpen(true);
    };

    const handleEditAnnouncement = (announcement) => {
        setEditingAnnouncement(announcement);
        setIsFormOpen(true);
    };

    const handleDeleteAnnouncement = (announcement) => {
        setAnnouncementToDelete(announcement);
        setIsDeleteModalOpen(true);
    };

    const handleSubmit = (formData) => {
        if (editingAnnouncement) {
            // Update existing announcement
            setAnnouncements(prev =>
                prev.map(item =>
                    item.id === editingAnnouncement.id
                        ? { ...item, ...formData }
                        : item
                )
            );
        } else {
            // Add new announcement
            const newAnnouncement = {
                id: Date.now(), // Generate a unique ID
                ...formData,
                date: new Date().toISOString().split('T')[0] // Current date
            };
            setAnnouncements(prev => [newAnnouncement, ...prev]);
        }
        setIsFormOpen(false);
    };

    const confirmDelete = (id) => {
        setAnnouncements(prev => prev.filter(announcement => announcement.id !== id));
        setIsDeleteModalOpen(false);
    };

    return (
        <div className="announcements-page">
            <div className="page-header">
                <h1 className="page-title">
                    <i className="fas fa-bullhorn"></i>
                    Announcements
                </h1>
                <div className="controls">
                    <div className="search-bar">
                        <i className="fas fa-search search-icon"></i>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search announcements..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            aria-label="Search announcements"
                        />
                    </div>
                    <select
                        className="sort-dropdown"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        aria-label="Sort announcements"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                    <button
                        className="add-button"
                        onClick={handleAddAnnouncement}
                        aria-label="Add new announcement"
                    >
                        <i className="fas fa-plus"></i> Add New
                    </button>
                </div>
            </div>

            <div className="announcements-grid">
                {filteredAndSortedAnnouncements.length > 0 ? (
                    filteredAndSortedAnnouncements.map(announcement => (
                        <AnnouncementCard
                            key={announcement.id}
                            announcement={announcement}
                            onEdit={handleEditAnnouncement}
                            onDelete={handleDeleteAnnouncement}
                        />
                    ))
                ) : (
                    <div className="no-announcements">
                        <i className="fas fa-clipboard-list"></i>
                        <h3>No announcements found</h3>
                        <p>{searchTerm ? 'Try a different search term.' : 'Create your first announcement!'}</p>
                    </div>
                )}
            </div>

            <AnnouncementForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingAnnouncement}
                isEdit={!!editingAnnouncement}
            />

            <DeleteConfirmation
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                announcement={announcementToDelete}
            />
        </div>
    );
};

export default Announcement
