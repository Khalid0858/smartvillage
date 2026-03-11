const User = require('../models/User');
const Problem = require('../models/Problem');
const Product = require('../models/Product');
const Service = require('../models/Service');
const Job = require('../models/Job');
const Post = require('../models/Post');
const DonationCampaign = require('../models/Donation');
const EmergencyRequest = require('../models/EmergencyRequest');

exports.getStats = async (req, res) => {
  const [users, problems, products, services, jobs, posts, campaigns, emergencies] = await Promise.all([
    User.countDocuments(),
    Problem.countDocuments(),
    Product.countDocuments({ isAvailable: true }),
    Service.countDocuments({ isActive: true }),
    Job.countDocuments({ isOpen: true }),
    Post.countDocuments(),
    DonationCampaign.aggregate([{ $group: { _id: null, total: { $sum: '$raisedAmount' } } }]),
    EmergencyRequest.countDocuments({ status: 'active' }),
  ]);

  const problemsByStatus = await Problem.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
  const problemsByCategory = await Problem.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);

  // New users last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentUsers = await User.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    { $group: { _id: { $dateToString: { format: '%m/%d', date: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    success: true,
    data: {
      users, problems, products, services, jobs, posts, emergencies,
      totalDonated: campaigns[0]?.total || 0,
      problemsByStatus, problemsByCategory, recentUsers,
    },
  });
};

exports.getUsers = async (req, res) => {
  const { role, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (role) filter.role = role;

  const [users, total] = await Promise.all([
    User.find(filter).select('-fcmTokens').sort('-createdAt').skip((page-1)*limit).limit(Number(limit)),
    User.countDocuments(filter),
  ]);
  res.json({ success: true, data: users, pagination: { total, page: Number(page), pages: Math.ceil(total/limit) } });
};

exports.updateUserRole = async (req, res) => {
  const { role } = req.body;
  const validRoles = ['user', 'admin', 'service_provider', 'volunteer'];
  if (!validRoles.includes(role)) return res.status(400).json({ success: false, message: 'Invalid role' });
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  res.json({ success: true, data: user });
};

exports.toggleUserActive = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  user.isActive = !user.isActive;
  await user.save();
  res.json({ success: true, isActive: user.isActive });
};
