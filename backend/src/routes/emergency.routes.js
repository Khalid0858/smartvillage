const router = require('express').Router();
const ctrl   = require('../controllers/emergency.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/',              protect, ctrl.createEmergency);
router.get('/',               protect, authorize('volunteer','admin'), ctrl.getEmergencies);
router.put('/:id/respond',    protect, authorize('volunteer','admin'), ctrl.respondEmergency);
router.put('/:id/resolve',    protect, authorize('volunteer','admin'), ctrl.resolveEmergency);

module.exports = router;
