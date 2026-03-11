const router = require('express').Router();
const ctrl   = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register', ctrl.register);
router.post('/me',       protect, ctrl.getMe);
router.put('/profile',   protect, ctrl.updateProfile);
router.put('/fcm-token', protect, ctrl.updateFcmToken);

module.exports = router;
