// notice.routes.js
const noticeRouter = require('express').Router();
const noticeCtrl   = require('../controllers/notice.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

noticeRouter.get('/',     noticeCtrl.getNotices);
noticeRouter.post('/',    protect, authorize('admin'), noticeCtrl.createNotice);
noticeRouter.put('/:id',  protect, authorize('admin'), noticeCtrl.updateNotice);
noticeRouter.delete('/:id',protect,authorize('admin'), noticeCtrl.deleteNotice);

module.exports = noticeRouter;
