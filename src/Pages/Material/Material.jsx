import React, { useState } from "react";
import "./Material.css";

function Material() {
  const [materials, setMaterials] = useState(() => [
    {
      id: 1,
      title: "React Documentation",
      description: "Official React documentation for learning React concepts",
      type: "Link",
      url: "https://reactjs.org/docs/getting-started.html",
      createdAt: "2023-10-15",
    },
    {
      id: 2,
      title: "JavaScript Fundamentals",
      description: "Complete guide to JavaScript fundamentals with examples",
      type: "PDF",
      fileName: "javascript-fundamentals.pdf",
      createdAt: "2023-10-10",
    },
    {
      id: 3,
      title: "CSS Flexbox Guide",
      description:
        "Visual guide to CSS Flexbox layout with interactive examples",
      type: "Video",
      url: "https://www.youtube.com/watch?v=JJSoEo8JSnc",
      createdAt: "2023-10-05",
    },
    {
      id: 4,
      title: "Algorithm Notes",
      description: "My personal notes on algorithms and data structures",
      type: "Notes",
      content:
        "Binary Search: Divide and conquer approach for searching in sorted arrays. Time complexity: O(log n). Space complexity: O(1) for iterative approach.",
      createdAt: "2023-09-28",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState(() => "");
  const [filterType, setFilterType] = useState(() => "all");
  const [isFormOpen, setIsFormOpen] = useState(() => false);
  const [isEditMode, setIsEditMode] = useState(() => false);
  const [currentMaterial, setCurrentMaterial] = useState(() => null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(() => false);
  const [materialToDelete, setMaterialToDelete] = useState(() => null);
  const [formData, setFormData] = useState(() => ({
    title: "",
    description: "",
    type: "Link",
    url: "",
    content: "",
    fileName: "",
  }));

  function filteredMaterials() {
    return materials.filter((material) => {
      const matchesSearch =
        material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || material.type === filterType;
      return matchesSearch && matchesType;
    });
  }

  function openAddForm() {
    setIsEditMode(false);
    setCurrentMaterial(null);
    setFormData({
      title: "",
      description: "",
      type: "Link",
      url: "",
      content: "",
      fileName: "",
    });
    setIsFormOpen(true);
  }

  function openEditForm(material) {
    setIsEditMode(true);
    setCurrentMaterial(material);
    setFormData({
      title: material.title,
      description: material.description,
      type: material.type,
      url: material.url || "",
      content: material.content || "",
      fileName: material.fileName || "",
    });
    setIsFormOpen(true);
  }

  function openDeleteDialog(material) {
    setMaterialToDelete(material);
    setIsDeleteDialogOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setCurrentMaterial(null);
    setIsEditMode(false);
  }

  function closeDeleteDialog() {
    setIsDeleteDialogOpen(false);
    setMaterialToDelete(null);
  }

  function submitForm() {
    if (!formData.title.trim() || !formData.description.trim()) {
      return;
    }
    if (isEditMode) {
      const index = materials.findIndex((m) => m.id === currentMaterial.id);
      if (index !== -1) {
        materials[index] = {
          ...materials[index],
          title: formData.title,
          description: formData.description,
          type: formData.type,
          url: formData.url,
          content: formData.content,
          fileName: formData.fileName,
        };
      }
    } else {
      const newMaterial = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        type: formData.type,
        url: formData.url,
        content: formData.content,
        fileName: formData.fileName,
        createdAt: new Date().toISOString().split("T")[0],
      };
      materials.push(newMaterial);
    }
    closeForm();
  }

  function confirmDelete() {
    if (materialToDelete) {
      setMaterials(materials.filter((m) => m.id !== materialToDelete.id));
      closeDeleteDialog();
    }
  }

  function viewMaterial(material) {
    if (material.type === "Link" || material.type === "Video") {
      window.open(material.url, "_blank");
    } else if (material.type === "PDF") {
      alert(`Would open PDF: ${material.fileName}`);
    } else if (material.type === "Notes") {
      alert(`Notes: ${material.content}`);
    }
  }

  function getBadgeClass(type) {
    switch (type) {
      case "PDF":
        return "badge-pdf";
      case "Video":
        return "badge-video";
      case "Link":
        return "badge-link";
      case "Notes":
        return "badge-notes";
      default:
        return "badge-pdf";
    }
  }

  return (
    <div className="study-materials-container">
      <div className="study-materials-wrapper">
        <div className="header">
          <h1 className="title">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            Study Materials
          </h1>
          <button
            className="add-button"
            onClick={(event) => openAddForm()}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Material
          </button>
        </div>
        <div className="search-filter-container">
          <div className="search-container">
            <input
              className="search-input"
              type="text"
              placeholder="Search materials..."
              value={searchTerm}
              onInput={(event) => setSearchTerm(event.target.value)}
            />
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="search-icon"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <div className="filter-container">
            <select
              className="filter-select"
              value={filterType}
              onChange={(event) => setFilterType(event.target.value)}
            >
              <option value="all">All Types</option>
              <option value="PDF">PDF</option>
              <option value="Video">Video</option>
              <option value="Link">Link</option>
              <option value="Notes">Notes</option>
            </select>
          </div>
        </div>
        {filteredMaterials().length > 0 ? (
          <div className="materials-grid">
            {filteredMaterials()?.map((material) => (
              <div
                className="material-card"
                key={material.id}
              >
                <div className="material-header">
                  <h3 className="material-title">
                    {material.title}
                  </h3>
                  <p className="material-description">
                    {material.description}
                  </p>
                  <span
                    className="material-badge"
                    style={{
                      backgroundColor:
                        material.type === "PDF"
                          ? "#e63946"
                          : material.type === "Video"
                          ? "#3a86ff"
                          : material.type === "Link"
                          ? "#ff9e00"
                          : "#06d6a0",
                    }}
                  >
                    {material.type}
                  </span>
                </div>
                <div className="material-actions">
                  <button
                    className="view-button"
                    onClick={(event) => viewMaterial(material)}
                  >
                    View
                  </button>
                  <div className="action-buttons">
                    <button
                      className="edit-button"
                      onClick={(event) => openEditForm(material)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={(event) => openDeleteDialog(material)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="empty-icon"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <h2 className="empty-title">
              No materials found
            </h2>
            <p className="empty-description">
              Try adjusting your search or add a new material
            </p>
          </div>
        )}
        <div
          className="modal-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeForm();
            }
          }}
          style={{
            opacity: isFormOpen ? "1" : "0",
            visibility: isFormOpen ? "visible" : "hidden",
          }}
        >
          <div
            className="modal-content"
            style={{
              transform: isFormOpen ? "translateY(0)" : "translateY(20px)",
            }}
          >
            <div className="modal-header">
              <h2 className="modal-title">
                {isEditMode ? "Edit Material" : "Add New Material"}
              </h2>
              <button
                className="close-button"
                onClick={(event) => closeForm()}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  className="form-input"
                  type="text"
                  value={formData.title}
                  onInput={(event) => (formData.title = event.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  value={formData.description}
                  onInput={(event) =>
                    (formData.description = event.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <div className="radio-group">
                  {["Link", "PDF", "Video", "Notes"]?.map((type) => (
                    <label
                      className="radio-label"
                      key={type}
                    >
                      <input
                        type="radio"
                        name="type"
                        className="radio-input"
                        value={type}
                        checked={formData.type === type}
                        onChange={(event) =>
                          (formData.type = event.target.value)
                        }
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
              {(formData.type === "Link" || formData.type === "Video") && (
                <div className="form-group">
                  <label className="form-label">URL</label>
                  <input
                    className="form-input"
                    type="url"
                    value={formData.url}
                    onInput={(event) => (formData.url = event.target.value)}
                  />
                </div>
              )}
              {formData.type === "Notes" && (
                <div className="form-group">
                  <label className="form-label">Content</label>
                  <textarea
                    className="form-textarea"
                    rows="5"
                    value={formData.content}
                    onInput={(event) => (formData.content = event.target.value)}
                  />
                </div>
              )}
              {formData.type === "PDF" && (
                <div className="form-group">
                  <label className="form-label">File Name</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="e.g., document.pdf"
                    value={formData.fileName}
                    onInput={(event) =>
                      (formData.fileName = event.target.value)
                    }
                  />
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="cancel-button"
                onClick={(event) => closeForm()}
              >
                Cancel
              </button>
              <button
                className="submit-button"
                onClick={(event) => submitForm()}
              >
                {isEditMode ? "Update" : "Add"} Material
              </button>
            </div>
          </div>
        </div>
        <div
          className="modal-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeDeleteDialog();
            }
          }}
          style={{
            opacity: isDeleteDialogOpen ? "1" : "0",
            visibility: isDeleteDialogOpen ? "visible" : "hidden",
          }}
        >
          <div
            className="delete-modal-content"
            style={{
              transform: isDeleteDialogOpen
                ? "translateY(0)"
                : "translateY(20px)",
            }}
          >
            <h3 className="delete-modal-title">
              Delete Material
            </h3>
            <p className="delete-modal-description">
              Are you sure you want to delete "{materialToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="delete-modal-actions">
              <button
                className="cancel-button"
                onClick={(event) => closeDeleteDialog()}
              >
                Cancel
              </button>
              <button
                className="confirm-delete-button"
                onClick={(event) => confirmDelete()}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Material;
