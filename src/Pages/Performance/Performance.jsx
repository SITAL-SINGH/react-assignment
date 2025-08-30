import React, { useState, useEffect } from 'react';
import "./Performance.css"

// Mock data for subjects and grades
const initialSubjects = [
  { id: 1, name: 'Mathematics', grade: 85 },
  { id: 2, name: 'Science', grade: 92 },
  { id: 3, name: 'History', grade: 78 },
  { id: 4, name: 'English Literature', grade: 88 },
  { id: 5, name: 'Art', grade: 95 },
  { id: 6, name: 'Physical Education', grade: 45 }
];

// Progress Bar Component
const ProgressBar = ({ percentage }) => {
  const getColor = (percent) => {
    if (percent < 50) return '#e74c3c'; // Red for low performance
    if (percent < 80) return '#f39c12'; // Orange for medium performance
    return '#2ecc71'; // Green for high performance
  };

  return (
    <div className="progress-bar">
      <div 
        className="progress-fill"
        style={{
          width: `${percentage}%`,
          backgroundColor: getColor(percentage)
        }}
      ></div>
      <span className="progress-text">{percentage}%</span>
    </div>
  );
};

// Subject Row Component
const SubjectRow = ({ subject, onGradeChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(subject.grade);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editValue >= 0 && editValue <= 100) {
      onGradeChange(subject.id, parseInt(editValue));
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(subject.grade);
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className={`subject-row ${subject.grade < 50 ? 'low-performance' : ''}`}>
      <div className="subject-name">{subject.name}</div>
      
      <div className="grade-display">
        {isEditing ? (
          <input
            type="number"
            min="0"
            max="100"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyPress}
            className="grade-input"
            autoFocus
          />
        ) : (
          <span className="grade-value">{subject.grade}%</span>
        )}
      </div>
      
      <div className="progress-container">
        <ProgressBar percentage={subject.grade} />
      </div>
      
      <div className="actions">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="btn-save" aria-label="Save grade">
              ✓
            </button>
            <button onClick={handleCancel} className="btn-cancel" aria-label="Cancel edit">
              ✗
            </button>
          </>
        ) : (
          <button onClick={handleEdit} className="btn-edit" aria-label="Edit grade">
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

// Main Performance Component
const Performance = () => {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [averageGrade, setAverageGrade] = useState(0);

  // Calculate average grade whenever subjects change
  useEffect(() => {
    const total = subjects.reduce((sum, subject) => sum + subject.grade, 0);
    setAverageGrade(Math.round(total / subjects.length));
  }, [subjects]);

  const handleGradeChange = (id, newGrade) => {
    setSubjects(subjects.map(subject => 
      subject.id === id ? { ...subject, grade: newGrade } : subject
    ));
  };

  const getPerformanceStatus = (average) => {
    if (average >= 90) return 'Excellent';
    if (average >= 80) return 'Very Good';
    if (average >= 70) return 'Good';
    if (average >= 60) return 'Satisfactory';
    if (average >= 50) return 'Needs Improvement';
    return 'Concern';
  };

  return (
    <div className="performance-page">
      <h1>Student Performance</h1>
      
      {/* Summary Card */}
      <div className="summary-card">
        <h2>Overall Performance</h2>
        <div className="average-grade">{averageGrade}%</div>
        <div className="performance-status">{getPerformanceStatus(averageGrade)}</div>
        <ProgressBar percentage={averageGrade} />
        <p>Based on {subjects.length} subjects</p>
      </div>
      
      {/* Subjects List */}
      <div className="subjects-container">
        <div className="subjects-header">
          <div className="header-name">Subject</div>
          <div className="header-grade">Grade</div>
          <div className="header-progress">Progress</div>
          <div className="header-actions">Actions</div>
        </div>
        
        <div className="subjects-list">
          {subjects.map(subject => (
            <SubjectRow 
              key={subject.id} 
              subject={subject} 
              onGradeChange={handleGradeChange} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Performance;