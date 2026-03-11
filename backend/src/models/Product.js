const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  seller:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true, trim: true, maxlength: 150 },
  description: { type: String, required: true, maxlength: 1000 },
  category:    { type: String, required: true, enum: ['rice','vegetables','fish','cattle','poultry','fruits','dairy','spices','used_items','other'] },
  price:       { type: Number, required: true, min: 0 },
  unit:        { type: String, default: 'piece' },
  quantity:    { type: Number, default: 1 },
  images:      [{ type: String }],
  location:    { type: String, default: '' },
  contactPhone:{ type: String, default: '' },
  isAvailable: { type: Boolean, default: true },
  isSold:      { type: Boolean, default: false },
  views:       { type: Number, default: 0 },
}, { timestamps: true });

productSchema.index({ category: 1, isAvailable: 1 });
productSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
