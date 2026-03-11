const User = require('../models/User');

// POST /api/auth/register  — called after Firebase signup
exports.register = async (req, res) => {
  const { firebaseUid, name, email, phone, village, district } = req.body;
  if (!firebaseUid || !name || !email) {
    return res.status(400).json({ success: false, message: 'firebaseUid, name, email required' });
  }
  const existing = await User.findOne({ firebaseUid });
  if (existing) return res.json({ success: true, data: existing });

  const user = await User.create({
    firebaseUid, name, email, phone,
    address: { village: village || '', district: district || '' },
  });
  res.status(201).json({ success: true, data: user });
};

// POST /api/auth/me  — get or create current user
exports.getMe = async (req, res) => {
  // req.user set by protect middleware
  await User.findByIdAndUpdate(req.user._id, { lastSeen: new Date() });
  res.json({ success: true, data: req.user });
};

// PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  const { name, phone, bio, avatar, address } = req.body;
  const updates = {};
  if (name)    updates.name = name;
  if (phone)   updates.phone = phone;
  if (bio)     updates.bio = bio;
  if (avatar)  updates.avatar = avatar;
  if (address) updates.address = { ...req.user.address.toObject?.() || {}, ...address };

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
  res.json({ success: true, data: user });
};

// PUT /api/auth/fcm-token
exports.updateFcmToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ success: false, message: 'Token required' });
  await User.findByIdAndUpdate(req.user._id, { $addToSet: { fcmTokens: token } });
  res.json({ success: true });
};
