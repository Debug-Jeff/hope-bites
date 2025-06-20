const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyPromoCode
} = require('../controllers/cartController');

const { protect } = require('../middleware/auth');

// All cart routes require authentication
router.use(protect);

router.route('/')
  .get(getCart);

router.route('/add')
  .post(addToCart);

router.route('/update/:itemId')
  .put(updateCartItem);

router.route('/remove/:itemId')
  .delete(removeFromCart);

router.route('/clear')
  .delete(clearCart);

router.route('/promo')
  .post(applyPromoCode);

module.exports = router;