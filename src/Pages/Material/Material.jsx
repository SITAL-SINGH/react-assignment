import React, { useState } from 'react';
import './Material.css';
<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"></script>

// MaterialCard Component
const MaterialCard = ({ material, onEdit, onDelete, onView }) => {
    const getBadgeClass = (type) => {
        switch (type) {
            case 'PDF': return 'badge-pdf';
            case 'Video': return 'badge-video';
            case 'Link': return 'badge-link';
            case 'Notes': return 'badge-notes';
            default: return '';
        }
    };

    const handleView = () => {
        onView(material);
    };

    return (
        <div className="material-card">
            <div className="card-header">
                <h3 className="card-title">{material.title}</h3>
                <p className="card-description">{material.description}</p>
                <span className={`card-badge ${getBadgeClass(material.type)}`}>
                    {material.type}
                </span>
            </div>
            <div className="card-body">
                <div className="card-content">
                    {material.type === 'Notes' && material.content && (
                        <p>{material.content.substring(0, 100)}...</p>
                    )}
                    {material.type === 'Link' && material.url && (
                        <p>URL: {material.url}</p>
                    )}
                    {material.type === 'PDF' && material.fileName && (
                        <p>File: {material.fileName}</p>
                    )}
                    {material.type === 'Video' && material.url && (
                        <p>Video URL: {material.url}</p>
                    )}
                </div>
                <div className="card-actions">
                    <button 
                        className="btn btn-secondary btn-sm" 
                        onClick={() => onEdit(material)}
                        aria-label={`Edit ${material.title}`}
                    >
                        <i className="fas fa-edit"></i> Edit
                    </button>
                    <button 
                        className="btn btn-danger btn-sm" 
                        onClick={() => onDelete(material)}
                        aria-label={`Delete ${material.title}`}
                    >
                        <i className="fas fa-trash"></i> Delete
                    </button>
                    <button 
                        className="btn btn-primary btn-sm" 
                        onClick={handleView}
                        aria-label={`View ${material.title}`}
                    >
                        <i className="fas fa-eye"></i> View
                    </button>
                </div>
            </div>
        </div>
    );
};

// MaterialForm Component
const MaterialForm = ({ isOpen, onClose, onSubmit, material, isEdit }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'PDF',
        url: '',
        content: '',
        file: null
    });
    const [errors, setErrors] = useState({});

    React.useEffect(() => {
        if (material) {
            setFormData({
                title: material.title || '',
                description: material.description || '',
                type: material.type || 'PDF',
                url: material.url || '',
                content: material.content || '',
                file: null
            });
        } else {
            setFormData({
                title: '',
                description: '',
                type: 'PDF',
                url: '',
                content: '',
                file: null
            });
        }
    }, [material, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, file: e.target.files[0] }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (formData.type === 'Link' && !formData.url) {
            newErrors.url = 'URL is required for links';
        }

        if (formData.type === 'Notes' && !formData.content) {
            newErrors.content = 'Content is required for notes';
        }

        if (formData.type === 'PDF' && !formData.file && !isEdit) {
            newErrors.file = 'File is required for PDFs';
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
        <div className="modal-overlay active">
            <div className="modal">
                <div className="modal-header">
                    <h2 className="modal-title">
                        {isEdit ? 'Edit Material' : 'Add New Material'}
                    </h2>
                    <button className="modal-close" onClick={onClose} aria-label="Close modal">
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Enter title"
                            />
                            {errors.title && <div className="form-error">{errors.title}</div>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="form-control"
                                rows="3"
                                placeholder="Enter description"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Type *</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="form-control"
                            >
                                <option value="PDF">PDF</option>
                                <option value="Video">Video</option>
                                <option value="Link">Link</option>
                                <option value="Notes">Notes</option>
                            </select>
                        </div>

                        {formData.type === 'Link' || formData.type === 'Video' ? (
                            <div className="form-group">
                                <label className="form-label">URL *</label>
                                <input
                                    type="url"
                                    name="url"
                                    value={formData.url}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Enter URL"
                                />
                                {errors.url && <div className="form-error">{errors.url}</div>}
                            </div>
                        ) : null}

                        {formData.type === 'Notes' ? (
                            <div className="form-group">
                                <label className="form-label">Content *</label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    className="form-control"
                                    rows="5"
                                    placeholder="Enter your notes"
                                />
                                {errors.content && <div className="form-error">{errors.content}</div>}
                            </div>
                        ) : null}

                        {formData.type === 'PDF' ? (
                            <div className="form-group">
                                <label className="form-label">
                                    {isEdit ? 'Replace PDF File (optional)' : 'PDF File *'}
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="form-control"
                                />
                                {errors.file && <div className="form-error">{errors.file}</div>}
                                {isEdit && material.fileName && (
                                    <p>Current file: {material.fileName}</p>
                                )}
                            </div>
                        ) : null}
                    </form>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSubmit}>
                        {isEdit ? 'Update' : 'Add'} Material
                    </button>
                </div>
            </div>
        </div>
    );
};

// ConfirmDialog Component
const ConfirmDialog = ({ isOpen, onClose, onConfirm, material }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay active">
            <div className="confirm-dialog">
                <h3 className="confirm-title">Confirm Deletion</h3>
                <p className="confirm-message">
                    Are you sure you want to delete "{material?.title}"? This action cannot be undone.
                </p>
                <div className="confirm-actions">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn btn-danger" onClick={() => onConfirm(material.id)}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

// SearchBar Component
const SearchBar = ({ searchTerm, onSearchChange, filterType, onFilterChange }) => {
    return (
        <div className="search-filter">
            <div className="search-box">
                <i className="fas fa-search"></i>
                <input
                    type="text"
                    placeholder="Search materials..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    aria-label="Search materials"
                />
            </div>
            <div className="filters">
                <select
                    className="filter-select"
                    value={filterType}
                    onChange={(e) => onFilterChange(e.target.value)}
                    aria-label="Filter by type"
                >
                    <option value="all">All Types</option>
                    <option value="PDF">PDF</option>
                    <option value="Video">Video</option>
                    <option value="Link">Link</option>
                    <option value="Notes">Notes</option>
                </select>
            </div>
        </div>
    );
};

// Main StudyMaterials Component
const Material = () => {
    const [materials, setMaterials] = useState([
        {
            id: 1,
            title: 'React Documentation',
            description: 'Official React documentation for learning React concepts',
            type: 'Link',
            url: 'https://reactjs.org/docs/getting-started.html',
            createdAt: '2023-10-15'
        },
        {
            id: 2,
            title: 'JavaScript Fundamentals',
            description: 'Complete guide to JavaScript fundamentals with examples',
            type: 'PDF',
            fileName: 'javascript-fundamentals.pdf',
            createdAt: '2023-10-10'
        },
        {
            id: 3,
            title: 'CSS Flexbox Guide',
            description: 'Visual guide to CSS Flexbox layout with interactive examples',
            type: 'Video',
            url: 'https://www.youtube.com/watch?v=JJSoEo8JSnc',
            createdAt: '2023-10-05'
        },
        {
            id: 4,
            title: 'Algorithm Notes',
            description: 'My personal notes on algorithms and data structures',
            type: 'Notes',
            content: 'Binary Search: Divide and conquer approach...',
            createdAt: '2023-09-28'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentMaterial, setCurrentMaterial] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [materialToDelete, setMaterialToDelete] = useState(null);

    // Filter materials based on search term and type filter
    const filteredMaterials = materials.filter(material => {
        const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             material.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || material.type === filterType;
        return matchesSearch && matchesType;
    });

    const handleAddMaterial = () => {
        setIsEditMode(false);
        setCurrentMaterial(null);
        setIsFormOpen(true);
    };

    const handleEditMaterial = (material) => {
        setIsEditMode(true);
        setCurrentMaterial(material);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (material) => {
        setMaterialToDelete(material);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = (id) => {
        setMaterials(prev => prev.filter(material => material.id !== id));
        setIsDeleteDialogOpen(false);
    };

    const handleSubmit = (formData) => {
        if (isEditMode) {
            // Update existing material
            setMaterials(prev => 
                prev.map(material => 
                    material.id === currentMaterial.id 
                        ? { 
                            ...material, 
                            title: formData.title,
                            description: formData.description,
                            type: formData.type,
                            url: formData.url,
                            content: formData.content,
                            fileName: formData.file ? formData.file.name : material.fileName
                        } 
                        : material
                )
            );
        } else {
            // Add new material
            const newMaterial = {
                id: Date.now(),
                title: formData.title,
                description: formData.description,
                type: formData.type,
                url: formData.url,
                content: formData.content,
                fileName: formData.file ? formData.file.name : null,
                createdAt: new Date().toISOString().split('T')[0]
            };
            setMaterials(prev => [...prev, newMaterial]);
        }
        setIsFormOpen(false);
    };

    const handleViewMaterial = (material) => {
        if (material.type === 'Link' || material.type === 'Video') {
            window.open(material.url, '_blank');
        } else if (material.type === 'PDF') {
            // In a real app, this would open the PDF
            alert(`Would open PDF: ${material.fileName}`);
        } else if (material.type === 'Notes') {
            // Show notes in a modal or expand the card
            alert(`Notes: ${material.content}`);
        }
    };

    return (
        <div className="container">
            <div className="header">
                <h1><i className="fas fa-book"></i> Study Materials</h1>
                <div className="header-actions">
                    <button className="btn btn-primary" onClick={handleAddMaterial}>
                        <i className="fas fa-plus"></i> Add Material
                    </button>
                </div>
            </div>

            <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filterType={filterType}
                onFilterChange={setFilterType}
            />

            {filteredMaterials.length > 0 ? (
                <div className="materials-grid">
                    {filteredMaterials.map(material => (
                        <MaterialCard
                            key={material.id}
                            material={material}
                            onEdit={handleEditMaterial}
                            onDelete={handleDeleteClick}
                            onView={handleViewMaterial}
                        />
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <i className="fas fa-search" style={{ fontSize: '60px', color: '#ccc', marginBottom: '20px' }}></i>
                    <h2 style={{ color: '#666', marginBottom: '15px' }}>No materials found</h2>
                    <p style={{ color: '#888' }}>Try adjusting your search or add a new material</p>
                </div>
            )}

            <MaterialForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSubmit}
                material={currentMaterial}
                isEdit={isEditMode}
            />

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                material={materialToDelete}
            />
        </div>
    );
};

export default Material;