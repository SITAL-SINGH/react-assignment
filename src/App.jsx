import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LogIn from './Pages/LogIn/LogIn';
import Dashboard from './Pages/Dashboard/Dashboard';
import './App.css';

// Create authentication context
export const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock user database
  const users = [
    {
      email: "student@edu.np",
      password: "123456",
      name: "Raj Sharma",
      course: "Computer Science",
      year: "3",
      studentId: "STU-2023001",
      profilePicture: null
    },
    {
      email: "john@edu.np",
      password: "123456",
      name: "John Doe",
      course: "Business Administration",
      year: "2",
      studentId: "STU-2023002",
      profilePicture: null
    }
  ];

  const login = (email, password) => {
    // Find user in mock database
    const userFound = users.find(user => 
      user.email === email && user.password === password
    );
    
    if (userFound) {
      // Create a copy without the password
      const { password, ...userWithoutPassword } = userFound;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      <Router>
        <div className="app">
          <Routes>
            <Route 
              path="/" 
              element={
                isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <LogIn />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                isAuthenticated ? 
                <Dashboard /> : 
                <Navigate to="/" replace />
              } 
            />
            {/* Add more routes here for future pages */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;