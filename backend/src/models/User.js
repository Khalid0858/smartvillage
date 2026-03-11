const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid:  { type: String, required: true, unique: true, index: true },
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:        { type: String, trim: true },
  avatar:       { type: String, default: '' },
  role:         { type: String, enum: ['user', 'admin', 'service_provider', 'volunteer'], default: 'user' },
  address: {
    village:     { type: String, default: '' },
    union:       { type: String, default: '' },
    district:    { type: String, default: '' },
    coordinates: { lat: { type: Number }, lng: { type: Number } },
  },
  bio:          { type: String, default: '', maxlength: 300 },
  isActive:     { type: Boolean, default: true },
  isVerified:   { type: Boolean, default: false },
  fcmTokens:    [{ type: String }],
  lastSeen:     { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
