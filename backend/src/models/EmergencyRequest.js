const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  requester:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:       { type: String, required: true, enum: ['medical','fire','accident','flood','crime','other'] },
  description:{ type: String, required: true },
  location: {
    address:    { type: String, default: '' },
    coordinates:{ lat: Number, lng: Number },
  },
  status:     { type: String, enum: ['active','responding','resolved','false_alarm'], default: 'active', index: true },
  responders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  resolvedAt: { type: Date, default: null },
  notes:      { type: String, default: '' },
}, { timestamps: true });

emergencySchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('EmergencyRequest', emergencySchema);
