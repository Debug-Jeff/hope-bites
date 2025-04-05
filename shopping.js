// Theme handling with Tweakpane
const config = {
    theme: 'system',
};

const ctrl = new Pane({
    title: 'Config',
    expanded: true,
});

const update = () => {
    document.documentElement.dataset.theme = config.theme;
};

const sync = (event) => {
    if (
        !document.startViewTransition ||
        event.target.controller.view.labelElement.innerText !== 'Theme'
    )
        return update();
    document.startViewTransition(() => update());
};

ctrl.addBinding(config, 'theme', {
    label: 'Theme',
    options: {
        System: 'system',
        Light: 'light',
        Dark: 'dark',
    },
});

ctrl.on('change', sync);
update();

// DOM Elements
const productContainer = document.getElementById('product-container');
const filterSelects = document.querySelectorAll('.filter-select');
const searchInput = document.getElementById('productSearch');
const searchBtn = document.getElementById('searchBtn');
const productCards = document.querySelectorAll('.product-card');
const viewDetailsBtns = document.querySelectorAll('.view-details-btn');
const addToCartBtns = document.querySelectorAll('.add-to-cart');
const cartCount = document.getElementById('cartCount');
const cartItemCount = document.getElementById('cartItemCount');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const emptyCartMessage = document.getElementById('emptyCartMessage');
const cartSummary = document.getElementById('cartSummary');
const cartSubtotal = document.getElementById('cartSubtotal');
const shippingCost = document.getElementById('shippingCost');
const discountRow = document.getElementById('discountRow');
const discountAmount = document.getElementById('discountAmount');
const cartTotal = document.getElementById('cartTotal');
const promoCodeInput = document.getElementById('promoCodeInput');
const applyPromo = document.getElementById('applyPromo');
const checkoutBtn = document.getElementById('checkoutBtn');
const startShopping = document.getElementById('startShopping');
const productModal = document.getElementById('productModal');
const modalMainImage = document.getElementById('modalMainImage');
const modalProductTitle = document.getElementById('modalProductTitle');
const modalProductPrice = document.getElementById('modalProductPrice');
const modalOriginalPrice = document.getElementById('modalOriginalPrice');
const modalProductDesc = document.getElementById('modalProductDesc');
const modalProductBenefits = document.getElementById('modalProductBenefits');
const modalNutritionTable = document.getElementById('modalNutritionTable');
const quantityMinus = document.getElementById('quantityMinus');
const quantityPlus = document.getElementById('quantityPlus');
const productQuantity = document.getElementById('productQuantity');
const sizeBtns = document.querySelectorAll('.size-btn');
const subscribeOption = document.getElementById('subscribeOption');
const modalAddToCart = document.getElementById('modalAddToCart');
const thumbnails = document.querySelectorAll('.thumbnail');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckout = document.getElementById('closeCheckout');
const steps = document.querySelectorAll('.step');
const stepContents = document.querySelectorAll('.checkout-step-content');
const continueShopping = document.getElementById('continueShopping');
const toPaymentBtn = document.getElementById('toPaymentBtn');
const backToShipping = document.getElementById('backToShipping');
const toReviewBtn = document.getElementById('toReviewBtn');
const backToPayment = document.getElementById('backToPayment');
const placeOrderBtn = document.getElementById('placeOrderBtn');
const termsAgree = document.getElementById('termsAgree');
const paymentMethods = document.querySelectorAll('.payment-method');
const paymentForms = document.querySelectorAll('.payment-form');
const shippingOptions = document.querySelectorAll('.shipping-option input');
const confirmationModal = document.getElementById('confirmationModal');
const orderNumber = document.getElementById('orderNumber');
const confirmationEmail = document.getElementById('confirmationEmail');
const viewOrderBtn = document.getElementById('viewOrderBtn');
const continueBrowsingBtn = document.getElementById('continueBrowsingBtn');
const carouselTrack = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const carouselIndicators = document.getElementById('carouselIndicators');
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');

// Carousel Functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');

// Create carousel indicators
slides.forEach((_, index) => {
    const indicator = document.createElement('div');
    indicator.classList.add('carousel-indicator');
    if (index === 0) indicator.classList.add('active');
    indicator.addEventListener('click', () => goToSlide(index));
    carouselIndicators.appendChild(indicator);
});

const indicators = document.querySelectorAll('.carousel-indicator');

function updateCarousel() {
    const slideWidth = slides[0].clientWidth;
    carouselTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
    
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateCarousel();
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Auto-advance carousel every 5 seconds
let carouselInterval = setInterval(nextSlide, 5000);

// Pause carousel on hover
carouselTrack.addEventListener('mouseenter', () => {
    clearInterval(carouselInterval);
});

carouselTrack.addEventListener('mouseleave', () => {
    carouselInterval = setInterval(nextSlide, 5000);
});

// Mobile menu toggle
mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Product Filtering
function filterProducts() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const ageFilter = document.getElementById('ageFilter').value;
    const sortBy = document.getElementById('sortBy').value;
    const searchTerm = searchInput.value.toLowerCase();
    
    productCards.forEach(card => {
        const category = card.dataset.category;
        const age = card.dataset.age;
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('.product-short-desc').textContent.toLowerCase();
        
        const matchesCategory = categoryFilter === 'all' || category === categoryFilter;
        const matchesAge = ageFilter === 'all' || age === ageFilter;
        const matchesSearch = searchTerm === '' || 
                               title.includes(searchTerm) || 
                               description.includes(searchTerm);
        
        card.style.display = matchesCategory && matchesAge && matchesSearch ? 'block' : 'none';
    });
    
    // Sort products based on selection
    const productSections = document.querySelectorAll('.product-section');
    productSections.forEach(section => {
        const grid = section.querySelector('.product-grid');
        const products = Array.from(grid.querySelectorAll('.product-card:not([style*="display: none"])'));
        
        products.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('.price').textContent.replace('$', ''));
            const priceB = parseFloat(b.querySelector('.price').textContent.replace('$', ''));
            
            if (sortBy === 'price-low') {
                return priceA - priceB;
            } else if (sortBy === 'price-high') {
                return priceB - priceA;
            } else if (sortBy === 'newest') {
                return a.querySelector('.badge.new') ? -1 : 1;
            } else { // 'popular'
                return a.querySelector('.badge.bestseller') ? -1 : 1;
            }
        });
        
        products.forEach(product => grid.appendChild(product));
    });
    
    // Update section visibility
    productSections.forEach(section => {
        const visibleProducts = section.querySelectorAll('.product-card:not([style*="display: none"])');
        section.style.display = visibleProducts.length > 0 ? 'block' : 'none';
    });
}

filterSelects.forEach(select => {
    select.addEventListener('change', filterProducts);
});

searchBtn.addEventListener('click', filterProducts);
searchInput.addEventListener('keyup', event => {
    if (event.key === 'Enter') {
        filterProducts();
    }
});

// Product Data
const productData = {
    fruit1: {
        name: 'Mixed Berry Bites',
        shortDesc: 'Mixed fruit snack with added vitamins',
        price: 12.99,
        originalPrice: 15.99,
        description: 'Our Mixed Berry Bites are a delicious blend of strawberries, blueberries, and raspberries, packed with essential vitamins and minerals for your child\'s growth and development. Made with 100% real fruit and fortified with vitamins A, C, and E.',
        benefits: [
            'Made with 100% real fruit',
            'No artificial flavors or preservatives',
            'Rich in vitamins A, C, and E',
            'Good source of fiber',
            'Perfect for lunchboxes or on-the-go snacking'
        ],
        nutrition: [
            { nutrient: 'Calories', amount: '80', dailyValue: '-' },
            { nutrient: 'Total Fat', amount: '0g', dailyValue: '0%' },
            { nutrient: 'Sodium', amount: '5mg', dailyValue: '0%' },
            { nutrient: 'Total Carbs', amount: '20g', dailyValue: '7%' },
            { nutrient: 'Sugars', amount: '12g', dailyValue: '-' },
            { nutrient: 'Fiber', amount: '2g', dailyValue: '8%' },
            { nutrient: 'Protein', amount: '1g', dailyValue: '2%' },
            { nutrient: 'Vitamin A', amount: '300 IU', dailyValue: '6%' },
            { nutrient: 'Vitamin C', amount: '60mg', dailyValue: '100%' },
            { nutrient: 'Vitamin E', amount: '10mg', dailyValue: '50%' }
        ],
        category: 'fruit',
        age: 'kids',
        badges: ['new', 'bestseller'],
        reviews: 24,
        rating: 4.5
    },
    fruit2: {
        name: 'Apple Cinnamon Crisps',
        shortDesc: 'Crispy apple snacks with a hint of cinnamon',
        price: 10.99,
        originalPrice: 10.99,
        description: 'Our Apple Cinnamon Crisps are made from fresh, crisp apples lightly dusted with cinnamon for a delicious and nutritious snack your toddler will love. Each serving provides a good source of fiber and vitamin C.',
        benefits: [
            'Made with real apple slices',
            'Just a hint of cinnamon for flavor',
            'No added sugars',
            'Good source of fiber',
            'Perfect size for little hands'
        ],
        nutrition: [
            { nutrient: 'Calories', amount: '60', dailyValue: '-' },
            { nutrient: 'Total Fat', amount: '0g', dailyValue: '0%' },
            { nutrient: 'Sodium', amount: '0mg', dailyValue: '0%' },
            { nutrient: 'Total Carbs', amount: '15g', dailyValue: '5%' },
            { nutrient: 'Sugars', amount: '10g', dailyValue: '-' },
            { nutrient: 'Fiber', amount: '3g', dailyValue: '12%' },
            { nutrient: 'Protein', amount: '0g', dailyValue: '0%' },
            { nutrient: 'Vitamin C', amount: '30mg', dailyValue: '50%' }
        ],
        category: 'fruit',
        age: 'toddler',
        badges: [],
        reviews: 18,
        rating: 4.3
    },
    // Add data for other products
};

// Shopping Cart Functionality
let cart = [];
let appliedPromo = null;

// Display product details in modal
function showProductDetails(productId) {
    const product = productData[productId];
    
    if (!product) return;
    
    modalProductTitle.textContent = product.name;
    modalProductPrice.textContent = `$${product.price.toFixed(2)}`;
    
    if (product.originalPrice > product.price) {
        modalOriginalPrice.textContent = `$${product.originalPrice.toFixed(2)}`;
        modalOriginalPrice.style.display = 'inline';
        document.querySelector('.discount-badge').style.display = 'inline';
    } else {
        modalOriginalPrice.style.display = 'none';
        document.querySelector('.discount-badge').style.display = 'none';
    }
    
    modalProductDesc.textContent = product.description;
    
    // Clear benefits list and populate with new data
    modalProductBenefits.innerHTML = '';
    product.benefits.forEach(benefit => {
        const li = document.createElement('li');
        li.textContent = benefit;
        modalProductBenefits.appendChild(li);
    });
    
    // Clear nutrition table and populate with new data
    modalNutritionTable.querySelector('tbody').innerHTML = '';
    product.nutrition.forEach(item => {
        const row = document.createElement('tr');
        
        const nutrientCell = document.createElement('td');
        nutrientCell.textContent = item.nutrient;
        
        const amountCell = document.createElement('td');
        amountCell.textContent = item.amount;
        
        const dvCell = document.createElement('td');
        dvCell.textContent = item.dailyValue;
        
        row.appendChild(nutrientCell);
        row.appendChild(amountCell);
        row.appendChild(dvCell);
        
        modalNutritionTable.querySelector('tbody').appendChild(row);
    });
    
    // Reset quantity to 1
    productQuantity.textContent = '1';
    
    // Update thumbnail images
    thumbnails.forEach((thumb, index) => {
        // Assuming you would have multiple images for each product
        thumb.src = `assets/images/${productId}-${index + 1}.jpg`;
        thumb.alt = `${product.name} image ${index + 1}`;
    });
    
    // Set main image
    modalMainImage.src = `assets/images/${productId}-1.jpg`;
    modalMainImage.alt = product.name;
    
    // Reset size selection
    sizeBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    sizeBtns[0].classList.add('active');
    
    // Reset subscribe option
    subscribeOption.checked = false;
    
    // Set data attribute for add to cart button
    modalAddToCart.dataset.productId = productId;
    
    // Show modal
    productModal.classList.add('active');
    document.body.classList.add('modal-open');
}

// Thumbnail click event
thumbnails.forEach(thumb => {
    thumb.addEventListener('click', function() {
        modalMainImage.src = this.src;
        modalMainImage.alt = this.alt;
        
        // Update active thumbnail
        thumbnails.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
    });
});

// Size selection
sizeBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        sizeBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

// Quantity controls
quantityMinus.addEventListener('click', function() {
    let quantity = parseInt(productQuantity.textContent);
    if (quantity > 1) {
        productQuantity.textContent = quantity - 1;
    }
});

quantityPlus.addEventListener('click', function() {
    let quantity = parseInt(productQuantity.textContent);
    productQuantity.textContent = quantity + 1;
});

// Add to cart from modal
modalAddToCart.addEventListener('click', function() {
    const productId = this.dataset.productId;
    const product = productData[productId];
    const quantity = parseInt(productQuantity.textContent);
    const size = document.querySelector('.size-btn.active').dataset.size;
    const isSubscription = subscribeOption.checked;
    
    addToCart(productId, product, quantity, size, isSubscription);
    
    // Close modal
    closeProductModal();
});

// Close product modal
function closeProductModal() {
    productModal.classList.remove('active');
    document.body.classList.remove('modal-open');
}

// Close modal when clicking outside or on close button
document.querySelector('.modal-close').addEventListener('click', closeProductModal);
productModal.addEventListener('click', function(e) {
    if (e.target === this) {
        closeProductModal();
    }
});

// Add to cart from product grid
addToCartBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const productId = this.dataset.productId;
        const product = productData[productId];
        
        // Default values when adding directly from product grid
        addToCart(productId, product, 1, 'regular', false);
    });
});

// View details from product grid
viewDetailsBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const productId = this.dataset.productId;
        showProductDetails(productId);
    });
});

// Add to cart function
function addToCart(productId, product, quantity, size, isSubscription) {
    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => 
        item.productId === productId && 
        item.size === size && 
        item.isSubscription === isSubscription
    );
    
    if (existingItemIndex !== -1) {
        // Update quantity if product already in cart
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item to cart
        cart.push({
            productId,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            quantity,
            size,
            isSubscription,
            image: `assets/images/${productId}-1.jpg`
        });
    }
    
    // Update cart UI
    updateCartUI();
    
    // Show notification
    showNotification(`${product.name} added to cart!`);
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove notification after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Update cart UI
function updateCartUI() {
    // Calculate total items in cart
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update cart count badge
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    cartItemCount.textContent = totalItems;
    
    // Update empty cart message visibility
    emptyCartMessage.style.display = totalItems > 0 ? 'none' : 'block';
    cartSummary.style.display = totalItems > 0 ? 'block' : 'none';
    
    // Clear cart items and re-render
    cartItems.innerHTML = '';
    
    // Calculate subtotal and render cart items
    let subtotal = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        
        cartItem.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)} ${item.isSubscription ? '(Subscription)' : ''}</p>
                <p class="cart-item-size">Size: ${item.size}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-index="${index}">+</button>
                </div>
            </div>
            <div class="cart-item-total">
                <p>$${itemTotal.toFixed(2)}</p>
                <button class="remove-item" data-index="${index}">×</button>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    // Add event listeners to cart item controls
    document.querySelectorAll('.cart-item .quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
                updateCartUI();
            }
        });
    });
    
    document.querySelectorAll('.cart-item .quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            cart[index].quantity++;
            updateCartUI();
        });
    });
    
    document.querySelectorAll('.cart-item .remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            cart.splice(index, 1);
            updateCartUI();
        });
    });
    
    // Update cart summary
    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    
    // Calculate shipping
    const shipping = subtotal > 50 ? 0 : 5.99;
    shippingCost.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    
    // Calculate discount if promo code applied
    let discount = 0;
    if (appliedPromo) {
        discount = subtotal * appliedPromo.discount;
        discountAmount.textContent = `-$${discount.toFixed(2)}`;
        discountRow.style.display = 'flex';
    } else {
        discountRow.style.display = 'none';
    }
    
    // Calculate total
    const total = subtotal + shipping - discount;
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Toggle cart sidebar
cartCount.addEventListener('click', function() {
    cartSidebar.classList.add('active');
    document.body.classList.add('sidebar-open');
});

closeCart.addEventListener('click', function() {
    cartSidebar.classList.remove('active');
    document.body.classList.remove('sidebar-open');
});

// Close cart when clicking outside
document.addEventListener('click', function(e) {
    if (cartSidebar.classList.contains('active') &&
        !cartSidebar.contains(e.target) &&
        e.target !== cartCount) {
        cartSidebar.classList.remove('active');
        document.body.classList.remove('sidebar-open');
    }
});

// Promo code functionality
const promoCodes = {
    'WELCOME10': { discount: 0.1, message: '10% discount applied!' },
    'SAVE20': { discount: 0.2, message: '20% discount applied!' },
    'FREESHIP': { discount: 0, message: 'Free shipping applied!' }
};

applyPromo.addEventListener('click', function() {
    const code = promoCodeInput.value.trim().toUpperCase();
    
    if (!code) {
        showNotification('Please enter a promo code');
        return;
    }
    
    if (promoCodes[code]) {
        appliedPromo = promoCodes[code];
        showNotification(appliedPromo.message);
        updateCartUI();
    } else {
        showNotification('Invalid promo code');
    }
});

// Checkout functionality
checkoutBtn.addEventListener('click', function() {
    if (cart.length === 0) {
        showNotification('Your cart is empty');
        return;
    }
    
    openCheckoutModal();
});

function openCheckoutModal() {
    // Populate checkout summary with cart items
    document.getElementById('checkoutItemCount').textContent = cart.length;
    document.getElementById('checkoutSubtotal').textContent = cartSubtotal.textContent;
    document.getElementById('checkoutShipping').textContent = shippingCost.textContent;
    document.getElementById('checkoutDiscount').textContent = discountRow.style.display === 'flex' ? discountAmount.textContent : '$0.00';
    document.getElementById('checkoutTotal').textContent = cartTotal.textContent;
    
    // Show checkout modal
    checkoutModal.classList.add('active');
    document.body.classList.add('modal-open');
    
    // Show first step
    goToStep(0);
}

closeCheckout.addEventListener('click', function() {
    checkoutModal.classList.remove('active');
    document.body.classList.remove('modal-open');
});

// Checkout steps navigation
let currentStep = 0;

function goToStep(step) {
    currentStep = step;
    
    steps.forEach((s, i) => {
        if (i < step) {
            s.classList.add('completed');
            s.classList.remove('active');
        } else if (i === step) {
            s.classList.add('active');
            s.classList.remove('completed');
        } else {
            s.classList.remove('active', 'completed');
        }
    });
    
    stepContents.forEach((content, i) => {
        content.style.display = i === step ? 'block' : 'none';
    });
}

continueShopping.addEventListener('click', function() {
    checkoutModal.classList.remove('active');
    document.body.classList.remove('modal-open');
});

toPaymentBtn.addEventListener('click', function() {
    // Validate shipping form
    const form = document.getElementById('shippingForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    goToStep(1);
});

backToShipping.addEventListener('click', function() {
    goToStep(0);
});

toReviewBtn.addEventListener('click', function() {
    goToStep(2);
});

backToPayment.addEventListener('click', function() {
    goToStep(1);
});

// Payment method selection
paymentMethods.forEach(method => {
    method.addEventListener('change', function() {
        const paymentType = this.value;
        
        paymentForms.forEach(form => {
            form.style.display = form.id === `${paymentType}Form` ? 'block' : 'none';
        });
    });
});

// Shipping option selection
shippingOptions.forEach(option => {
    option.addEventListener('change', function() {
        // Update shipping cost in checkout summary
        const shippingCost = parseFloat(this.dataset.cost);
        document.getElementById('checkoutShipping').textContent = shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`;
        
        // Update total
        const subtotal = parseFloat(document.getElementById('checkoutSubtotal').textContent.replace('$', ''));
        const discount = parseFloat(document.getElementById('checkoutDiscount').textContent.replace('-$', ''));
        const total = subtotal + shippingCost - discount;
        document.getElementById('checkoutTotal').textContent = `$${total.toFixed(2)}`;
    });
});

// Place order
placeOrderBtn.addEventListener('click', function() {
    if (!termsAgree.checked) {
        showNotification('Please agree to terms and conditions');
        return;
    }
    
    // Generate random order number
    const orderNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    orderNumber.textContent = `#${orderNum}`;
    
    // Get customer email
    const email = document.getElementById('email').value;
    confirmationEmail.textContent = email;
    
    // Hide checkout modal and show confirmation
    checkoutModal.classList.remove('active');
    confirmationModal.classList.add('active');
    
    // Clear cart
    cart = [];
    updateCartUI();
});

// Confirmation modal actions
viewOrderBtn.addEventListener('click', function() {
    // In a real app, this would redirect to order status page
    showNotification('Order details would open here');
    closeConfirmationModal();
});

continueBrowsingBtn.addEventListener('click', function() {
    closeConfirmationModal();
});

function closeConfirmationModal() {
    confirmationModal.classList.remove('active');
    document.body.classList.remove('modal-open');
}

// Start shopping from empty cart
startShopping.addEventListener('click', function() {
    cartSidebar.classList.remove('active');
    document.body.classList.remove('sidebar-open');
    
    // Scroll to products section
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
});

// Initialize
window.addEventListener('load', function() {
    // Preselect first payment method
    if (paymentMethods.length > 0) {
        paymentMethods[0].checked = true;
        
        // Show corresponding form
        const paymentType = paymentMethods[0].value;
        paymentForms.forEach(form => {
            form.style.display = form.id === `${paymentType}Form` ? 'block' : 'none';
        });
    }
    
    // Preselect first shipping option
    if (shippingOptions.length > 0) {
        shippingOptions[0].checked = true;
    }
    
    // Initial carousel setup
    updateCarousel();
    
    // Initialize product filtering
    filterProducts();
});

// Responsive adjustments
window.addEventListener('resize', updateCarousel);