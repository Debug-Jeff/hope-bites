const mongoose = require('mongoose');

// Define Product schema for the e-commerce store
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price must be at least 0']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: [
      'Electronics',
      'Clothing',
      'Home',
      'Books',
      'Sports',
      'Other'
    ]
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  imageUrl: {
    type: String,
    default: 'no-image.jpg'
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5'],
    default: 3
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  // Enable virtuals to be included in JSON output
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Reverse populate with reviews (will add this later)
ProductSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false
});

module.exports = mongoose.model('Product', ProductSchema);
