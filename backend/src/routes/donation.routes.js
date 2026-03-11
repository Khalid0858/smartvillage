const router = require('express').Router();
const ctrl   = require('../controllers/donation.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/',              ctrl.getCampaigns);
router.post('/',             protect, authorize('admin'), ctrl.createCampaign);
router.get('/:id',           ctrl.getCampaign);
router.post('/:id/donate',   protect, ctrl.donate);

module.exports = router;
