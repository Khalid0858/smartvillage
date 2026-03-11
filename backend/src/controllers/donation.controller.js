const DonationCampaign = require('../models/Donation');

exports.createCampaign = async (req, res) => {
  const campaign = await DonationCampaign.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, data: campaign });
};

exports.getCampaigns = async (req, res) => {
  const { category, page = 1, limit = 12 } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;

  const [campaigns, total] = await Promise.all([
    DonationCampaign.find(filter).populate('createdBy', 'name avatar').select('-donations').sort('-createdAt').skip((page-1)*limit).limit(Number(limit)),
    DonationCampaign.countDocuments(filter),
  ]);
  res.json({ success: true, data: campaigns, pagination: { total, page: Number(page), pages: Math.ceil(total/limit) } });
};

exports.getCampaign = async (req, res) => {
  const campaign = await DonationCampaign.findById(req.params.id)
    .populate('createdBy', 'name avatar')
    .populate('donations.donor', 'name avatar');
  if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' });
  res.json({ success: true, data: campaign });
};

exports.donate = async (req, res) => {
  const { amount, message, anonymous } = req.body;
  if (!amount || amount < 1) return res.status(400).json({ success: false, message: 'Valid amount required' });

  const campaign = await DonationCampaign.findById(req.params.id);
  if (!campaign || !campaign.isActive) return res.status(404).json({ success: false, message: 'Campaign not active' });

  campaign.donations.push({ donor: req.user._id, amount, message, anonymous });
  campaign.raisedAmount += Number(amount);
  await campaign.save();

  res.json({ success: true, raisedAmount: campaign.raisedAmount });
};
