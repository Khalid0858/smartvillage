const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  const product = await Product.create({ ...req.body, seller: req.user._id });
  res.status(201).json({ success: true, data: product });
};

exports.getProducts = async (req, res) => {
  const { category, search, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
  const filter = { isAvailable: true, isSold: false };
  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (search) filter.$text = { $search: search };

  const [products, total] = await Promise.all([
    Product.find(filter).populate('seller', 'name avatar').sort('-createdAt').skip((page-1)*limit).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);
  res.json({ success: true, data: products, pagination: { total, page: Number(page), pages: Math.ceil(total/limit) } });
};

exports.getProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id, { $inc: { views: 1 } }, { new: true }
  ).populate('seller', 'name avatar phone');
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, data: product });
};

exports.updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Not found' });
  if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, data: updated });
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Not found' });
  if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }
  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted' });
};

exports.getMyProducts = async (req, res) => {
  const products = await Product.find({ seller: req.user._id }).sort('-createdAt');
  res.json({ success: true, data: products });
};
