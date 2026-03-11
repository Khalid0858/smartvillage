const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxlength: 500 },
  likes:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  author:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:    { type: String, required: true, maxlength: 200 },
  content:  { type: String, required: true, maxlength: 2000 },
  category: { type: String, enum: ['general','agriculture','health','education','infrastructure','religion','entertainment','other'], default: 'general' },
  images:   [{ type: String }],
  likes:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  views:    { type: Number, default: 0 },
  isPinned: { type: Boolean, default: false },
}, { timestamps: true });

postSchema.index({ category: 1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
