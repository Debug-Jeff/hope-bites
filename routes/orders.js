const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrder,
  getMyOrders,
  getOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  deleteOrder
} = require('../controllers/orderController');

// Import middleware
const { protect, authorize } = require('../middleware/auth');

// Protected routes (require authentication)
router.route('/')
  .post(protect, createOrder)
  .get(protect, authorize('admin'), getOrders);

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrder)
  .delete(protect, authorize('admin'), deleteOrder);

router.route('/:id/pay')
  .put(protect, updateOrderToPaid);

router.route('/:id/deliver')
  .put(protect, authorize('admin'), updateOrderToDelivered);

module.exports = router;
