const express = require('express');
const { getProducts, createProduct } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const router = express.Router();

router.get('/', getProducts);
router.post('/', protect, upload.single('image'), createProduct);

module.exports = router;