import "./SideNav.css"
import React, { useState, useEffect } from 'react';
// Sidebar Navigation Component
const Sidebar = ({ isCollapsed, setIsCollapsed, currentView, setCurrentView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'assignments', label: 'Assignments', icon: '📝' },
    { id: 'performance', label: 'Performance', icon: '📈' },
    { id: 'materials', label: 'Study Materials', icon: '📚' },
    { id: 'announcements', label: 'Announcements', icon: '📢' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && <h2>Student Portal</h2>}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="collapse-btn"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? '➡️' : '⬅️'}
        </button>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map(item => (
            <li key={item.id}>
              <button
                onClick={() => setCurrentView(item.id)}
                className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                aria-label={item.label}
                aria-current={currentView === item.id ? 'page' : undefined}
              >
                <span className="nav-icon">{item.icon}</span>
                {!isCollapsed && <span className="nav-label">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};