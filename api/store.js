import mongoose from 'mongoose';
import Property from './models/Property.js';
import Lead from './models/Lead.js';
import { defaultProperties } from './seedData.js';

// In-Memory Fallback Arrays
let memProperties = defaultProperties.map((p, i) => ({
  ...p,
  _id: `mem_prop_${1000 + i}`,
  createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000) // spread out dates
}));

let memLeads = [
  {
    _id: "mem_lead_1",
    name: "Eleanor Sterling",
    email: "eleanor.s@luxuryholdings.com",
    phone: "+1 (310) 555-0192",
    message: "I am interested in scheduling a private, high-security viewing of The Grand Horizon Villa next Tuesday. I would appreciate if you could coordinate with my office.",
    propertyId: "mem_prop_1000",
    propertyName: "The Grand Horizon Villa",
    type: "buying",
    status: "New",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    _id: "mem_lead_2",
    name: "Arthur Pendelton",
    email: "arthur.p@wealthcap.co",
    phone: "+1 (212) 555-8833",
    message: "Seeking details regarding the helipad access and rooftop structural specifications for the Aurelia Penthouse. Is it available for long-term rental?",
    propertyId: "mem_prop_1001",
    propertyName: "Aurelia Penthouse",
    type: "renting",
    status: "Contacted",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
];

// Helper to check MongoDB connection status
const isMongoConnected = () => mongoose.connection.readyState === 1;

export const store = {
  // --- PROPERTIES METHODS ---
  async getProperties(query = {}) {
    const { search, type, minPrice, maxPrice, bedrooms, bathrooms, status, featured } = query;

    if (isMongoConnected()) {
      let filter = {};
      
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } }
        ];
      }
      if (type && type !== 'All') filter.type = type;
      if (status && status !== 'All') filter.status = status;
      if (featured !== undefined) filter.featured = featured === 'true' || featured === true;
      
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }
      
      if (bedrooms && bedrooms !== 'Any') {
        const bedsNum = parseInt(bedrooms);
        if (bedrooms.includes('+')) {
          filter.bedrooms = { $gte: bedsNum };
        } else {
          filter.bedrooms = bedsNum;
        }
      }
      
      if (bathrooms && bathrooms !== 'Any') {
        const bathsNum = parseFloat(bathrooms);
        if (bathrooms.includes('+')) {
          filter.bathrooms = { $gte: bathsNum };
        } else {
          filter.bathrooms = bathsNum;
        }
      }

      return await Property.find(filter).sort({ createdAt: -1 });
    } else {
      // Memory Filtering
      let results = [...memProperties];

      if (search) {
        const s = search.toLowerCase();
        results = results.filter(p => 
          p.title.toLowerCase().includes(s) || 
          p.location.toLowerCase().includes(s)
        );
      }

      if (type && type !== 'All') {
        results = results.filter(p => p.type === type);
      }

      if (status && status !== 'All') {
        results = results.filter(p => p.status === status);
      }

      if (featured !== undefined) {
        const f = featured === 'true' || featured === true;
        results = results.filter(p => p.featured === f);
      }

      if (minPrice) {
        results = results.filter(p => p.price >= Number(minPrice));
      }

      if (maxPrice) {
        results = results.filter(p => p.price <= Number(maxPrice));
      }

      if (bedrooms && bedrooms !== 'Any') {
        const bedsNum = parseInt(bedrooms);
        if (bedrooms.toString().includes('+')) {
          results = results.filter(p => p.bedrooms >= bedsNum);
        } else {
          results = results.filter(p => p.bedrooms === bedsNum);
        }
      }

      if (bathrooms && bathrooms !== 'Any') {
        const bathsNum = parseFloat(bathrooms);
        if (bathrooms.toString().includes('+')) {
          results = results.filter(p => p.bathrooms >= bathsNum);
        } else {
          results = results.filter(p => p.bathrooms === bathsNum);
        }
      }

      // Sort by creation date descending
      return results.sort((a, b) => b.createdAt - a.createdAt);
    }
  },

  async getPropertyById(id) {
    if (isMongoConnected()) {
      return await Property.findById(id);
    } else {
      const prop = memProperties.find(p => p._id === id);
      if (!prop) throw new Error("Property not found");
      return prop;
    }
  },

  async createProperty(propertyData) {
    if (isMongoConnected()) {
      const newProp = new Property(propertyData);
      return await newProp.save();
    } else {
      const newProp = {
        ...propertyData,
        _id: `mem_prop_${Date.now()}`,
        createdAt: new Date()
      };
      memProperties.unshift(newProp);
      return newProp;
    }
  },

  async updateProperty(id, propertyData) {
    if (isMongoConnected()) {
      return await Property.findByIdAndUpdate(id, propertyData, { new: true });
    } else {
      const index = memProperties.findIndex(p => p._id === id);
      if (index === -1) throw new Error("Property not found");
      const updated = {
        ...memProperties[index],
        ...propertyData
      };
      memProperties[index] = updated;
      return updated;
    }
  },

  async deleteProperty(id) {
    if (isMongoConnected()) {
      return await Property.findByIdAndDelete(id);
    } else {
      const index = memProperties.findIndex(p => p._id === id);
      if (index === -1) throw new Error("Property not found");
      const deleted = memProperties[index];
      memProperties.splice(index, 1);
      return deleted;
    }
  },

  // --- LEADS METHODS ---
  async getLeads() {
    if (isMongoConnected()) {
      return await Lead.find().sort({ createdAt: -1 }).populate('propertyId');
    } else {
      // Return memory leads, matching property names for reference
      return [...memLeads].sort((a, b) => b.createdAt - a.createdAt);
    }
  },

  async createLead(leadData) {
    if (isMongoConnected()) {
      // Find property title to store as propertyName cache if needed
      if (leadData.propertyId) {
        const prop = await Property.findById(leadData.propertyId);
        if (prop) leadData.propertyName = prop.title;
      }
      const newLead = new Lead(leadData);
      return await newLead.save();
    } else {
      let propertyName = "General Inquiry";
      if (leadData.propertyId) {
        const prop = memProperties.find(p => p._id === leadData.propertyId);
        if (prop) propertyName = prop.title;
      }
      const newLead = {
        ...leadData,
        propertyName,
        _id: `mem_lead_${Date.now()}`,
        createdAt: new Date(),
        status: 'New'
      };
      memLeads.unshift(newLead);
      return newLead;
    }
  },

  async updateLead(id, leadData) {
    if (isMongoConnected()) {
      return await Lead.findByIdAndUpdate(id, leadData, { new: true });
    } else {
      const index = memLeads.findIndex(l => l._id === id);
      if (index === -1) throw new Error("Lead not found");
      const updated = {
        ...memLeads[index],
        ...leadData
      };
      memLeads[index] = updated;
      return updated;
    }
  }
};
