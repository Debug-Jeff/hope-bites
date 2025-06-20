const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send email function
exports.sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Hope Bites" <${process.env.EMAIL_USERNAME}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Email templates
exports.templates = {
  orderConfirmation: (order, user) => {
    const orderItems = order.orderItems.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    return {
      subject: `Order Confirmation - Hope Bites #${order._id}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #2E5339; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Hope Bites</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Order Confirmation</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #2E5339; margin-top: 0;">Thank you for your order, ${user.name}!</h2>
            <p>We've received your order and will begin processing it shortly. You'll receive another email when your order ships.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2E5339; margin-top: 0;">Order Details</h3>
              <p><strong>Order Number:</strong> #${order._id}</p>
              <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2E5339; margin-top: 0;">Order Items</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: #f5f5f5;">
                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Image</th>
                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Product</th>
                    <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                    <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${orderItems}
                </tbody>
              </table>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2E5339; margin-top: 0;">Shipping Address</h3>
              <p>
                ${order.shippingInfo.firstName} ${order.shippingInfo.lastName}<br>
                ${order.shippingInfo.address}<br>
                ${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.zipCode}<br>
                ${order.shippingInfo.country}
              </p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2E5339; margin-top: 0;">Order Summary</h3>
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 5px 0;">Subtotal:</td>
                  <td style="text-align: right; padding: 5px 0;">$${(order.totalPrice - order.taxPrice - order.shippingPrice).toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;">Shipping:</td>
                  <td style="text-align: right; padding: 5px 0;">$${order.shippingPrice.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;">Tax:</td>
                  <td style="text-align: right; padding: 5px 0;">$${order.taxPrice.toFixed(2)}</td>
                </tr>
                <tr style="border-top: 2px solid #2E5339; font-weight: bold; font-size: 18px;">
                  <td style="padding: 10px 0;">Total:</td>
                  <td style="text-align: right; padding: 10px 0;">$${order.totalPrice.toFixed(2)}</td>
                </tr>
              </table>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p>Questions about your order? Contact us at <a href="mailto:support@hopebites.com" style="color: #2E5339;">support@hopebites.com</a></p>
              <p style="margin-top: 20px;">
                <a href="${process.env.CLIENT_URL}" style="background: #2E5339; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Continue Shopping</a>
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
            <p>© 2025 Hope Bites. All rights reserved.</p>
            <p>Nourishing children worldwide with nutritious and delicious snacks.</p>
          </div>
        </body>
        </html>
      `
    };
  },

  welcomeEmail: (user) => {
    return {
      subject: 'Welcome to Hope Bites!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Hope Bites</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #2E5339; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to Hope Bites!</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #2E5339; margin-top: 0;">Hello ${user.name}!</h2>
            <p>Thank you for joining the Hope Bites family. We're excited to help you provide the best nutrition for your children.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2E5339; margin-top: 0;">What's Next?</h3>
              <ul style="padding-left: 20px;">
                <li>Explore our range of nutritious products</li>
                <li>Learn about child nutrition in our resource center</li>
                <li>Join our community of parents committed to healthy eating</li>
                <li>Get exclusive offers and nutrition tips</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.CLIENT_URL}/shop" style="background: #2E5339; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Start Shopping</a>
            </div>
            
            <p>If you have any questions, don't hesitate to reach out to our support team at <a href="mailto:support@hopebites.com" style="color: #2E5339;">support@hopebites.com</a></p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
            <p>© 2025 Hope Bites. All rights reserved.</p>
          </div>
        </body>
        </html>
      `
    };
  }
};