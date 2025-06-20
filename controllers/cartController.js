const User = require('../models/User');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
    path: 'cart.product',
    select: 'name price images stock sizes'
  });

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Calculate cart totals
  let subtotal = 0;
  const cartItems = user.cart.map(item => {
    const itemPrice = item.size && item.product.sizes.length > 0 
      ? item.product.sizes.find(s => s.name === item.size)?.price || item.product.price
      : item.product.price;
    
    const itemTotal = itemPrice * item.quantity;
    subtotal += itemTotal;

    return {
      _id: item._id,
      product: item.product,
      quantity: item.quantity,
      size: item.size,
      price: itemPrice,
      total: itemTotal,
      addedAt: item.addedAt
    };
  });

  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
  const total = subtotal + tax + shipping;

  res.status(200).json({
    success: true,
    data: {
      items: cartItems,
      summary: {
        subtotal: Math.round(subtotal * 100) / 100,
        tax: Math.round(tax * 100) / 100,
        shipping: shipping,
        total: Math.round(total * 100) / 100,
        itemCount: cartItems.reduce((acc, item) => acc + item.quantity, 0)
      }
    }
  });
});

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
exports.addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity = 1, size } = req.body;

  // Validate product exists
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  // Check stock availability
  let availableStock = product.stock;
  if (size && product.sizes.length > 0) {
    const sizeOption = product.sizes.find(s => s.name === size);
    if (!sizeOption) {
      return next(new ErrorResponse('Invalid size option', 400));
    }
    availableStock = sizeOption.stock;
  }

  if (availableStock < quantity) {
    return next(new ErrorResponse('Insufficient stock', 400));
  }

  const user = await User.findById(req.user.id);

  // Check if item already exists in cart
  const existingItemIndex = user.cart.findIndex(
    item => item.product.toString() === productId && item.size === size
  );

  if (existingItemIndex > -1) {
    // Update quantity if item exists
    const newQuantity = user.cart[existingItemIndex].quantity + quantity;
    if (newQuantity > availableStock) {
      return next(new ErrorResponse('Cannot add more items than available stock', 400));
    }
    user.cart[existingItemIndex].quantity = newQuantity;
  } else {
    // Add new item to cart
    user.cart.push({
      product: productId,
      quantity,
      size: size || null
    });
  }

  await user.save();

  // Return updated cart
  const updatedUser = await User.findById(req.user.id).populate({
    path: 'cart.product',
    select: 'name price images stock sizes'
  });

  res.status(200).json({
    success: true,
    message: 'Item added to cart',
    data: updatedUser.cart
  });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/update/:itemId
// @access  Private
exports.updateCartItem = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const { itemId } = req.params;

  if (quantity < 1) {
    return next(new ErrorResponse('Quantity must be at least 1', 400));
  }

  const user = await User.findById(req.user.id).populate({
    path: 'cart.product',
    select: 'name price images stock sizes'
  });

  const cartItem = user.cart.id(itemId);
  if (!cartItem) {
    return next(new ErrorResponse('Cart item not found', 404));
  }

  // Check stock availability
  let availableStock = cartItem.product.stock;
  if (cartItem.size && cartItem.product.sizes.length > 0) {
    const sizeOption = cartItem.product.sizes.find(s => s.name === cartItem.size);
    availableStock = sizeOption ? sizeOption.stock : 0;
  }

  if (quantity > availableStock) {
    return next(new ErrorResponse('Insufficient stock', 400));
  }

  cartItem.quantity = quantity;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Cart item updated',
    data: user.cart
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
// @access  Private
exports.removeFromCart = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;

  const user = await User.findById(req.user.id);
  
  const cartItem = user.cart.id(itemId);
  if (!cartItem) {
    return next(new ErrorResponse('Cart item not found', 404));
  }

  cartItem.remove();
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Item removed from cart'
  });
});

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private
exports.clearCart = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  user.cart = [];
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Cart cleared'
  });
});

// @desc    Apply promo code
// @route   POST /api/cart/promo
// @access  Private
exports.applyPromoCode = asyncHandler(async (req, res, next) => {
  const { code } = req.body;

  // Simple promo code logic (you can expand this)
  const promoCodes = {
    'WELCOME10': { discount: 0.10, type: 'percentage', description: '10% off your order' },
    'FREESHIP': { discount: 5.99, type: 'fixed', description: 'Free shipping' },
    'SAVE20': { discount: 0.20, type: 'percentage', description: '20% off your order' }
  };

  const promo = promoCodes[code.toUpperCase()];
  if (!promo) {
    return next(new ErrorResponse('Invalid promo code', 400));
  }

  res.status(200).json({
    success: true,
    data: {
      code: code.toUpperCase(),
      discount: promo.discount,
      type: promo.type,
      description: promo.description
    }
  });
});