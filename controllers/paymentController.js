const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paypal = require('paypal-rest-sdk');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { sendEmail, templates } = require('../utils/email');

// Configure PayPal
paypal.configure({
  mode: process.env.PAYPAL_MODE || 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET
});

// @desc    Create Stripe payment intent
// @route   POST /api/payment/stripe/create-intent
// @access  Private
exports.createStripePaymentIntent = asyncHandler(async (req, res, next) => {
  const { amount, currency = 'usd', orderId } = req.body;

  if (!amount || amount < 50) { // Minimum 50 cents
    return next(new ErrorResponse('Invalid amount', 400));
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        orderId: orderId || '',
        userId: req.user.id
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }
    });
  } catch (error) {
    console.error('Stripe error:', error);
    return next(new ErrorResponse('Payment processing error', 500));
  }
});

// @desc    Confirm Stripe payment
// @route   POST /api/payment/stripe/confirm
// @access  Private
exports.confirmStripePayment = asyncHandler(async (req, res, next) => {
  const { paymentIntentId, orderId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update order status
      if (orderId) {
        const order = await Order.findById(orderId);
        if (order) {
          order.isPaid = true;
          order.paidAt = Date.now();
          order.paymentResult = {
            id: paymentIntent.id,
            status: paymentIntent.status,
            update_time: new Date().toISOString(),
            email_address: req.user.email
          };
          await order.save();

          // Send confirmation email
          const user = await User.findById(req.user.id);
          await sendEmail({
            email: user.email,
            subject: 'Order Confirmation - Hope Bites',
            html: templates.orderConfirmation(order, user)
          });

          // Clear user's cart
          user.cart = [];
          await user.save();
        }
      }

      res.status(200).json({
        success: true,
        message: 'Payment confirmed successfully',
        data: { paymentIntent }
      });
    } else {
      return next(new ErrorResponse('Payment not successful', 400));
    }
  } catch (error) {
    console.error('Payment confirmation error:', error);
    return next(new ErrorResponse('Payment confirmation failed', 500));
  }
});

// @desc    Create PayPal payment
// @route   POST /api/payment/paypal/create
// @access  Private
exports.createPayPalPayment = asyncHandler(async (req, res, next) => {
  const { amount, orderId, returnUrl, cancelUrl } = req.body;

  const paymentData = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal'
    },
    redirect_urls: {
      return_url: returnUrl || `${process.env.CLIENT_URL}/payment/success`,
      cancel_url: cancelUrl || `${process.env.CLIENT_URL}/payment/cancel`
    },
    transactions: [{
      item_list: {
        items: [{
          name: 'Hope Bites Order',
          sku: orderId,
          price: amount.toString(),
          currency: 'USD',
          quantity: 1
        }]
      },
      amount: {
        currency: 'USD',
        total: amount.toString()
      },
      description: `Hope Bites Order #${orderId}`
    }]
  };

  paypal.payment.create(paymentData, (error, payment) => {
    if (error) {
      console.error('PayPal error:', error);
      return next(new ErrorResponse('PayPal payment creation failed', 500));
    } else {
      const approvalUrl = payment.links.find(link => link.rel === 'approval_url');
      res.status(200).json({
        success: true,
        data: {
          paymentId: payment.id,
          approvalUrl: approvalUrl.href
        }
      });
    }
  });
});

// @desc    Execute PayPal payment
// @route   POST /api/payment/paypal/execute
// @access  Private
exports.executePayPalPayment = asyncHandler(async (req, res, next) => {
  const { paymentId, payerId, orderId } = req.body;

  const executeData = {
    payer_id: payerId
  };

  paypal.payment.execute(paymentId, executeData, async (error, payment) => {
    if (error) {
      console.error('PayPal execution error:', error);
      return next(new ErrorResponse('PayPal payment execution failed', 500));
    } else {
      // Update order status
      if (orderId) {
        const order = await Order.findById(orderId);
        if (order) {
          order.isPaid = true;
          order.paidAt = Date.now();
          order.paymentResult = {
            id: payment.id,
            status: payment.state,
            update_time: payment.update_time,
            email_address: payment.payer.payer_info.email
          };
          await order.save();

          // Send confirmation email
          const user = await User.findById(req.user.id);
          await sendEmail({
            email: user.email,
            subject: 'Order Confirmation - Hope Bites',
            html: templates.orderConfirmation(order, user)
          });

          // Clear user's cart
          user.cart = [];
          await user.save();
        }
      }

      res.status(200).json({
        success: true,
        message: 'PayPal payment executed successfully',
        data: { payment }
      });
    }
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
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!', paymentIntent.id);
      
      // Update order if metadata contains orderId
      if (paymentIntent.metadata.orderId) {
        const order = await Order.findById(paymentIntent.metadata.orderId);
        if (order && !order.isPaid) {
          order.isPaid = true;
          order.paidAt = Date.now();
          order.paymentResult = {
            id: paymentIntent.id,
            status: paymentIntent.status,
            update_time: new Date().toISOString()
          };
          await order.save();
        }
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('PaymentIntent failed:', failedPayment.id);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// @desc    Get payment methods
// @route   GET /api/payment/methods
// @access  Public
exports.getPaymentMethods = asyncHandler(async (req, res, next) => {
  const methods = [
    {
      id: 'stripe',
      name: 'Credit/Debit Card',
      description: 'Pay securely with your credit or debit card',
      icon: 'bx-credit-card',
      enabled: !!process.env.STRIPE_SECRET_KEY
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      icon: 'bxl-paypal',
      enabled: !!process.env.PAYPAL_CLIENT_ID
    }
  ];

  res.status(200).json({
    success: true,
    data: methods.filter(method => method.enabled)
  });
});