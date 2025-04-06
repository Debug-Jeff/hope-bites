const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// Import middleware
const { protect, authorize } = require('../middleware/auth');

// Public routes (no authentication required)
router.route('/')
  .get(getProducts);

router.route('/:id')
  .get(getProduct);

// Protected routes (require authentication and admin role)
router.route('/')
  .post(protect, authorize('admin'), createProduct);

router.route('/:id')
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

module.exports = router;
