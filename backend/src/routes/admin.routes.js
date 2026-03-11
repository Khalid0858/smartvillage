const router = require('express').Router();
const ctrl   = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect, authorize('admin'));

router.get('/stats',              ctrl.getStats);
router.get('/users',              ctrl.getUsers);
router.put('/users/:id/role',     ctrl.updateUserRole);
router.put('/users/:id/toggle',   ctrl.toggleUserActive);

module.exports = router;
