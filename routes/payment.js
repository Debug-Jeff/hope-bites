const express = require('express');
const router = express.Router();
const {
  createStripePaymentIntent,
  confirmStripePayment,
  createPayPalPayment,
  executePayPalPayment,
  stripeWebhook,
  getPaymentMethods
} = require('../controllers/paymentController');

const { protect } = require('../middleware/auth');
const { paymentLimiter } = require('../middleware/security');

// Public routes
router.get('/methods', getPaymentMethods);

// Webhook route (must be before other middleware)
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// Apply rate limiting to payment routes
router.use(paymentLimiter);

// Protected routes
router.post('/stripe/create-intent', protect, createStripePaymentIntent);
router.post('/stripe/confirm', protect, confirmStripePayment);
router.post('/paypal/create', protect, createPayPalPayment);
router.post('/paypal/execute', protect, executePayPalPayment);

module.exports = router;