const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  const post = await Post.create({ ...req.body, author: req.user._id });
  await post.populate('author', 'name avatar');
  res.status(201).json({ success: true, data: post });
};

exports.getPosts = async (req, res) => {
  const { category, page = 1, limit = 12, sort = '-createdAt' } = req.query;
  const filter = {};
  if (category) filter.category = category;

  const [posts, total] = await Promise.all([
    Post.find(filter).populate('author', 'name avatar').select('-comments').sort(sort).skip((page-1)*limit).limit(Number(limit)),
    Post.countDocuments(filter),
  ]);
  res.json({ success: true, data: posts, pagination: { total, page: Number(page), pages: Math.ceil(total/limit) } });
};

exports.getPost = async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true })
    .populate('author', 'name avatar')
    .populate('comments.author', 'name avatar');
  if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
  res.json({ success: true, data: post });
};

exports.likePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ success: false, message: 'Not found' });

  const uid = req.user._id.toString();
  const idx = post.likes.findIndex(u => u.toString() === uid);
  if (idx === -1) post.likes.push(req.user._id);
  else            post.likes.splice(idx, 1);
  await post.save();
  res.json({ success: true, likes: post.likes.length, liked: idx === -1 });
};

exports.addComment = async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ success: false, message: 'Content required' });
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { $push: { comments: { author: req.user._id, content } } },
    { new: true }
  ).populate('comments.author', 'name avatar');
  res.json({ success: true, data: post.comments });
};

exports.deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ success: false, message: 'Not found' });
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }
  await post.deleteOne();
  res.json({ success: true, message: 'Post deleted' });
};
