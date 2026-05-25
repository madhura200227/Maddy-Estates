import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  message: { type: String, required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', default: null },
  propertyName: { type: String }, // cached for offline fallback compatibility
  type: { type: String, default: 'general' }, // e.g. buying, selling, renting, general
  status: { type: String, default: 'New' }, // e.g. New, Contacted, Closed
  createdAt: { type: Date, default: Date.now }
});

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
