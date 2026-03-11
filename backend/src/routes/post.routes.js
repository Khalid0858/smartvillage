const router = require('express').Router();
const ctrl   = require('../controllers/post.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/',              ctrl.getPosts);
router.post('/',             protect, ctrl.createPost);
router.get('/:id',           ctrl.getPost);
router.post('/:id/like',     protect, ctrl.likePost);
router.post('/:id/comments', protect, ctrl.addComment);
router.delete('/:id',        protect, ctrl.deletePost);

module.exports = router;
