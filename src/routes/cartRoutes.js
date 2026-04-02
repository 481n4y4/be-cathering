const express = require('express');
const { addToCart, getCart, updateCart, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

router.post('/add', addToCart);
router.get('/', getCart);
router.put('/update/:itemId', updateCart);
router.delete('/remove/:itemId', removeFromCart);

module.exports = router;