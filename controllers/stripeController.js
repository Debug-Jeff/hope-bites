const stripe = require('stripe')(process.env.STRIPE_KEY);
const Order = require('../models/Order');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { sendEmail } = require('../utils/email');
const { templates } = require('../utils/email');

// @desc    Process Stripe payment
// @route   POST /api/payment/stripe
// @access  Private
exports.processStripePayment = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.body.orderId);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  // Verify order belongs to user
  if (order.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to pay this order', 401));
  }

  // Create Stripe payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalPrice * 100), // Convert to cents
    currency: 'usd',
    metadata: { orderId: order._id.toString() }
  });

  res.status(200).json({
    success: true,
    clientSecret: paymentIntent.client_secret
  });
});

// @desc    Handle Stripe webhook
// @route   POST /api/payment/stripe/webhook
// @access  Public
exports.stripeWebhook = asyncHandler(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the payment_intent.succeeded event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    // Update order status
    const order = await Order.findById(orderId);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: paymentIntent.id,
        status: paymentIntent.status,
        update_time: new Date().toISOString()
      };
      await order.save();

      // Send confirmation email
      const emailTemplate = templates.orderConfirmation(order);
      await sendEmail({
        email: req.user.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html
      });
    }
  }

  res.status(200).json({ received: true });
});
