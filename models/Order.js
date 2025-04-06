const mongoose = require('mongoose');

// Define Order schema for the e-commerce store
const OrderSchema = new mongoose.Schema({
  // Reference to the user who placed the order
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  // Array of order items with product details
  orderItems: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    // Reference to the product
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true
    }
  }],
  // Shipping information
  shippingInfo: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  // Payment information
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Credit Card', 'PayPal', 'Stripe']
  },
  paymentResult: {
    id: { type: String },
    status: { type: String },
    update_time: { type: String },
    email_address: { type: String }
  },
  // Tax and shipping prices
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  // Total price
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  // Order status
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  paidAt: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  // Order creation date
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  // Enable virtuals for JSON output
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Calculate total price before saving
OrderSchema.pre('save', async function(next) {
  // Calculate total price from order items
  const itemsPrice = this.orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity, 0
  );
  
  // Calculate total price with tax and shipping
  this.totalPrice = itemsPrice + this.taxPrice + this.shippingPrice;
  
  next();
});

module.exports = mongoose.model('Order', OrderSchema);
