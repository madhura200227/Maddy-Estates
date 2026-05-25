import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config.js';

export default function Home() {
  const navigate = useNavigate();
  const [featuredProps, setFeaturedProps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search filter states
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Testimonials state
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonials = [
    {
      quote: "Maddy Estates redefined what we expected from a brokerage. Their discretion, hyper-curated selections, and absolute dedication to matching our lifestyle requests led us to our dream beachfront villa in Malibu. An unmatched class of service.",
      author: "Lord Alistair Sterling",
      title: "Chairman, Sterling Holdings"
    },
    {
      quote: "The acquisition of the Manhattan Penthouse was handled with the highest level of professionalism and secrecy. Maddy's personal representation and insights on off-market properties were indispensable.",
      author: "Viviene Vance",
      title: "Luxury Fashion Director"
    },
    {
      quote: "A truly elite concierge experience. We purchased our Aspen lodge fully customized and furnished, entirely handled by their master agents. They represent architectural works of art, not just real estate.",
      author: "Dr. Kenji Tanaka",
      title: "Co-Founder, Biotech Ventures"
    }
  ];

  useEffect(() => {
    // Fetch featured properties
    fetch(`${API_BASE_URL}/properties?featured=true`)
      .then(res => res.json())
      .then(data => {
        setFeaturedProps(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching featured properties:", err);
        // Local fallback in case server has not started
        setFeaturedProps([
          {
            _id: "mem_prop_1000",
            title: "The Grand Horizon Villa",
            price: 12500000,
            location: "Malibu, California",
            type: "Villa",
            bedrooms: 6,
            bathrooms: 7,
            area: 8200,
            images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80"],
            status: "For Sale"
          },
          {
            _id: "mem_prop_1001",
            title: "Aurelia Penthouse",
            price: 8900000,
            location: "Manhattan, New York",
            type: "Penthouse",
            bedrooms: 4,
            bathrooms: 4.5,
            area: 4500,
            images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"],
            status: "For Sale"
          },
          {
            _id: "mem_prop_1002",
            title: "Crestview Estate",
            price: 16400000,
            location: "Beverly Hills, California",
            type: "Mansion",
            bedrooms: 7,
            bathrooms: 9,
            area: 11500,
            images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"],
            status: "For Sale"
          }
        ]);
        setLoading(false);
      });
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (type !== 'All') params.append('type', type);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    navigate(`/properties?${params.toString()}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="home-page animate-fade">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-background-img" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=80')` }}></div>
        
        <div className="container hero-content-container">
          <div className="hero-text">
            <span className="hero-tagline">EXCLUSIVELY MADDY ESTATES</span>
            <h1>Architectural Masterpieces.</h1>
            <p>We represent the world’s most refined, luxury residential properties. Discover custom estates curated for the discerning few.</p>
          </div>

          {/* Quick Search Panel */}
          <form className="quick-search-bar glassmorphism" onSubmit={handleSearchSubmit}>
            <div className="search-field">
              <label>Location / Keyword</label>
              <input 
                type="text" 
                placeholder="e.g. Malibu, Penthouse" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
            </div>
            
            <div className="search-field">
              <label>Property Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="All">All Types</option>
                <option value="Villa">Villa</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Mansion">Mansion</option>
              </select>
            </div>

            <div className="search-field">
              <label>Min Price</label>
              <select value={minPrice} onChange={(e) => setMinPrice(e.target.value)}>
                <option value="">No Minimum</option>
                <option value="3000000">$3.0M</option>
                <option value="5000000">$5.0M</option>
                <option value="8000000">$8.0M</option>
                <option value="12000000">$12.0M</option>
              </select>
            </div>

            <div className="search-field">
              <label>Max Price</label>
              <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}>
                <option value="">No Maximum</option>
                <option value="5000000">$5.0M</option>
                <option value="8000000">$8.0M</option>
                <option value="12000000">$12.0M</option>
                <option value="20000000">$20.0M</option>
              </select>
            </div>

            <button type="submit" className="btn-primary search-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span>Explore</span>
            </button>
          </form>
        </div>
      </section>

      {/* Featured Collection Section */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-subtitle">Private Curation</span>
            <h2 className="section-title">Featured Luxury Estates</h2>
          </div>

          {loading ? (
            <div className="flex-center loading-spinner">
              <p>Curating exceptional listings...</p>
            </div>
          ) : (
            <div className="property-grid">
              {featuredProps.slice(0, 3).map((property) => (
                <div className="card property-card" key={property._id}>
                  <div className="card-image-wrap">
                    <img src={property.images[0]} alt={property.title} />
                    <span className="price-tag">{formatPrice(property.price)}</span>
                    <span className="type-badge">{property.type}</span>
                  </div>
                  <div className="card-body">
                    <h3>{property.title}</h3>
                    <p className="card-location">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      {property.location}
                    </p>
                    <div className="property-specs">
                      <span><strong>{property.bedrooms}</strong> Beds</span>
                      <span><strong>{property.bathrooms}</strong> Baths</span>
                      <span><strong>{property.area.toLocaleString()}</strong> Sq Ft</span>
                    </div>
                    <Link to={`/properties/${property._id}`} className="btn-secondary view-details-btn">
                      View Residence
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex-center view-all-wrap">
            <Link to="/properties" className="btn-primary">View Full Portfolio</Link>
          </div>
        </div>
      </section>

      {/* The Maddy Experience (Brand Highlights) */}
      <section className="section experience-section glassmorphic-dark">
        <div className="container experience-grid">
          <div className="experience-text-sec">
            <span className="section-subtitle">Brokerage Redefined</span>
            <h2>The Maddy Estates Experience</h2>
            <p>Our commitment is singular: to provide access to architectural marvels while delivering an ultra-private, fluid advisory experience. We do not just close transactions; we facilitate legacy acquisitions.</p>
            
            <div className="exp-highlights">
              <div className="exp-highlight-item">
                <div className="exp-icon">🔑</div>
                <div>
                  <h4>Off-Market Portfolio</h4>
                  <p>Gain access to our exclusive catalog representing silent and off-market residential acquisitions internationally.</p>
                </div>
              </div>
              
              <div className="exp-highlight-item">
                <div className="exp-icon">👁️</div>
                <div>
                  <h4>Absolute Discretion</h4>
                  <p>We implement rigid security standards protecting our client profiles, property details, and negotiation metrics.</p>
                </div>
              </div>
              
              <div className="exp-highlight-item">
                <div className="exp-icon">💎</div>
                <div>
                  <h4>Global Concierge</h4>
                  <p>From private chartered viewings to custom interior design commissions and staffing transitions, we orchestrate all steps.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="experience-image-sec">
            <div className="exp-image-stack">
              <div className="exp-img-main">
                <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80" alt="Luxury interior detail" />
              </div>
              <div className="exp-img-sub glassmorphism">
                <img src="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=500&q=80" alt="Private concierge lounge" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonial-section">
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-subtitle">Acclaimed Standards</span>
            <h2 className="section-title">Client Appraisals</h2>
          </div>
          
          <div className="testimonial-slider-card glassmorphism">
            <div className="testimonial-quote-icon">“</div>
            <p className="testimonial-quote">
              {testimonials[activeTestimonial].quote}
            </p>
            <div className="testimonial-author-wrap">
              <h4>{testimonials[activeTestimonial].author}</h4>
              <span>{testimonials[activeTestimonial].title}</span>
            </div>
            
            <div className="testimonial-bullets">
              {testimonials.map((_, index) => (
                <button 
                  key={index} 
                  className={`bullet ${index === activeTestimonial ? 'active' : ''}`}
                  onClick={() => setActiveTestimonial(index)}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
