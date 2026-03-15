import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
    const [activeSection, setActiveSection] = useState('home');
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            if (location.pathname !== '/') {
                setActiveSection('');
                return;
            }

            const sections = ['home', 'features', 'about', 'contact'];
            let current = '';

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // If the top of the section is within the top half of the viewport (or slightly adjusted)
                    if (rect.top <= 150 && rect.bottom >= 150) {
                        current = section;
                    }
                }
            }
            if (current) {
                setActiveSection(current);
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Trigger once on mount/location change
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [location]);

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <div className="logo">
                    <Link to="/" className={activeSection === 'home' ? 'active' : ''}>Triplens</Link>
                </div>
                <ul className="nav-links">
                    <li><a href="/#features" className={activeSection === 'features' ? 'active' : ''}>Features</a></li>
                    <li><a href="/#about" className={activeSection === 'about' ? 'active' : ''}>About</a></li>
                    <li><a href="/#contact" className={activeSection === 'contact' ? 'active' : ''}>Contact</a></li>
                </ul>
                <div className="nav-actions">
                    {user ? (
                        <div className="user-info">
                            <span className="user-name">Welcome, {user.userName}</span>
                            <Link to="/profile" className="btn btn-sm btn-light" style={{ marginRight: '10px' }}>Profile</Link>
                            <button onClick={onLogout} className="btn btn-outline">Logout</button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline">Login</Link>
                            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
