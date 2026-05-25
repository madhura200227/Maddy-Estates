import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Add scrolled state for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar glassmorphism ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container nav-container">
        <Link to="/" className="nav-logo">
          Maddy<span>Estates</span>
        </Link>
        
        <ul className={`nav-links ${menuOpen ? 'nav-links-open' : ''}`}>
          <li>
            <Link to="/" className={isActive('/') ? 'active' : ''}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/properties" className={isActive('/properties') ? 'active' : ''}>
              Properties
            </Link>
          </li>
          <li>
            <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>
              Contact
            </Link>
          </li>
          <li>
            <Link to="/admin" className={isActive('/admin') ? 'active-admin' : 'nav-admin'}>
              Admin Portal
            </Link>
          </li>
          {/* Mobile-only CTA inside menu */}
          <li className="nav-cta-mobile">
            <Link to="/contact" className="btn-primary">
              <span>Concierge Inquiry</span>
            </Link>
          </li>
        </ul>

        <div className="nav-cta">
          <Link to="/contact" className="btn-primary">
            <span>Concierge Inquiry</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* Hamburger button for mobile */}
        <button 
          className={`hamburger-btn ${menuOpen ? 'hamburger-open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          id="mobile-menu-toggle"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {/* Mobile overlay */}
      {menuOpen && <div className="nav-overlay" onClick={() => setMenuOpen(false)}></div>}
    </nav>
  );
}
