const router = require('express').Router();
const ctrl   = require('../controllers/product.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/',     ctrl.getProducts);
router.post('/',    protect, ctrl.createProduct);
router.get('/my',   protect, ctrl.getMyProducts);
router.get('/:id',  ctrl.getProduct);
router.put('/:id',  protect, ctrl.updateProduct);
router.delete('/:id', protect, ctrl.deleteProduct);

module.exports = router;
