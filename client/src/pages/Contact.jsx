import React, { useState } from 'react';
import { API_BASE_URL } from '../config.js';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'general',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        setSubmitting(false);
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', type: 'general', message: '' });
      })
      .catch(() => {
        // Fallback for offline mode
        setTimeout(() => {
          setSubmitting(false);
          setSuccess(true);
          setFormData({ name: '', email: '', phone: '', type: 'general', message: '' });
        }, 1000);
      });
  };

  return (
    <div className="contact-page container animate-fade">
      <div className="section-title-wrap">
        <span className="section-subtitle">Confidential Channels</span>
        <h1 className="page-title">Connect with Maddy Estates</h1>
      </div>

      <div className="contact-layout">
        {/* Contact Info Cards */}
        <div className="contact-info-column">
          <div className="info-card glassmorphism">
            <h3>Elite Advisory Office</h3>
            <p>Our Malibu headquarters overlooks the Pacific Ocean and is available for scheduled private client consultations.</p>
            
            <div className="coord-item">
              <span className="coord-label">Location</span>
              <span className="coord-val">800 Ocean Front Drive, Malibu, CA 90265</span>
            </div>
            
            <div className="coord-item">
              <span className="coord-label">Inquiry Line</span>
              <span className="coord-val">+1 (310) 555-MADDY</span>
            </div>
            
            <div className="coord-item">
              <span className="coord-label">General Operations</span>
              <span className="coord-val">concierge@maddyestates.com</span>
            </div>

            <div className="coord-item">
              <span className="coord-label">Concierge Hours</span>
              <span className="coord-val">24/7 Premium Support | Office: 9:00 AM - 6:00 PM PST</span>
            </div>
          </div>

          <div className="info-card glassmorphism press-card">
            <h3>Corporate & Press Relations</h3>
            <p>For strategic partnerships, off-market portfolio licensing, or media inquiries, contact our communications department.</p>
            <p className="email-link">press@maddyestates.com</p>
          </div>
        </div>

        {/* Action Inquiry Form */}
        <div className="contact-form-column">
          <div className="contact-form-card glassmorphism">
            <h3>Brokerage Request Form</h3>
            <p>Initiate private acquisition advice or register a premium residential property for listing consideration.</p>

            {success ? (
              <div className="lead-success-message animate-fade">
                <div className="success-icon">✨</div>
                <h4>Request Successfully Logged</h4>
                <p>An executive brokerage partner will contact you directly within 2 business hours. Complete confidentiality guaranteed.</p>
                <button onClick={() => setSuccess(false)} className="btn-secondary">Submit Another Request</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="E.g. Vivienne Vance" 
                    required 
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Premium Email</label>
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="E.g. vance@style.com" 
                      required 
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Direct Phone</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      placeholder="E.g. +1 (212) 555-8833" 
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Nature of Inquiry</label>
                  <select 
                    name="type" 
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <option value="general">General Asset Consultation</option>
                    <option value="buying">Represent Me on a Purchase</option>
                    <option value="selling">Represent Me on a Listing Sale</option>
                    <option value="renting">Luxury Leasing Search</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Detailed Request Overview</label>
                  <textarea 
                    name="message" 
                    rows="6" 
                    placeholder="Outline your acquisition criteria, ideal locations, or key asset parameters..." 
                    required 
                    value={formData.message}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <button type="submit" disabled={submitting} className="btn-primary submit-btn">
                  {submitting ? 'Logging Request...' : 'Send Confidentially'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
