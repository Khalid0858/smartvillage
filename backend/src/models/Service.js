const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating:    { type: Number, required: true, min: 1, max: 5 },
  comment:   { type: String, maxlength: 500 },
}, { timestamps: true });

const serviceSchema = new mongoose.Schema({
  provider:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:        { type: String, required: true, trim: true },
  category:    { type: String, required: true, enum: ['electrician','plumber','mason','tutor','doctor','carpenter','mechanic','tailor','farmer','other'] },
  description: { type: String, required: true, maxlength: 1000 },
  images:      [{ type: String }],
  phone:       { type: String, required: true },
  address:     { type: String, required: true },
  priceMin:    { type: Number, default: 0 },
  priceMax:    { type: Number, default: 0 },
  priceUnit:   { type: String, default: 'per job' },
  availability:{ type: String, default: 'Mon-Sat, 9am-6pm' },
  reviews:     [reviewSchema],
  avgRating:   { type: Number, default: 0 },
  totalReviews:{ type: Number, default: 0 },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

serviceSchema.index({ category: 1, avgRating: -1 });

module.exports = mongoose.model('Service', serviceSchema);
