// Environment configuration
module.exports = {
  // Application settings
  app: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development'
  },

  // Database settings
  db: {
    url: process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce_db'
  },

  // JWT settings
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expire: process.env.JWT_EXPIRE || '30d',
    cookieExpire: process.env.JWT_COOKIE_EXPIRE || 30
  },

  // Email settings
  email: {
    host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
    port: process.env.EMAIL_PORT || 2525,
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  },

  // Payment settings
  payment: {
    stripeKey: process.env.STRIPE_KEY,
    paypalClientId: process.env.PAYPAL_CLIENT_ID
  }
};
