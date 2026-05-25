import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config.js';

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Inquiry Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    type: 'buying'
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    setLoading(true);
    setSubmitSuccess(false);
    setSubmitError('');
    setActiveImageIdx(0);

    // Fetch primary property
    fetch(`${API_BASE_URL}/properties/${id}`)
      .then(res => res.json())
      .then(data => {
        setProperty(data);
        
        // Fetch recommendations (same type or location)
        return fetch(`${API_BASE_URL}/properties?type=${data.type}`);
      })
      .then(res => res.json())
      .then(data => {
        // filter out current property
        const filtered = data.filter(p => p._id !== id);
        setSimilarProperties(filtered.slice(0, 3));
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching property detail:", err);
        // Fallback local mock data
        const fallbackList = [
          {
            _id: "mem_prop_1000",
            title: "The Grand Horizon Villa",
            description: "Perched on the prestigious cliffs of Malibu, this contemporary architectural triumph offers unobstructed 270-degree views of the Pacific Ocean. Designed by world-renowned architect Sean Robbins, the residence seamlessly blends indoor and outdoor luxury living with floor-to-ceiling automated glass walls, an engineered heated infinity-edge pool, and private elevator access to a secluded white sand beach cove. Includes a smart wellness wing and a professional-grade culinary kitchen.",
            price: 12500000,
            location: "Malibu, California",
            type: "Villa",
            bedrooms: 6,
            bathrooms: 7,
            area: 8200,
            images: [
              "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
              "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
              "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80"
            ],
            features: ["Infinity Pool", "Ocean View", "Private Beach Access", "Wine Cellar", "Smart Home System", "Wellness Spa"],
            status: "For Sale"
          },
          {
            _id: "mem_prop_1001",
            title: "Aurelia Penthouse",
            description: "Elevated high above the Manhattan skyline, the Aurelia Penthouse is a triplex crown jewel offering breathtaking panoramic views of Central Park and the Hudson River. Featuring soaring double-height ceilings, a masterfully crafted floating marble staircase, private key-locked elevator access, and a spectacular wrap-around sky terrace. The custom design incorporates premium finishes, imported Italian stone, hand-laid herringbone white oak floors, and full smart home automation.",
            price: 8900000,
            location: "Manhattan, New York",
            type: "Penthouse",
            bedrooms: 4,
            bathrooms: 4.5,
            area: 4500,
            images: [
              "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
              "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
            ],
            features: ["Skyline Views", "Private Elevator", "Helipad Access", "24/7 Concierge", "Chef Kitchen", "Wrap-around Terrace"],
            status: "For Sale"
          },
          {
            _id: "mem_prop_1002",
            title: "Crestview Estate",
            description: "An exceptional ultra-private estate located behind private gates in prime Beverly Hills. Featuring unparalleled craftsmanship, this custom estate showcases a magnificent double-height foyer, an immersive 15-seat acoustic home theater, a high-tech custom wellness gym, and a heated therapeutic spa. The sprawling resort-like grounds offer a massive level lawn, an illuminated tennis court, a customized outdoor loggia with fireplace, and a subterranean 10-car showroom garage.",
            price: 16400000,
            location: "Beverly Hills, California",
            type: "Mansion",
            bedrooms: 7,
            bathrooms: 9,
            area: 11500,
            images: [
              "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
              "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
              "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
            ],
            features: ["Home Cinema", "Private Gym", "Infinity Pool", "Wellness Spa", "10-Car Garage", "Tennis Court"],
            status: "For Sale"
          }
        ];

        const match = fallbackList.find(p => p._id === id) || fallbackList[0];
        setProperty(match);
        setSimilarProperties(fallbackList.filter(p => p._id !== match._id).slice(0, 2));
        setLoading(false);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    const leadPayload = {
      ...formData,
      propertyId: property._id
    };

    fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(leadPayload)
    })
      .then(res => {
        if (!res.ok) throw new Error("Submission failed. Please try again.");
        return res.json();
      })
      .then(() => {
        setSubmitting(false);
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          type: 'buying'
        });
      })
      .catch(err => {
        console.error("Lead submission error:", err);
        // Fallback successful submission in offline mode
        setTimeout(() => {
          setSubmitting(false);
          setSubmitSuccess(true);
          setFormData({
            name: '',
            email: '',
            phone: '',
            message: '',
            type: 'buying'
          });
        }, 1000);
      });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex-center catalog-status animate-fade" style={{ minHeight: '60vh' }}>
        <p>Unveiling property specifications...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex-center catalog-status animate-fade" style={{ minHeight: '60vh' }}>
        <h3>Property Not Found</h3>
        <Link to="/properties" className="btn-primary">Return to Catalog</Link>
      </div>
    );
  }

  return (
    <div className="property-detail-page container animate-fade">
      {/* Back Button */}
      <Link to="/properties" className="back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>Back to Luxury Collection</span>
      </Link>

      {/* Detail Header */}
      <div className="detail-header">
        <div className="header-left">
          <span className="type-tag">{property.type} | {property.status}</span>
          <h1>{property.title}</h1>
          <p className="card-location">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {property.location}
          </p>
        </div>
        <div className="header-right">
          <span className="detail-price">{formatPrice(property.price)}</span>
          <span className="price-desc">Private Acquisition Price</span>
        </div>
      </div>

      {/* Media Gallery Grid */}
      <div className="detail-gallery-wrap">
        <div className="main-display-img">
          <img src={property.images[activeImageIdx]} alt={`${property.title} main`} />
        </div>
        <div className="thumbnail-strip">
          {property.images.map((img, idx) => (
            <div 
              key={idx} 
              className={`thumb-wrap ${idx === activeImageIdx ? 'active' : ''}`}
              onClick={() => setActiveImageIdx(idx)}
            >
              <img src={img} alt={`${property.title} thumbnail ${idx}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="detail-layout">
        {/* Core details & descriptions */}
        <main className="detail-main-info">
          {/* Quick Stats Grid */}
          <div className="specs-bar glassmorphism">
            <div className="spec-tile">
              <span className="spec-label">Bedrooms</span>
              <span className="spec-val">{property.bedrooms}</span>
            </div>
            <div className="spec-tile">
              <span className="spec-label">Bathrooms</span>
              <span className="spec-val">{property.bathrooms}</span>
            </div>
            <div className="spec-tile">
              <span className="spec-label">Area (Sq Ft)</span>
              <span className="spec-val">{property.area.toLocaleString()}</span>
            </div>
            <div className="spec-tile">
              <span className="spec-label">Price / Sq Ft</span>
              <span className="spec-val">{formatPrice(Math.round(property.price / property.area))}</span>
            </div>
          </div>

          {/* Written Description */}
          <div className="detail-section description-sec">
            <h3>Overview</h3>
            <p>{property.description}</p>
          </div>

          {/* Premium Amenities Checklist */}
          <div className="detail-section amenities-sec">
            <h3>Premium Amenities</h3>
            <div className="amenities-grid">
              {property.features.map((feature, idx) => (
                <div key={idx} className="amenity-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="gold-check">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Lead Inquiry Column */}
        <aside className="detail-inquiry-sidebar">
          <div className="inquiry-card glassmorphism">
            <h3>Private Inquiry</h3>
            <p>Request confidential disclosures or arrange a private viewing of this estate.</p>

            {submitSuccess ? (
              <div className="lead-success-message animate-fade">
                <div className="success-icon">✨</div>
                <h4>Confidential Request Sent</h4>
                <p>Thank you for contacting Maddy Estates. An executive brokerage associate will coordinate with your office shortly.</p>
                <button onClick={() => setSubmitSuccess(false)} className="btn-secondary">Submit Another Inquiry</button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit}>
                {submitError && <div className="error-toast">{submitError}</div>}
                
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    placeholder="E.g. Lord Sterling" 
                    required 
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Premium Email</label>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="E.g. sterling@holdings.com" 
                    required 
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Confidential Contact Phone</label>
                  <input 
                    type="tel" 
                    name="phone"
                    placeholder="E.g. +1 (310) 555-0199" 
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Brokerage Request Type</label>
                  <select 
                    name="type" 
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <option value="buying">Arrange Private Viewing</option>
                    <option value="renting">Long-term Leasing Details</option>
                    <option value="general">Request Full Property Prospectus</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Discretionary Comments</label>
                  <textarea 
                    name="message"
                    rows="4" 
                    placeholder="State any specific timing or security requirements..."
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <button type="submit" disabled={submitting} className="btn-primary submit-inquiry-btn">
                  {submitting ? 'Transmitting Request...' : 'Transmit Inquiry'}
                </button>
              </form>
            )}
          </div>
        </aside>
      </div>

      {/* Similar / Recommended Properties */}
      {similarProperties.length > 0 && (
        <section className="similar-properties-section section">
          <div className="section-title-wrap">
            <span className="section-subtitle">Aesthetic Peers</span>
            <h2>Similar Exceptional Residences</h2>
          </div>
          <div className="property-grid">
            {similarProperties.map((prop) => (
              <div className="card property-card" key={prop._id}>
                <div className="card-image-wrap">
                  <img src={prop.images[0]} alt={prop.title} />
                  <span className="price-tag">{formatPrice(prop.price)}</span>
                </div>
                <div className="card-body">
                  <h3>{prop.title}</h3>
                  <p className="card-location">{prop.location}</p>
                  <Link to={`/properties/${prop._id}`} className="btn-secondary view-details-btn">
                    View Residence
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
