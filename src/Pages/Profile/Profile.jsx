import React, { useState } from 'react';
import { useAuth } from '../../App';
import "./Profile.css"

const ProfileCard = ({ studentData, onEditClick }) => {
  return (
    <div className="profile-card">
      <div className="profile-picture">
        <img
          src={studentData.profilePicture || '/placeholder-avatar.png'}
          alt="Profile"
          aria-label="Student profile picture"
        />
      </div>
      <div className="profile-info">
        <h2>{studentData.name}</h2>
        <div className="info-grid">
          <InfoItem label="Email" value={studentData.email} />
          <InfoItem label="Course" value={studentData.course} />
          <InfoItem label="Year" value={`Year ${studentData.year}`} />
          <InfoItem label="Student ID" value={studentData.studentId} />
        </div>
        <button
          onClick={onEditClick}
          className="edit-btn"
          aria-label="Edit profile information"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <>
    <span className="info-label">{label}:</span>
    <span className="info-value">{value}</span>
  </>
);

const EditProfileForm = ({ studentData, onSave, onCancel }) => {
  const [formData, setFormData] = useState(studentData);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.course.trim()) newErrors.course = 'Course is required';
    if (!formData.year) newErrors.year = 'Year is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="edit-form">
      <div className="form-picture">
        <img
          src={formData.profilePicture || '/placeholder-avatar.png'}
          alt="Profile"
          aria-label="Student profile picture"
        />
        <input
          type="file"
          accept="image/*"
          aria-label="Upload profile picture"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                setFormData(prev => ({ ...prev, profilePicture: e.target.result }));
              };
              reader.readAsDataURL(file);
            }
          }}
        />
      </div>
      <div className="form-fields">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && <span id="name-error" className="error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && <span id="email-error" className="error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="course">Course:</label>
          <input
            type="text"
            id="course"
            name="course"
            value={formData.course}
            onChange={handleChange}
            aria-invalid={!!errors.course}
            aria-describedby={errors.course ? 'course-error' : undefined}
          />
          {errors.course && <span id="course-error" className="error">{errors.course}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="year">Year:</label>
          <select
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            aria-invalid={!!errors.year}
            aria-describedby={errors.year ? 'year-error' : undefined}
          >
            <option value="">Select Year</option>
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
          </select>
          {errors.year && <span id="year-error" className="error">{errors.year}</span>}
        </div>

        <div className="form-buttons">
          <button type="submit" className="save-btn">Save Changes</button>
          <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </form>
  );
};

const StudentProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState({});
  const { user, updateProfile } = useAuth();

  const handleEditClick = () => {
    setTempData(user);
    setIsEditing(true);
  };

  const handleSave = (newData) => {
    updateProfile(newData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="student-profile">
      {isEditing ? (
        <EditProfileForm
          studentData={tempData}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <ProfileCard
          studentData={user}
          onEditClick={handleEditClick}
        />
      )}
    </div>
  );
};

export default StudentProfile;