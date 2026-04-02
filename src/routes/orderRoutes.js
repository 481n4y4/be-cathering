const express = require('express');
const { checkout, createOrder, paymentMidtrans, confirmCOD } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

router.post('/checkout', checkout);
router.post('/create', createOrder);
router.post('/payment/:orderId', paymentMidtrans);
router.post('/confirm-cod/:orderId', confirmCOD);

module.exports = router;