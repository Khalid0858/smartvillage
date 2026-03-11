const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text:    { type: String, required: true, maxlength: 500 },
}, { timestamps: true });

const problemSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true, maxlength: 150 },
  description: { type: String, required: true, maxlength: 1000 },
  category:    { type: String, required: true, enum: ['road', 'water', 'electricity', 'drainage', 'garbage', 'other'] },
  images:      [{ type: String }],
  location: {
    address:     { type: String, default: '' },
    coordinates: { lat: Number, lng: Number },
  },
  status:      { type: String, enum: ['pending', 'under_review', 'in_progress', 'solved'], default: 'pending', index: true },
  priority:    { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  reportedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  upvotes:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments:    [commentSchema],
  resolvedAt:  { type: Date, default: null },
  adminNote:   { type: String, default: '' },
}, { timestamps: true });

problemSchema.index({ category: 1, status: 1 });
problemSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Problem', problemSchema);
