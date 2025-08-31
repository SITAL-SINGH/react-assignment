import React, { useState, useEffect } from 'react';
import "./Dashboard.css"
import Assignment from '../Assignment/Assignment';
import Performance from '../Performance/Performance';
import Material from '../Material/Material';
import StudentProfile from '../Profile/Profile';
import Announcement from '../Announcement/Annoucement';
// import LogIn from '../LogIn/LogIn';

// Mock data (would typically be in a separate file)
const mockData = {
  assignments: [
    { id: 1, title: 'Math Homework', dueDate: '2023-10-05', subject: 'Mathematics', status: 'pending' },
    { id: 2, title: 'Science Project', dueDate: '2023-10-07', subject: 'Science', status: 'pending' },
    { id: 3, title: 'History Essay', dueDate: '2023-10-10', subject: 'History', status: 'completed' },
    { id: 4, title: 'English Literature Review', dueDate: '2023-10-12', subject: 'English', status: 'pending' },
  ],
  announcements: [
    {
      id: 1,
      title: 'School Holiday',
      description: 'School will be closed next Monday for a public holiday.',
      date: '2023-10-01'
    },
    {
      id: 2,
      title: 'Exam Schedule',
      description: 'Final exam schedule has been posted. Please check your student portal.',
      date: '2023-10-03'
    },
    {
      id: 3,
      title: 'Library Hours Extended',
      description: 'Library will remain open until 8 PM during exam season.',
      date: '2023-10-05'
    },
  ],
  performance: [
    { subject: 'Math', grade: 85, maxGrade: 100 },
    { subject: 'Science', grade: 92, maxGrade: 100 },
    { subject: 'History', grade: 78, maxGrade: 100 },
    { subject: 'English', grade: 88, maxGrade: 100 },
    { subject: 'Art', grade: 95, maxGrade: 100 },
  ],
  attendance: [
    { month: 'Jan', present: 90 },
    { month: 'Feb', present: 85 },
    { month: 'Mar', present: 92 },
    { month: 'Apr', present: 88 },
    { month: 'May', present: 95 },
    { month: 'Jun', present: 91 },
  ]
};

// Reusable Card Component
const Card = ({ children, className = '', onClick }) => {
  return (
    <div
      className={`card ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Custom Bar Chart Component
const BarChart = ({ data, width = 300, height = 200 }) => {
  const maxValue = Math.max(...data.map(item => item.grade));

  return (
    <div className="chart-container" style={{ width: `${width}px`, height: `${height}px` }}>
      <div className="chart">
        {data.map((item, index) => {
          const barHeight = (item.grade / maxValue) * (height - 40);
          return (
            <div key={index} className="bar-container">
              <div
                className="bar"
                style={{ height: `${barHeight}px` }}
                title={`${item.subject}: ${item.grade}%`}
              ></div>
              <span className="bar-label">{item.subject}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Custom Line Chart Component
const LineChart = ({ data, width = 300, height = 200 }) => {
  const maxValue = Math.max(...data.map(item => item.present));
  const pointCount = data.length;
  const segmentWidth = width / (pointCount - 1);

  // Generate SVG path for the line
  let pathData = `M 0 ${height - 40 - (data[0].present / maxValue) * (height - 40)}`;

  for (let i = 1; i < pointCount; i++) {
    pathData += ` L ${i * segmentWidth} ${height - 40 - (data[i].present / maxValue) * (height - 40)}`;
  }

  return (
    <div className="chart-container" style={{ width: `${width}px`, height: `${height}px` }}>
      <svg width={width} height={height} className="line-chart">
        <path d={pathData} className="line" />
        {data.map((item, index) => {
          const y = height - 40 - (item.present / maxValue) * (height - 40);
          return (
            <g key={index}>
              <circle
                cx={index * segmentWidth}
                cy={y}
                r="4"
                className="data-point"
              />
              <text
                x={index * segmentWidth}
                y={height - 20}
                className="data-label"
              >
                {item.month}
              </text>
              <text
                x={index * segmentWidth}
                y={y - 10}
                className="data-value"
              >
                {item.present}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Sidebar Navigation Component
const Sidebar = ({ isCollapsed, setIsCollapsed, currentView, setCurrentView }) => {
  const menuItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'Assignment', label: 'Assignments', icon: '📝' },
    { id: 'Performance', label: 'Performance', icon: '📈' },
    { id: 'Material', label: 'Study Materials', icon: '📚' },
    { id: 'Announcement', label: 'Announcements', icon: '📢' },
    { id: 'Profile', label: 'Profile', icon: '👤' },
    
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && <h2>Admin Portal</h2>}
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

// Navbar Component
const Navbar = ({ darkMode, setDarkMode, toggleSidebar }) => {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <button
          onClick={toggleSidebar}
          className="menu-btn"
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <h1>Admin Dashboard</h1>
      </div>

      <div className="navbar-right">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <button className="icon-btn" aria-label="Notifications">
          <span className="badge-container">
            🔔
            <span className="badge">3</span>
          </span>
        </button>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="icon-btn"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        <div className="user-avatar">
          JS
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <Sidebar
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      <div className="main-content">
        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          toggleSidebar={toggleSidebar}
        />

        <main className="dashboard-content">
          {currentView === 'Dashboard' && (
            <div className="dashboard-grid">
              {/* Upcoming Deadlines Card */}
              <Card className="deadlines-card">
                <h3>Upcoming Deadlines</h3>
                <ul className="deadlines-list">
                  {mockData.assignments.slice(0, 4).map(assignment => (
                    <li key={assignment.id} className="deadline-item">
                      <div className="deadline-info">
                        <h4>{assignment.title}</h4>
                        <p>{assignment.subject}</p>
                      </div>
                      <span className="deadline-date">
                        {formatDate(assignment.dueDate)}
                      </span>
                    </li>
                  ))}
                </ul>
                <button className="view-all-btn">
                  View All Assignments
                </button>
              </Card>

              {/* Announcements Card */}
              <Card className="announcements-card">
                <h3>Announcements</h3>
                <div className="announcements-list">
                  {mockData.announcements.map(announcement => (
                    <div key={announcement.id} className="announcement-item">
                      <h4>{announcement.title}</h4>
                      <p>{announcement.description}</p>
                      <span className="announcement-date">{formatDate(announcement.date)}</span>
                    </div>
                  ))}
                </div>
                <button className="view-all-btn">
                  View All Announcements
                </button>
              </Card>

              {/* Quick Links Card */}
              <Card className="links-card">
                <h3>Quick Links</h3>
                <div className="links-grid">
                  <button className="link-btn">
                    <span className="link-icon">📝</span>
                    <span>Assignments</span>
                  </button>
                  <button className="link-btn">
                    <span className="link-icon">📈</span>
                    <span>Performance</span>
                  </button>
                  <button className="link-btn">
                    <span className="link-icon">📚</span>
                    <span>Study Materials</span>
                  </button>
                  <button className="link-btn">
                    <span className="link-icon">📅</span>
                    <span>Schedule</span>
                  </button>
                </div>
              </Card>

              {/* Performance Summary Card */}
              <Card className="performance-card">
                <h3>Performance Summary</h3>
                <div className="chart-wrapper">
                  <BarChart data={mockData.performance} width={300} height={200} />
                </div>
              </Card>

              {/* Attendance Trend Card */}
              <Card className="attendance-card">
                <h3>Attendance Trend</h3>
                <div className="chart-wrapper">
                  <LineChart data={mockData.attendance} width={300} height={200} />
                </div>
              </Card>
            </div>
          )}

          {currentView !== 'Dashboard' && (
            <Card>
              <h2>{currentView} View</h2>



            </Card>
          )}
      
          {currentView === 'Assignment' && <Assignment />}
          {currentView === 'Performance' && <Performance />}
          {currentView === 'Material' && <Material />}
          {currentView === 'Announcement' && <Announcement />}
          {currentView === 'Profile' && <StudentProfile />}
       
        </main>
      </div>

      {/* Mobile overlay when sidebar is open */}
      {mobileSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Dashboard;