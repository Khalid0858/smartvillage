const router = require('express').Router();
const ctrl   = require('../controllers/service.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/',             ctrl.getServices);
router.post('/',            protect, authorize('service_provider','admin'), ctrl.createService);
router.get('/my',           protect, ctrl.getMyService);
router.get('/:id',          ctrl.getService);
router.put('/:id',          protect, ctrl.updateService);
router.post('/:id/reviews', protect, ctrl.addReview);

module.exports = router;
