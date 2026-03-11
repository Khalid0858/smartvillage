const router = require('express').Router();
const ctrl   = require('../controllers/job.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/',          ctrl.getJobs);
router.post('/',         protect, ctrl.createJob);
router.get('/my',        protect, ctrl.getMyJobs);
router.get('/:id',       ctrl.getJob);
router.post('/:id/apply',protect, ctrl.applyJob);
router.put('/:id/close', protect, ctrl.closeJob);

module.exports = router;
