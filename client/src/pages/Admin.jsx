import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config.js';

export default function Admin() {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('maddy_token'));
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('maddy_token')}`
  });

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: loginEmail, password: loginPassword })
    })
      .then(res => {
        if (!res.ok) throw new Error('Invalid credentials');
        return res.json();
      })
      .then(data => {
        localStorage.setItem('maddy_token', data.token);
        setIsLoggedIn(true);
        setLoginLoading(false);
      })
      .catch(err => {
        setLoginError(err.message || 'Authentication failed. Access denied.');
        setLoginLoading(false);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('maddy_token');
    setIsLoggedIn(false);
    setProperties([]);
    setLeads([]);
  };
  const [activeTab, setActiveTab] = useState('properties');
  const [properties, setProperties] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loadingProps, setLoadingProps] = useState(true);
  const [loadingLeads, setLoadingLeads] = useState(true);

  // Modal States
  const [showPropModal, setShowPropModal] = useState(false);
  const [editingPropId, setEditingPropId] = useState(null);
  const [propForm, setPropForm] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    type: 'Villa',
    bedrooms: '',
    bathrooms: '',
    area: '',
    images: '',
    features: '',
    status: 'For Sale',
    featured: false
  });

  // Statistics calculation helpers
  const getStats = () => {
    const totalProps = properties.length;
    const totalLeads = leads.length;
    const activeListings = properties.filter(p => p.status === 'For Sale').length;
    const rentalListings = properties.filter(p => p.status === 'For Rent').length;
    
    // Calc estimated portfolio worth
    const portfolioWorth = properties.reduce((acc, p) => acc + Number(p.price), 0);

    return { totalProps, totalLeads, activeListings, rentalListings, portfolioWorth };
  };

  const fetchProperties = () => {
    setLoadingProps(true);
    fetch(`${API_BASE_URL}/properties`)
      .then(res => res.json())
      .then(data => {
        setProperties(data);
        setLoadingProps(false);
      })
      .catch(err => {
        console.error("Error fetching properties for admin:", err);
        setLoadingProps(false);
      });
  };

  const fetchLeads = () => {
    setLoadingLeads(true);
    fetch(`${API_BASE_URL}/leads`, {
      headers: getAuthHeaders()
    })
      .then(res => {
        if (res.status === 401) { handleLogout(); throw new Error('Session expired'); }
        return res.json();
      })
      .then(data => {
        setLeads(data);
        setLoadingLeads(false);
      })
      .catch(err => {
        console.error("Error fetching leads for admin:", err);
        setLoadingLeads(false);
      });
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchProperties();
      fetchLeads();
    }
  }, [isLoggedIn]);

  // --- CRUD ACTIONS ---
  const handlePropFormChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setPropForm(prev => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value
    }));
  };

  const handleOpenCreateModal = () => {
    setEditingPropId(null);
    setPropForm({
      title: '',
      description: '',
      price: '',
      location: '',
      type: 'Villa',
      bedrooms: '',
      bathrooms: '',
      area: '',
      images: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      features: 'Infinity Pool, Ocean View, Smart Home System',
      status: 'For Sale',
      featured: false
    });
    setShowPropModal(true);
  };

  const handleOpenEditModal = (prop) => {
    setEditingPropId(prop._id);
    setPropForm({
      title: prop.title,
      description: prop.description,
      price: prop.price,
      location: prop.location,
      type: prop.type,
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      area: prop.area,
      images: Array.isArray(prop.images) ? prop.images.join(', ') : prop.images,
      features: Array.isArray(prop.features) ? prop.features.join(', ') : prop.features,
      status: prop.status,
      featured: prop.featured || false
    });
    setShowPropModal(true);
  };

  const handlePropSubmit = (e) => {
    e.preventDefault();

    // Clean payload arrays
    const imagesArray = propForm.images.split(',').map(s => s.trim()).filter(Boolean);
    const featuresArray = propForm.features.split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
      ...propForm,
      price: Number(propForm.price),
      bedrooms: Number(propForm.bedrooms),
      bathrooms: Number(propForm.bathrooms),
      area: Number(propForm.area),
      images: imagesArray,
      features: featuresArray
    };

    const url = editingPropId 
      ? `${API_BASE_URL}/properties/${editingPropId}` 
      : `${API_BASE_URL}/properties`;
    const method = editingPropId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        setShowPropModal(false);
        fetchProperties();
      })
      .catch(() => {
        // Local Fallback simulation in offline mode
        const fallbackObj = {
          ...payload,
          _id: editingPropId || `mem_prop_${Date.now()}`,
          createdAt: new Date()
        };

        if (editingPropId) {
          setProperties(prev => prev.map(p => p._id === editingPropId ? fallbackObj : p));
        } else {
          setProperties(prev => [fallbackObj, ...prev]);
        }
        setShowPropModal(false);
      });
  };

  const handlePropDelete = (id) => {
    if (!window.confirm("Are you sure you want to retire this estate listing from the portfolio?")) return;

    fetch(`${API_BASE_URL}/properties/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
      .then(() => {
        fetchProperties();
      })
      .catch(() => {
        // Local Fallback delete
        setProperties(prev => prev.filter(p => p._id !== id));
      });
  };

  const handleLeadStatusChange = (id, newStatus) => {
    fetch(`${API_BASE_URL}/leads/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status: newStatus })
    })
      .then(() => {
        fetchLeads();
      })
      .catch(() => {
        // Local Fallback status toggle
        setLeads(prev => prev.map(l => l._id === id ? { ...l, status: newStatus } : l));
      });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  const stats = getStats();

  if (!isLoggedIn) {
    return (
      <div className="admin-page container animate-fade">
        <div className="admin-login-wrap">
          <div className="admin-login-card glassmorphism">
            <div className="login-header">
              <span className="section-subtitle">Restricted Portal</span>
              <h1 className="page-title" style={{ fontSize: '2.4rem' }}>Executive Access</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '8px' }}>Authenticate with your premium brokerage credentials to access the operational dashboard.</p>
            </div>
            <form onSubmit={handleLogin} style={{ marginTop: '32px' }}>
              {loginError && <div className="error-toast" style={{ marginBottom: '16px', padding: '12px', background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: '4px', color: 'var(--error)', fontSize: '0.85rem' }}>{loginError}</div>}
              <div className="form-group">
                <label>Executive Email</label>
                <input type="email" placeholder="admin@maddyestates.com" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Secure Password</label>
                <input type="password" placeholder="Enter credentials" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
              </div>
              <button type="submit" disabled={loginLoading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
                {loginLoading ? 'Authenticating...' : 'Access Dashboard'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page container animate-fade">
      <div className="admin-header-wrap">
        <div>
          <span className="section-subtitle">Internal Brokerage portal</span>
          <h1 className="page-title">Operational Dashboard</h1>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={handleLogout} className="btn-secondary" style={{ fontSize: '0.7rem', padding: '10px 18px' }}>
            Sign Out
          </button>
          <button onClick={handleOpenCreateModal} className="btn-primary">
            <span>+ Add Luxury Estate</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <section className="stats-grid">
        <div className="stat-card glassmorphism">
          <span className="stat-label">Portfolio Listings</span>
          <span className="stat-val">{stats.totalProps}</span>
          <span className="stat-meta">{stats.activeListings} For Sale | {stats.rentalListings} Rental</span>
        </div>

        <div className="stat-card glassmorphism">
          <span className="stat-label">Inquiry Tickets</span>
          <span className="stat-val">{stats.totalLeads}</span>
          <span className="stat-meta">{leads.filter(l => l.status === 'New').length} Awaiting Consult</span>
        </div>

        <div className="stat-card glassmorphism">
          <span className="stat-label">Portfolio Value</span>
          <span className="stat-val">{formatPrice(stats.portfolioWorth)}</span>
          <span className="stat-meta">Accumulated Luxury Value</span>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="tab-menu glassmorphism">
        <button 
          className={`tab-btn ${activeTab === 'properties' ? 'active' : ''}`}
          onClick={() => setActiveTab('properties')}
        >
          Manage Portfolio ({stats.totalProps})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'leads' ? 'active' : ''}`}
          onClick={() => setActiveTab('leads')}
        >
          Customer Inquiries ({stats.totalLeads})
        </button>
      </div>

      {/* Tab Panels */}
      <div className="admin-table-container glassmorphism">
        {activeTab === 'properties' ? (
          loadingProps ? (
            <p className="table-loader">Loading properties...</p>
          ) : properties.length === 0 ? (
            <p className="table-loader">No active properties inside portfolio. Click "Add Luxury Estate" above.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Property Details</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Featured</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((prop) => (
                  <tr key={prop._id}>
                    <td>
                      <div className="table-prop-info">
                        <img src={Array.isArray(prop.images) ? prop.images[0] : prop.images} alt={prop.title} />
                        <div>
                          <strong>{prop.title}</strong>
                          <span className="sub">{prop.bedrooms} Bed | {prop.bathrooms} Bath | {prop.area} Sq Ft</span>
                        </div>
                      </div>
                    </td>
                    <td>{prop.type}</td>
                    <td>{prop.location}</td>
                    <td><span className="gold-text">{formatPrice(prop.price)}</span></td>
                    <td>{prop.featured ? <span className="tag featured-tag">Yes</span> : 'No'}</td>
                    <td className="actions-cell">
                      <button onClick={() => handleOpenEditModal(prop)} className="action-btn edit-btn">Edit</button>
                      <button onClick={() => handlePropDelete(prop._id)} className="action-btn delete-btn">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : (
          loadingLeads ? (
            <p className="table-loader">Loading inquiries...</p>
          ) : leads.length === 0 ? (
            <p className="table-loader">No client inquiry tickets logged.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Inquiry Target</th>
                  <th>Type</th>
                  <th>Logged Date</th>
                  <th>Status</th>
                  <th>Confidential Message</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead._id}>
                    <td>
                      <div className="lead-client-cell">
                        <strong>{lead.name}</strong>
                        <span className="sub">{lead.email}</span>
                        {lead.phone && <span className="sub">{lead.phone}</span>}
                      </div>
                    </td>
                    <td>
                      <span className="target-prop-tag">{lead.propertyName || 'General Inquiry'}</span>
                    </td>
                    <td><span className="inq-type">{lead.type}</span></td>
                    <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td>
                      <select 
                        value={lead.status} 
                        onChange={(e) => handleLeadStatusChange(lead._id, e.target.value)}
                        className={`status-select ${lead.status.toLowerCase()}`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="msg-cell" title={lead.message}>
                      {lead.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>

      {/* Property Creation/Update Modal */}
      {showPropModal && (
        <div className="modal-backdrop flex-center animate-fade">
          <div className="modal-content glassmorphism">
            <div className="modal-header">
              <h2>{editingPropId ? 'Edit Residential Listing' : 'Introduce New Luxury Residence'}</h2>
              <button className="close-btn" onClick={() => setShowPropModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handlePropSubmit}>
              <div className="form-grid">
                <div className="form-group span-2">
                  <label>Property Title</label>
                  <input 
                    type="text" 
                    name="title" 
                    required 
                    value={propForm.title} 
                    onChange={propFormChange => handlePropFormChange(propFormChange)} 
                  />
                </div>

                <div className="form-group">
                  <label>Acquisition Price ($)</label>
                  <input 
                    type="number" 
                    name="price" 
                    required 
                    value={propForm.price} 
                    onChange={propFormChange => handlePropFormChange(propFormChange)} 
                  />
                </div>

                <div className="form-group">
                  <label>Property Type</label>
                  <select 
                    name="type" 
                    value={propForm.type} 
                    onChange={propFormChange => handlePropFormChange(propFormChange)}
                  >
                    <option value="Villa">Villa</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Mansion">Mansion</option>
                    <option value="Apartment">Apartment</option>
                  </select>
                </div>

                <div className="form-group span-2">
                  <label>Geographic Location</label>
                  <input 
                    type="text" 
                    name="location" 
                    placeholder="E.g. Beverly Hills, California" 
                    required 
                    value={propForm.location} 
                    onChange={propFormChange => handlePropFormChange(propFormChange)} 
                  />
                </div>

                <div className="form-group">
                  <label>Transaction Status</label>
                  <select 
                    name="status" 
                    value={propForm.status} 
                    onChange={propFormChange => handlePropFormChange(propFormChange)}
                  >
                    <option value="For Sale">For Sale</option>
                    <option value="For Rent">For Rent</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Total Bedrooms</label>
                  <input 
                    type="number" 
                    name="bedrooms" 
                    required 
                    value={propForm.bedrooms} 
                    onChange={propFormChange => handlePropFormChange(propFormChange)} 
                  />
                </div>

                <div className="form-group">
                  <label>Total Bathrooms</label>
                  <input 
                    type="number" 
                    step="0.5" 
                    name="bathrooms" 
                    required 
                    value={propForm.bathrooms} 
                    onChange={propFormChange => handlePropFormChange(propFormChange)} 
                  />
                </div>

                <div className="form-group">
                  <label>Total Area (Sq Ft)</label>
                  <input 
                    type="number" 
                    name="area" 
                    required 
                    value={propForm.area} 
                    onChange={propFormChange => handlePropFormChange(propFormChange)} 
                  />
                </div>

                <div className="form-group span-2">
                  <label>Image URLs (Comma separated)</label>
                  <input 
                    type="text" 
                    name="images" 
                    placeholder="http://example.com/img1.jpg, http://example.com/img2.jpg" 
                    required 
                    value={propForm.images} 
                    onChange={propFormChange => handlePropFormChange(propFormChange)} 
                  />
                </div>

                <div className="form-group span-2">
                  <label>Luxury Features & Amenities (Comma separated)</label>
                  <input 
                    type="text" 
                    name="features" 
                    placeholder="Infinity Pool, Yacht Dock, Helipad Access" 
                    value={propForm.features} 
                    onChange={propFormChange => handlePropFormChange(propFormChange)} 
                  />
                </div>

                <div className="form-group span-2 checkbox-group">
                  <input 
                    type="checkbox" 
                    id="featured" 
                    name="featured" 
                    checked={propForm.featured} 
                    onChange={propFormChange => handlePropFormChange(propFormChange)} 
                  />
                  <label htmlFor="featured">Promote as "Featured Listing" on Home Landing Page</label>
                </div>

                <div className="form-group span-2">
                  <label>Detailed Architectural Prospectus Description</label>
                  <textarea 
                    name="description" 
                    rows="4" 
                    required 
                    value={propForm.description} 
                    onChange={propFormChange => handlePropFormChange(propFormChange)} 
                  ></textarea>
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowPropModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">
                  {editingPropId ? 'Confirm Updates' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
