const Problem = require('../models/Problem');

exports.createProblem = async (req, res) => {
  const problem = await Problem.create({ ...req.body, reportedBy: req.user._id });
  res.status(201).json({ success: true, data: problem });
};

exports.getProblems = async (req, res) => {
  const { category, status, priority, page = 1, limit = 12, sort = '-createdAt' } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (status)   filter.status   = status;
  if (priority) filter.priority = priority;

  const skip = (Number(page) - 1) * Number(limit);
  const [problems, total] = await Promise.all([
    Problem.find(filter).populate('reportedBy', 'name avatar').sort(sort).skip(skip).limit(Number(limit)),
    Problem.countDocuments(filter),
  ]);

  res.json({ success: true, data: problems, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
};

exports.getProblem = async (req, res) => {
  const problem = await Problem.findById(req.params.id)
    .populate('reportedBy', 'name avatar phone')
    .populate('comments.user', 'name avatar')
    .populate('assignedTo', 'name');
  if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });
  res.json({ success: true, data: problem });
};

exports.updateProblemStatus = async (req, res) => {
  const { status, adminNote, assignedTo } = req.body;
  const updates = {};
  if (status)    { updates.status = status; if (status === 'solved') updates.resolvedAt = new Date(); }
  if (adminNote) updates.adminNote = adminNote;
  if (assignedTo)updates.assignedTo = assignedTo;

  const problem = await Problem.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });
  res.json({ success: true, data: problem });
};

exports.upvoteProblem = async (req, res) => {
  const problem = await Problem.findById(req.params.id);
  if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });

  const uid = req.user._id.toString();
  const idx = problem.upvotes.findIndex(u => u.toString() === uid);
  if (idx === -1) problem.upvotes.push(req.user._id);
  else            problem.upvotes.splice(idx, 1);

  await problem.save();
  res.json({ success: true, upvotes: problem.upvotes.length });
};

exports.addComment = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ success: false, message: 'Comment text required' });
  const problem = await Problem.findByIdAndUpdate(
    req.params.id,
    { $push: { comments: { user: req.user._id, text } } },
    { new: true }
  ).populate('comments.user', 'name avatar');
  res.json({ success: true, data: problem.comments });
};

exports.deleteProblem = async (req, res) => {
  const problem = await Problem.findById(req.params.id);
  if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });
  if (problem.reportedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }
  await problem.deleteOne();
  res.json({ success: true, message: 'Problem deleted' });
};

exports.getMyProblems = async (req, res) => {
  const problems = await Problem.find({ reportedBy: req.user._id }).sort('-createdAt');
  res.json({ success: true, data: problems });
};
