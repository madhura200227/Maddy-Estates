import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand-sec">
          <Link to="/" className="footer-logo">
            Maddy<span>Estates</span>
          </Link>
          <p className="footer-desc">
            Representing the world's most exceptional architectural masterpieces. From breathtaking oceanfront estates in Malibu to custom high-rise penthouses in New York, we offer unparalleled brokerage services for ultra-high-net-worth clients.
          </p>
          <div className="social-links">
            <a href="#" className="social-icon">IN</a>
            <a href="#" className="social-icon">FB</a>
            <a href="#" className="social-icon">YT</a>
            <a href="#" className="social-icon">LI</a>
          </div>
        </div>

        <div className="footer-links-sec">
          <h3>Explore</h3>
          <ul>
            <li><Link to="/">Home Listing</Link></li>
            <li><Link to="/properties">Luxury Collection</Link></li>
            <li><Link to="/contact">Brokerage Inquiries</Link></li>
            <li><Link to="/admin">Admin Dashboard</Link></li>
          </ul>
        </div>

        <div className="footer-contact-sec">
          <h3>Brokerage</h3>
          <p>📍 800 Ocean Front Drive,<br />Malibu, CA 90265</p>
          <p>📞 +1 (310) 555-MADDY</p>
          <p>✉️ concierge@maddyestates.com</p>
        </div>

        <div className="footer-news-sec">
          <h3>The Portfolio</h3>
          <p>Subscribe to our exclusive quarterly catalog of private off-market listings.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your premium email" required />
            <button type="submit" className="btn-primary">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-flex">
          <p>&copy; {new Date().getFullYear()} Maddy Estates. All luxury rights reserved.</p>
          <p>Designed for the Elite | Privacy Policy | Terms of Brokerage</p>
        </div>
      </div>
    </footer>
  );
}
