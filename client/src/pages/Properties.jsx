import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config.js';

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States (initialized from URL search parameters if present)
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [type, setType] = useState(searchParams.get('type') || 'All');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || 'Any');
  const [bathrooms, setBathrooms] = useState(searchParams.get('bathrooms') || 'Any');
  const [sortBy, setSortBy] = useState('newest');

  // Trigger search fetch
  const fetchProperties = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (type !== 'All') params.append('type', type);
    if (status !== 'All') params.append('status', status);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (bedrooms !== 'Any') params.append('bedrooms', bedrooms);
    if (bathrooms !== 'Any') params.append('bathrooms', bathrooms);

    // Sync URL search params
    setSearchParams(params);

    fetch(`${API_BASE_URL}/properties?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        // Sort data locally
        let sortedData = [...data];
        if (sortBy === 'price-asc') {
          sortedData.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-desc') {
          sortedData.sort((a, b) => b.price - a.price);
        } else {
          // default: newest
          sortedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        setProperties(sortedData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching properties:", err);
        // Fail-safe local fallback mock filtering
        // Standard full list
        const fallbackList = [
          {
            _id: "mem_prop_1000",
            title: "The Grand Horizon Villa",
            description: "Contemporary architectural masterpiece in Malibu with 270-degree views...",
            price: 12500000,
            location: "Malibu, California",
            type: "Villa",
            bedrooms: 6,
            bathrooms: 7,
            area: 8200,
            images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80"],
            features: ["Infinity Pool", "Ocean View", "Private Beach Access"],
            status: "For Sale",
            createdAt: new Date()
          },
          {
            _id: "mem_prop_1001",
            title: "Aurelia Penthouse",
            description: "Triplex penthouse on the Manhattan skyline with central park views...",
            price: 8900000,
            location: "Manhattan, New York",
            type: "Penthouse",
            bedrooms: 4,
            bathrooms: 4.5,
            area: 4500,
            images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"],
            features: ["Skyline Views", "Private Elevator"],
            status: "For Sale",
            createdAt: new Date(Date.now() - 24*60*60*1000)
          },
          {
            _id: "mem_prop_1002",
            title: "Crestview Estate",
            description: "Ultra-private gated custom estate in Beverly Hills...",
            price: 16400000,
            location: "Beverly Hills, California",
            type: "Mansion",
            bedrooms: 7,
            bathrooms: 9,
            area: 11500,
            images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"],
            features: ["Home Cinema", "Private Gym"],
            status: "For Sale",
            createdAt: new Date(Date.now() - 2*24*60*60*1000)
          },
          {
            _id: "mem_prop_1003",
            title: "Venezia Waters Manor",
            description: "Waterfront estate in Miami Biscayne bay with private yacht dock...",
            price: 9800000,
            location: "Miami, Florida",
            type: "Mansion",
            bedrooms: 5,
            bathrooms: 6,
            area: 6800,
            images: ["https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80"],
            features: ["Yacht Dock", "Outdoor Kitchen"],
            status: "For Sale",
            createdAt: new Date(Date.now() - 3*24*60*60*1000)
          },
          {
            _id: "mem_prop_1004",
            title: "The Sanctuary Lodge",
            description: "Alpine luxury chalet chalet ski-in ski-out in Aspen mountains...",
            price: 7200000,
            location: "Aspen, Colorado",
            type: "Villa",
            bedrooms: 5,
            bathrooms: 5.5,
            area: 5400,
            images: ["https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80"],
            features: ["Ski-in Ski-out", "Hot Tub"],
            status: "For Rent",
            createdAt: new Date(Date.now() - 4*24*60*60*1000)
          },
          {
            _id: "mem_prop_1005",
            title: "Zenith Oasis",
            description: "Architectural desert oasis powered by solar walls in Scottsdale...",
            price: 5500000,
            location: "Scottsdale, Arizona",
            type: "Villa",
            bedrooms: 4,
            bathrooms: 4.5,
            area: 5200,
            images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"],
            features: ["Solar Powered", "Zen Garden"],
            status: "For Sale",
            createdAt: new Date(Date.now() - 5*24*60*60*1000)
          }
        ];

        // Apply filters in code
        let filtered = fallbackList.filter(p => {
          if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.location.toLowerCase().includes(search.toLowerCase())) return false;
          if (type !== 'All' && p.type !== type) return false;
          if (status !== 'All' && p.status !== status) return false;
          if (minPrice && p.price < Number(minPrice)) return false;
          if (maxPrice && p.price > Number(maxPrice)) return false;
          if (bedrooms !== 'Any') {
            const b = parseInt(bedrooms);
            if (bedrooms.includes('+') ? p.bedrooms < b : p.bedrooms !== b) return false;
          }
          if (bathrooms !== 'Any') {
            const bt = parseFloat(bathrooms);
            if (bathrooms.includes('+') ? p.bathrooms < bt : p.bathrooms !== bt) return false;
          }
          return true;
        });

        // Apply sorting
        if (sortBy === 'price-asc') {
          filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-desc') {
          filtered.sort((a, b) => b.price - a.price);
        } else {
          filtered.sort((a, b) => b.createdAt - a.createdAt);
        }

        setProperties(filtered);
        setLoading(false);
      });
  };

  // Run search when filters submit or sort changes
  useEffect(() => {
    fetchProperties();
  }, [sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setType('All');
    setStatus('All');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('Any');
    setBathrooms('Any');
    setSearchParams(new URLSearchParams());
    // Directly fetch standard list
    setSortBy('newest');
  };

  const handleApply = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="properties-page container animate-fade">
      <div className="page-header-wrap">
        <div>
          <span className="section-subtitle">Maddy Portfolio</span>
          <h1 className="page-title">Luxury Collections</h1>
        </div>
        
        <div className="sort-wrap glassmorphism">
          <label>Sort By:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest Releases</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="properties-content-layout">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar glassmorphism">
          <div className="sidebar-header">
            <h3>Filters</h3>
            <button className="reset-btn" onClick={handleResetFilters}>Reset All</button>
          </div>
          
          <form onSubmit={handleApply}>
            <div className="filter-group">
              <label>Search Keyword</label>
              <input 
                type="text" 
                placeholder="e.g. Malibu, Sunset" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
            </div>

            <div className="filter-group">
              <label>Property Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="All">All Transactions</option>
                <option value="For Sale">For Sale</option>
                <option value="For Rent">For Rent</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Estate Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="All">All Types</option>
                <option value="Villa">Villa</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Mansion">Mansion</option>
              </select>
            </div>

            <div className="filter-group-row">
              <div className="filter-group">
                <label>Min Price</label>
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={minPrice} 
                  onChange={(e) => setMinPrice(e.target.value)} 
                />
              </div>
              <div className="filter-group">
                <label>Max Price</label>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={maxPrice} 
                  onChange={(e) => setMaxPrice(e.target.value)} 
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Bedrooms</label>
              <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}>
                <option value="Any">Any Count</option>
                <option value="4">4 Bedrooms</option>
                <option value="5">5 Bedrooms</option>
                <option value="6">6 Bedrooms</option>
                <option value="7+">7+ Bedrooms</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Bathrooms</label>
              <select value={bathrooms} onChange={(e) => setBathrooms(e.target.value)}>
                <option value="Any">Any Count</option>
                <option value="4">4 Bathrooms</option>
                <option value="5">5 Bathrooms</option>
                <option value="6">6 Bathrooms</option>
                <option value="7+">7+ Bathrooms</option>
              </select>
            </div>

            <button type="submit" className="btn-primary apply-filter-btn">
              Apply Filters
            </button>
          </form>
        </aside>

        {/* Listings Display Grid */}
        <main className="listings-container">
          {loading ? (
            <div className="flex-center catalog-status">
              <p>Curating portfolio...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="flex-center catalog-status empty-catalog glassmorphism">
              <h3>No Properties Match Your Search</h3>
              <p>Please adjust your filters or reset keywords to browse the full Maddy portfolio.</p>
              <button onClick={handleResetFilters} className="btn-primary">Browse All Listings</button>
            </div>
          ) : (
            <>
              <p className="results-count">Showing {properties.length} Exceptional Estates</p>
              <div className="property-grid catalog-grid">
                {properties.map((property) => (
                  <div className="card property-card" key={property._id}>
                    <div className="card-image-wrap">
                      <img src={property.images[0]} alt={property.title} />
                      <span className="price-tag">{formatPrice(property.price)}</span>
                      <span className={`status-badge ${property.status === 'For Rent' ? 'rent' : ''}`}>{property.status}</span>
                    </div>
                    <div className="card-body">
                      <span className="card-type">{property.type}</span>
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
            </>
          )}
        </main>
      </div>
    </div>
  );
}
