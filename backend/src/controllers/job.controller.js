const Job = require('../models/Job');

exports.createJob = async (req, res) => {
  const job = await Job.create({ ...req.body, postedBy: req.user._id });
  res.status(201).json({ success: true, data: job });
};

exports.getJobs = async (req, res) => {
  const { category, isOpen, page = 1, limit = 12 } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (isOpen !== undefined) filter.isOpen = isOpen === 'true';

  const [jobs, total] = await Promise.all([
    Job.find(filter).populate('postedBy', 'name avatar').sort('-createdAt').skip((page-1)*limit).limit(Number(limit)),
    Job.countDocuments(filter),
  ]);
  res.json({ success: true, data: jobs, pagination: { total, page: Number(page), pages: Math.ceil(total/limit) } });
};

exports.getJob = async (req, res) => {
  const job = await Job.findById(req.params.id).populate('postedBy', 'name avatar phone').populate('applicants', 'name avatar');
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
  res.json({ success: true, data: job });
};

exports.applyJob = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
  if (!job.isOpen) return res.status(400).json({ success: false, message: 'Job is closed' });

  if (job.applicants.includes(req.user._id)) {
    return res.status(400).json({ success: false, message: 'Already applied' });
  }
  job.applicants.push(req.user._id);
  await job.save();
  res.json({ success: true, message: 'Applied successfully' });
};

exports.closeJob = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ success: false, message: 'Not found' });
  if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }
  job.isOpen = false;
  await job.save();
  res.json({ success: true, data: job });
};

exports.getMyJobs = async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user._id }).sort('-createdAt');
  res.json({ success: true, data: jobs });
};
