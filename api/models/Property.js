import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true }, // e.g. Villa, Penthouse, Mansion, Apartment
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  area: { type: Number, required: true }, // in sq ft
  images: { type: [String], required: true }, // Array of image URLs
  features: { type: [String], default: [] }, // Array of special amenities
  status: { type: String, default: 'For Sale' }, // For Sale, For Rent, Sold
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Property = mongoose.model('Property', propertySchema);
export default Property;
