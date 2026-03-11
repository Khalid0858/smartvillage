const Service = require('../models/Service');

exports.createService = async (req, res) => {
  const existing = await Service.findOne({ provider: req.user._id });
  if (existing) return res.status(400).json({ success: false, message: 'You already have a service listing. Update it instead.' });
  const service = await Service.create({ ...req.body, provider: req.user._id });
  res.status(201).json({ success: true, data: service });
};

exports.getServices = async (req, res) => {
  const { category, page = 1, limit = 12 } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;

  const [services, total] = await Promise.all([
    Service.find(filter).populate('provider', 'name avatar').sort('-avgRating').skip((page-1)*limit).limit(Number(limit)),
    Service.countDocuments(filter),
  ]);
  res.json({ success: true, data: services, pagination: { total, page: Number(page), pages: Math.ceil(total/limit) } });
};

exports.getService = async (req, res) => {
  const service = await Service.findById(req.params.id).populate('provider', 'name avatar phone').populate('reviews.user', 'name avatar');
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
  res.json({ success: true, data: service });
};

exports.updateService = async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ success: false, message: 'Not found' });
  if (service.provider.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }
  const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, data: updated });
};

exports.addReview = async (req, res) => {
  const { rating, comment } = req.body;
  if (!rating || rating < 1 || rating > 5) return res.status(400).json({ success: false, message: 'Rating 1-5 required' });

  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ success: false, message: 'Not found' });

  // Remove old review by this user
  service.reviews = service.reviews.filter(r => r.user.toString() !== req.user._id.toString());
  service.reviews.push({ user: req.user._id, rating, comment });

  const total = service.reviews.reduce((sum, r) => sum + r.rating, 0);
  service.avgRating   = Math.round((total / service.reviews.length) * 10) / 10;
  service.totalReviews= service.reviews.length;

  await service.save();
  res.json({ success: true, avgRating: service.avgRating, totalReviews: service.totalReviews });
};

exports.getMyService = async (req, res) => {
  const service = await Service.findOne({ provider: req.user._id });
  res.json({ success: true, data: service });
};
