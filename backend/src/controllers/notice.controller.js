const Notice = require('../models/Notice');

exports.createNotice = async (req, res) => {
  const notice = await Notice.create({ ...req.body, publishedBy: req.user._id });
  res.status(201).json({ success: true, data: notice });
};

exports.getNotices = async (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;

  const notices = await Notice.find(filter)
    .populate('publishedBy', 'name')
    .sort({ isPinned: -1, createdAt: -1 })
    .skip((page - 1) * limit).limit(Number(limit));

  res.json({ success: true, data: notices });
};

exports.updateNotice = async (req, res) => {
  const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
  res.json({ success: true, data: notice });
};

exports.deleteNotice = async (req, res) => {
  await Notice.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Notice deleted' });
};
