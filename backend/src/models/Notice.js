const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  content:     { type: String, required: true },
  category:    { type: String, enum: ['mosque', 'school', 'event', 'meeting', 'health', 'general'], default: 'general' },
  image:       { type: String, default: '' },
  isPinned:    { type: Boolean, default: false },
  isActive:    { type: Boolean, default: true },
  publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expiresAt:   { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
