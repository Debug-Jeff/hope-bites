const nodemailer = require('nodemailer');
const config = require('../config/config');

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.port === 465, // true for 465, false for other ports
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
});

// Send email function
exports.sendEmail = async (options) => {
  try {
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"E-Commerce Store" <${config.email.user}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html
    });

    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Email templates
exports.templates = {
  orderConfirmation: (order) => {
    return {
      subject: `Order Confirmation - #${order._id}`,
      html: `
        <h1>Thank you for your order!</h1>
        <p>Your order has been received and is being processed.</p>
        <h2>Order Details</h2>
        <p>Order ID: ${order._id}</p>
        <p>Total: $${order.totalPrice.toFixed(2)}</p>
        <p>Payment Method: ${order.paymentMethod}</p>
        <h3>Shipping Address</h3>
        <p>${order.shippingInfo.address}</p>
        <p>${order.shippingInfo.city}, ${order.shippingInfo.postalCode}</p>
        <p>${order.shippingInfo.country}</p>
      `
    };
  },
  passwordReset: (user, resetUrl) => {
    return {
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset</h1>
        <p>You requested a password reset for your account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 10 minutes.</p>
      `
    };
  }
};
