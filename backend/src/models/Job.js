const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  postedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category:    { type: String, required: true, enum: ['farming','construction','shop_helper','driver','domestic','part_time','skilled','teaching','other'] },
  salaryAmount:{ type: Number, default: 0 },
  salaryPeriod:{ type: String, default: 'per day' },
  isNegotiable:{ type: Boolean, default: false },
  location:    { type: String, required: true },
  requirements:{ type: String, default: '' },
  deadline:    { type: Date, default: null },
  isOpen:      { type: Boolean, default: true },
  applicants:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
