// Navbar.jsx
import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import './Nav.css';

const Nav = ({
    logo = "Student Management System",
    links = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Assignments", path: "/assignments" },
        { name: "Performance", path: "/performance" },
        { name: "Study Materials", path: "/materials" },
        { name: "Announcements", path: "/announcements" },
        { name: "Profile", path: "/profile" }
    ]
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        // Handle click outside to close profile dropdown
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        // Apply dark mode class to body
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [isDarkMode]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                {/* Logo */}
                <div className="nav-logo">
                    {logo}
                </div>

                {/* Desktop Navigation */}
                <div className="nav-links">
                    {links.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            className={({ isActive }) =>
                                `nav-link ${isActive ? 'nav-link-active' : ''}`
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </div>

                {/* Right section */}
                <div className="nav-right">
                    {/* Search Bar */}
                    <div className="nav-search">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="search-input"
                        />
                    </div>

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="dark-toggle"
                        aria-label="Toggle dark mode"
                    >
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>

                    {/* Profile Dropdown */}
                    <div className="profile-container" ref={profileRef}>
                        <button
                            onClick={toggleProfile}
                            className="profile-btn"
                            aria-label="User menu"
                        >
                            <div className="profile-avatar">JS</div>
                        </button>

                        {isProfileOpen && (
                            <div className="profile-dropdown">
                                <button className="dropdown-item">Profile</button>
                                <button className="dropdown-item">Settings</button>
                                <button className="dropdown-item">Logout</button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={toggleMenu}
                        className="mobile-toggle"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className={`mobile-menu ${isMenuOpen ? 'mobile-menu-open' : ''}`}>
                <div className="mobile-links">
                    {links.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            className={({ isActive }) =>
                                `mobile-link ${isActive ? 'mobile-link-active' : ''}`
                            }
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Nav;