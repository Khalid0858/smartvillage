const mongoose = require('mongoose');

const donationEntrySchema = new mongoose.Schema({
  donor:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount:    { type: Number, required: true, min: 1 },
  message:   { type: String, default: '' },
  anonymous: { type: Boolean, default: false },
}, { timestamps: true });

const donationCampaignSchema = new mongoose.Schema({
  title:        { type: String, required: true, trim: true },
  description:  { type: String, required: true },
  category:     { type: String, enum: ['mosque','school','family','infrastructure','health','disaster','other'], default: 'other' },
  goalAmount:   { type: Number, required: true, min: 1 },
  raisedAmount: { type: Number, default: 0 },
  image:        { type: String, default: '' },
  createdBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deadline:     { type: Date, default: null },
  isActive:     { type: Boolean, default: true },
  donations:    [donationEntrySchema],
}, { timestamps: true });

module.exports = mongoose.model('DonationCampaign', donationCampaignSchema);
