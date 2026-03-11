const router = require('express').Router();
const ctrl   = require('../controllers/problem.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/',              ctrl.getProblems);
router.post('/',             protect, ctrl.createProblem);
router.get('/my',            protect, ctrl.getMyProblems);
router.get('/:id',           ctrl.getProblem);
router.put('/:id/status',    protect, authorize('admin'), ctrl.updateProblemStatus);
router.post('/:id/upvote',   protect, ctrl.upvoteProblem);
router.post('/:id/comments', protect, ctrl.addComment);
router.delete('/:id',        protect, ctrl.deleteProblem);

module.exports = router;
