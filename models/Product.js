const mongoose = require('mongoose');

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
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot be more than 200 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price must be at least 0']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price must be at least 0']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: [
      'Growth Support',
      'Brain Boost',
      'Immune Support',
      'General Nutrition'
    ]
  },
  subcategory: {
    type: String,
    enum: [
      'Protein Rich',
      'Vitamin Fortified',
      'Mineral Enhanced',
      'Omega-3',
      'Probiotic',
      'Antioxidant'
    ]
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  sizes: [{
    name: String,
    price: Number,
    stock: Number
  }],
  nutritionFacts: {
    servingSize: String,
    calories: Number,
    protein: String,
    carbohydrates: String,
    fat: String,
    fiber: String,
    sugar: String,
    sodium: String,
    vitamins: [String],
    minerals: [String]
  },
  ingredients: [String],
  allergens: [String],
  benefits: [String],
  ageRange: {
    min: Number,
    max: Number
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [String],
  weight: String,
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  shelfLife: String,
  storageInstructions: String,
  seoTitle: String,
  seoDescription: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create index for search
ProductSchema.index({
  name: 'text',
  description: 'text',
  category: 'text',
  tags: 'text'
});

// Virtual for discount percentage
ProductSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual for primary image
ProductSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : (this.images[0] ? this.images[0].url : '/assets/no-image.jpg');
});

// Update the updatedAt field before saving
ProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', ProductSchema);