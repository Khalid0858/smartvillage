const EmergencyRequest = require('../models/EmergencyRequest');
const User = require('../models/User');

exports.createEmergency = async (req, res) => {
  const emergency = await EmergencyRequest.create({ ...req.body, requester: req.user._id });

  // Try to notify volunteers via FCM (non-blocking)
  try {
    const admin = require('../config/firebase-admin');
    const volunteers = await User.find({ role: { $in: ['volunteer', 'admin'] }, isActive: true });
    const tokens = volunteers.flatMap(v => v.fcmTokens).filter(Boolean);
    if (tokens.length > 0) {
      await admin.messaging().sendEachForMulticast({
        tokens,
        notification: {
          title: `🚨 EMERGENCY: ${req.body.type?.toUpperCase()}`,
          body:  `${req.body.description} — ${req.body.location?.address || 'Location shared'}`,
        },
        data: { emergencyId: emergency._id.toString(), type: 'emergency' },
      });
    }
  } catch (err) {
    console.log('FCM notification failed (non-critical):', err.message);
  }

  res.status(201).json({ success: true, data: emergency });
};

exports.getEmergencies = async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const emergencies = await EmergencyRequest.find(filter)
    .populate('requester', 'name avatar phone')
    .populate('responders', 'name avatar')
    .sort('-createdAt').skip((page-1)*limit).limit(Number(limit));

  res.json({ success: true, data: emergencies });
};

exports.respondEmergency = async (req, res) => {
  const emergency = await EmergencyRequest.findById(req.params.id);
  if (!emergency) return res.status(404).json({ success: false, message: 'Not found' });

  if (!emergency.responders.includes(req.user._id)) {
    emergency.responders.push(req.user._id);
  }
  emergency.status = 'responding';
  await emergency.save();
  res.json({ success: true, data: emergency });
};

exports.resolveEmergency = async (req, res) => {
  const emergency = await EmergencyRequest.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status || 'resolved', resolvedAt: new Date(), notes: req.body.notes || '' },
    { new: true }
  );
  if (!emergency) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: emergency });
};
