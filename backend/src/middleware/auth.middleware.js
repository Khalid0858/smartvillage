const admin = require('../config/firebase-admin');
const User  = require('../models/User');

const protect = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authorized — no token' });
  }
  const token = auth.split(' ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const user = await User.findOne({ firebaseUid: decoded.uid });
    if (!user) return res.status(401).json({ success: false, message: 'User not found in database' });
    if (!user.isActive) return res.status(403).json({ success: false, message: 'Account disabled' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: `Access denied for role: ${req.user.role}` });
  }
  next();
};

// Optional auth — attaches user if token present but doesn't fail if not
const optionalAuth = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return next();
  try {
    const decoded = await admin.auth().verifyIdToken(auth.split(' ')[1]);
    req.user = await User.findOne({ firebaseUid: decoded.uid });
  } catch (_) {}
  next();
};

module.exports = { protect, authorize, optionalAuth };
