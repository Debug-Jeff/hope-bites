// Shopping page functionality
class ShoppingApp {
    constructor() {
        this.products = [];
        this.cart = [];
        this.currentProduct = null;
        this.currentStep = 1;
        this.stripe = null;
        this.cardElement = null;
        this.appliedPromo = null;
        
        this.init();
    }

    async init() {
        await this.initializeStripe();
        await this.loadProducts();
        this.setupEventListeners();
        this.setupCarousel();
        await this.loadCart();
        this.updateCartUI();
    }

    async initializeStripe() {
        try {
            // Initialize Stripe (replace with your publishable key)
            this.stripe = Stripe('pk_test_51234567890abcdef'); // Replace with actual key
            
            // Create card element
            const elements = this.stripe.elements();
            this.cardElement = elements.create('card', {
                style: {
                    base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                            color: '#aab7c4',
                        },
                    },
                },
            });
        } catch (error) {
            console.error('Stripe initialization error:', error);
        }
    }

    async loadProducts() {
        try {
            this.showLoading(true);
            
            // Simulate API call - replace with actual API endpoint
            const response = await fetch('/api/products');
            if (response.ok) {
                const data = await response.json();
                this.products = data.data || [];
            } else {
                // Fallback to sample data if API is not available
                this.products = this.getSampleProducts();
            }
            
            this.displayProducts();
            this.populateCarousel();
            this.showLoading(false);
        } catch (error) {
            console.error('Error loading products:', error);
            this.products = this.getSampleProducts();
            this.displayProducts();
            this.populateCarousel();
            this.showLoading(false);
        }
    }

    getSampleProducts() {
        return [
            {
                _id: '1',
                name: 'Growth Bites Original',
                description: 'Complete nutrition for growing children with essential proteins and minerals.',
                shortDescription: 'Essential nutrients for healthy growth',
                price: 24.99,
                originalPrice: 29.99,
                category: 'Growth Support',
                stock: 150,
                images: [
                    { url: '/assets/img-1.jpg', alt: 'Growth Bites', isPrimary: true },
                    { url: '/assets/fortified-grains.jpg', alt: 'Ingredients' }
                ],
                sizes: [
                    { name: 'Small (200g)', price: 24.99, stock: 50 },
                    { name: 'Medium (400g)', price: 44.99, stock: 75 },
                    { name: 'Large (800g)', price: 79.99, stock: 25 }
                ],
                rating: 4.8,
                numReviews: 156,
                featured: true,
                benefits: ['Supports bone development', 'Enhances muscle growth', 'Boosts energy levels'],
                nutritionFacts: {
                    calories: 120,
                    protein: '8g',
                    carbohydrates: '15g',
                    fat: '3g',
                    fiber: '4g'
                }
            },
            {
                _id: '2',
                name: 'Brain Boost Bites',
                description: 'Omega-3 rich snacks formulated to support cognitive development.',
                shortDescription: 'Cognitive support with omega-3',
                price: 27.99,
                originalPrice: 32.99,
                category: 'Brain Boost',
                stock: 120,
                images: [
                    { url: '/assets/brain-boost-ideas.jpg', alt: 'Brain Boost', isPrimary: true }
                ],
                sizes: [
                    { name: 'Small (200g)', price: 27.99, stock: 40 },
                    { name: 'Medium (400g)', price: 49.99, stock: 60 }
                ],
                rating: 4.7,
                numReviews: 89,
                featured: true,
                benefits: ['Enhances memory', 'Improves focus', 'Supports brain development'],
                nutritionFacts: {
                    calories: 130,
                    protein: '7g',
                    carbohydrates: '16g',
                    fat: '5g',
                    fiber: '3g'
                }
            },
            {
                _id: '3',
                name: 'Immune Support Bites',
                description: 'Vitamin C, D, zinc and elderberry fortified snacks.',
                shortDescription: 'Immune system support',
                price: 26.99,
                category: 'Immune Support',
                stock: 100,
                images: [
                    { url: '/assets/immune-support-foods.jpg', alt: 'Immune Support', isPrimary: true }
                ],
                sizes: [
                    { name: 'Small (200g)', price: 26.99, stock: 35 },
                    { name: 'Medium (400g)', price: 47.99, stock: 45 }
                ],
                rating: 4.6,
                numReviews: 134,
                featured: false,
                benefits: ['Boosts immunity', 'Fights infections', 'Supports recovery'],
                nutritionFacts: {
                    calories: 115,
                    protein: '6g',
                    carbohydrates: '18g',
                    fat: '2g',
                    fiber: '5g'
                }
            }
        ];
    }

    displayProducts() {
        const productGrid = document.getElementById('productGrid');
        const noProducts = document.getElementById('noProducts');
        
        if (this.products.length === 0) {
            productGrid.innerHTML = '';
            noProducts.style.display = 'block';
            return;
        }
        
        noProducts.style.display = 'none';
        
        productGrid.innerHTML = this.products.map(product => {
            const primaryImage = product.images?.find(img => img.isPrimary)?.url || 
                                product.images?.[0]?.url || '/assets/img-1.jpg';
            const discountPercentage = product.originalPrice ? 
                Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
            
            return `
                <div class="product-card" data-product-id="${product._id}">
                    <div class="product-image">
                        <img src="${primaryImage}" alt="${product.name}" loading="lazy">
                        <div class="product-badges">
                            ${product.featured ? '<span class="badge bestseller">Best Seller</span>' : ''}
                            ${discountPercentage > 0 ? '<span class="badge new">Sale</span>' : ''}
                        </div>
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p class="product-short-desc">${product.shortDescription || product.description.substring(0, 80) + '...'}</p>
                        <div class="product-price">
                            <span class="price">$${product.price}</span>
                            ${product.originalPrice ? `<span class="price-per">was $${product.originalPrice}</span>` : ''}
                        </div>
                        <div class="product-actions">
                            <button class="view-details-btn" onclick="shoppingApp.openProductModal('${product._id}')">
                                View Details
                            </button>
                            <button class="add-to-cart" onclick="shoppingApp.quickAddToCart('${product._id}')" 
                                    ${product.stock === 0 ? 'disabled' : ''}>
                                <i class='bx bx-cart-add'></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    populateCarousel() {
        const featuredProducts = this.products.filter(p => p.featured).slice(0, 3);
        const carouselTrack = document.getElementById('carouselTrack');
        const carouselIndicators = document.getElementById('carouselIndicators');
        
        if (featuredProducts.length === 0) return;
        
        carouselTrack.innerHTML = featuredProducts.map(product => {
            const primaryImage = product.images?.find(img => img.isPrimary)?.url || 
                                product.images?.[0]?.url || '/assets/img-1.jpg';
            
            return `
                <div class="carousel-slide">
                    <img src="${primaryImage}" alt="${product.name}">
                    <div class="slide-content">
                        <h2>${product.name}</h2>
                        <p>${product.description}</p>
                        <a href="#" class="btn" onclick="shoppingApp.openProductModal('${product._id}')">Shop Now</a>
                    </div>
                </div>
            `;
        }).join('');
        
        carouselIndicators.innerHTML = featuredProducts.map((_, index) => 
            `<div class="indicator ${index === 0 ? 'active' : ''}" data-slide="${index}"></div>`
        ).join('');
    }

    setupCarousel() {
        let currentSlide = 0;
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.indicator');
        const track = document.getElementById('carouselTrack');
        
        if (slides.length === 0) return;
        
        const updateCarousel = () => {
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentSlide);
            });
        };
        
        document.getElementById('nextBtn').addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateCarousel();
        });
        
        document.getElementById('prevBtn').addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateCarousel();
        });
        
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentSlide = index;
                updateCarousel();
            });
        });
        
        // Auto-advance carousel
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateCarousel();
        }, 5000);
    }

    setupEventListeners() {
        // Filter and search
        document.getElementById('categoryFilter').addEventListener('change', () => this.filterProducts());
        document.getElementById('priceFilter').addEventListener('change', () => this.filterProducts());
        document.getElementById('sortFilter').addEventListener('change', () => this.sortProducts());
        document.getElementById('searchBtn').addEventListener('click', () => this.searchProducts());
        document.getElementById('productSearch').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchProducts();
        });

        // Cart functionality
        document.getElementById('cartToggle').addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleCart();
        });
        document.getElementById('closeCart').addEventListener('click', () => this.closeCart());
        document.getElementById('startShopping').addEventListener('click', () => this.closeCart());

        // Product modal
        document.getElementById('closeModal').addEventListener('click', () => this.closeProductModal());
        document.getElementById('addToCartBtn').addEventListener('click', () => this.addToCartFromModal());

        // Quantity controls
        document.getElementById('decreaseQty').addEventListener('click', () => this.updateQuantity(-1));
        document.getElementById('increaseQty').addEventListener('click', () => this.updateQuantity(1));

        // Checkout
        document.getElementById('checkoutBtn').addEventListener('click', () => this.openCheckout());
        document.getElementById('closeCheckoutModal').addEventListener('click', () => this.closeCheckout());

        // Checkout navigation
        document.getElementById('nextStepBtn').addEventListener('click', () => this.nextCheckoutStep());
        document.getElementById('prevStepBtn').addEventListener('click', () => this.prevCheckoutStep());
        document.getElementById('placeOrderBtn').addEventListener('click', () => this.placeOrder());

        // Payment method selection
        document.querySelectorAll('.payment-method').forEach(method => {
            method.addEventListener('click', () => this.selectPaymentMethod(method.dataset.method));
        });

        // Promo code
        document.getElementById('applyPromoBtn').addEventListener('click', () => this.applyPromoCode());

        // Close modals when clicking overlay
        document.getElementById('overlay').addEventListener('click', () => {
            this.closeProductModal();
            this.closeCart();
            this.closeCheckout();
        });

        // Newsletter subscription
        document.getElementById('subscribeBtn').addEventListener('click', () => this.subscribeNewsletter());
    }

    filterProducts() {
        const category = document.getElementById('categoryFilter').value;
        const priceRange = document.getElementById('priceFilter').value;
        
        let filtered = [...this.products];
        
        if (category) {
            filtered = filtered.filter(p => p.category === category);
        }
        
        if (priceRange) {
            const [min, max] = priceRange.split('-').map(p => p === '+' ? Infinity : parseFloat(p));
            filtered = filtered.filter(p => p.price >= min && (max === undefined || p.price <= max));
        }
        
        this.products = filtered;
        this.displayProducts();
    }

    sortProducts() {
        const sortBy = document.getElementById('sortFilter').value;
        
        switch (sortBy) {
            case 'name':
                this.products.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'price-low':
                this.products.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.products.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                this.products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'newest':
                this.products.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                break;
            default: // featured
                this.products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        }
        
        this.displayProducts();
    }

    searchProducts() {
        const query = document.getElementById('productSearch').value.toLowerCase();
        if (!query) {
            this.loadProducts();
            return;
        }
        
        this.products = this.products.filter(p => 
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );
        
        this.displayProducts();
    }

    openProductModal(productId) {
        this.currentProduct = this.products.find(p => p._id === productId);
        if (!this.currentProduct) return;
        
        this.populateProductModal();
        document.getElementById('productModal').style.display = 'block';
        document.getElementById('overlay').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    populateProductModal() {
        const product = this.currentProduct;
        
        // Basic info
        document.getElementById('modalProductName').textContent = product.name;
        document.getElementById('modalCurrentPrice').textContent = `$${product.price}`;
        document.getElementById('modalProductDescription').textContent = product.description;
        
        // Original price and discount
        const originalPriceEl = document.getElementById('modalOriginalPrice');
        const discountBadgeEl = document.getElementById('modalDiscountBadge');
        
        if (product.originalPrice && product.originalPrice > product.price) {
            originalPriceEl.textContent = `$${product.originalPrice}`;
            originalPriceEl.style.display = 'inline';
            
            const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
            discountBadgeEl.textContent = `${discount}% OFF`;
            discountBadgeEl.style.display = 'inline';
        } else {
            originalPriceEl.style.display = 'none';
            discountBadgeEl.style.display = 'none';
        }
        
        // Images
        const mainImage = document.getElementById('mainProductImage');
        const thumbnailContainer = document.getElementById('thumbnailContainer');
        
        if (product.images && product.images.length > 0) {
            const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
            mainImage.src = primaryImage.url;
            mainImage.alt = primaryImage.alt || product.name;
            
            if (product.images.length > 1) {
                thumbnailContainer.innerHTML = product.images.map((img, index) => 
                    `<img src="${img.url}" alt="${img.alt}" class="thumbnail ${index === 0 ? 'active' : ''}" 
                          onclick="shoppingApp.changeMainImage('${img.url}', ${index})">`
                ).join('');
            } else {
                thumbnailContainer.innerHTML = '';
            }
        }
        
        // Rating
        this.displayRating('modalProductRating', product.rating || 0, product.numReviews || 0);
        
        // Benefits
        const benefitsList = document.getElementById('benefitsList');
        if (product.benefits && product.benefits.length > 0) {
            benefitsList.innerHTML = product.benefits.map(benefit => `<li>${benefit}</li>`).join('');
            document.getElementById('modalProductBenefits').style.display = 'block';
        } else {
            document.getElementById('modalProductBenefits').style.display = 'none';
        }
        
        // Nutrition facts
        const nutritionTableBody = document.getElementById('nutritionTableBody');
        if (product.nutritionFacts) {
            const facts = product.nutritionFacts;
            nutritionTableBody.innerHTML = `
                ${facts.calories ? `<tr><td>Calories</td><td>${facts.calories}</td></tr>` : ''}
                ${facts.protein ? `<tr><td>Protein</td><td>${facts.protein}</td></tr>` : ''}
                ${facts.carbohydrates ? `<tr><td>Carbohydrates</td><td>${facts.carbohydrates}</td></tr>` : ''}
                ${facts.fat ? `<tr><td>Fat</td><td>${facts.fat}</td></tr>` : ''}
                ${facts.fiber ? `<tr><td>Fiber</td><td>${facts.fiber}</td></tr>` : ''}
            `;
            document.getElementById('modalNutritionFacts').style.display = 'block';
        } else {
            document.getElementById('modalNutritionFacts').style.display = 'none';
        }
        
        // Size options
        const sizeOptions = document.getElementById('sizeOptions');
        const sizeSelector = document.getElementById('sizeSelector');
        
        if (product.sizes && product.sizes.length > 0) {
            sizeSelector.innerHTML = product.sizes.map((size, index) => 
                `<button class="size-btn ${index === 0 ? 'active' : ''}" 
                         data-size="${size.name}" data-price="${size.price}" data-stock="${size.stock}"
                         onclick="shoppingApp.selectSize(this)">
                    ${size.name} - $${size.price}
                </button>`
            ).join('');
            sizeOptions.style.display = 'block';
        } else {
            sizeOptions.style.display = 'none';
        }
        
        // Reset quantity
        document.getElementById('productQuantity').value = 1;
    }

    changeMainImage(url, index) {
        document.getElementById('mainProductImage').src = url;
        document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }

    selectSize(button) {
        document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update price display
        const price = parseFloat(button.dataset.price);
        document.getElementById('modalCurrentPrice').textContent = `$${price}`;
        
        // Update max quantity based on stock
        const stock = parseInt(button.dataset.stock);
        const quantityInput = document.getElementById('productQuantity');
        quantityInput.max = stock;
        if (parseInt(quantityInput.value) > stock) {
            quantityInput.value = stock;
        }
    }

    updateQuantity(change) {
        const quantityInput = document.getElementById('productQuantity');
        const currentValue = parseInt(quantityInput.value);
        const newValue = Math.max(1, Math.min(parseInt(quantityInput.max) || 10, currentValue + change));
        quantityInput.value = newValue;
    }

    displayRating(containerId, rating, numReviews) {
        const container = document.getElementById(containerId);
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        let starsHtml = '';
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                starsHtml += '<i class="bx bxs-star"></i>';
            } else if (i === fullStars && hasHalfStar) {
                starsHtml += '<i class="bx bxs-star-half"></i>';
            } else {
                starsHtml += '<i class="bx bx-star"></i>';
            }
        }
        
        container.innerHTML = `${starsHtml} <span>(${numReviews} reviews)</span>`;
    }

    closeProductModal() {
        document.getElementById('productModal').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
        document.body.style.overflow = 'auto';
        this.currentProduct = null;
    }

    async quickAddToCart(productId) {
        const product = this.products.find(p => p._id === productId);
        if (!product) return;
        
        await this.addToCart(product, 1);
        this.showNotification('Product added to cart!', 'success');
    }

    async addToCartFromModal() {
        if (!this.currentProduct) return;
        
        const quantity = parseInt(document.getElementById('productQuantity').value);
        const selectedSizeBtn = document.querySelector('.size-btn.active');
        const size = selectedSizeBtn ? selectedSizeBtn.dataset.size : null;
        
        await this.addToCart(this.currentProduct, quantity, size);
        this.closeProductModal();
        this.showNotification('Product added to cart!', 'success');
    }

    async addToCart(product, quantity = 1, size = null) {
        try {
            // Check if user is logged in (for API calls)
            const token = localStorage.getItem('authToken');
            
            if (token) {
                // Make API call to add to cart
                const response = await fetch('/api/cart/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        productId: product._id,
                        quantity,
                        size
                    })
                });
                
                if (response.ok) {
                    await this.loadCart();
                    return;
                }
            }
            
            // Fallback to local storage
            const existingItemIndex = this.cart.findIndex(
                item => item.product._id === product._id && item.size === size
            );
            
            if (existingItemIndex > -1) {
                this.cart[existingItemIndex].quantity += quantity;
            } else {
                this.cart.push({
                    _id: Date.now().toString(),
                    product,
                    quantity,
                    size,
                    price: this.getProductPrice(product, size)
                });
            }
            
            this.saveCartToStorage();
            this.updateCartUI();
        } catch (error) {
            console.error('Error adding to cart:', error);
            this.showNotification('Error adding product to cart', 'error');
        }
    }

    getProductPrice(product, size) {
        if (size && product.sizes) {
            const sizeOption = product.sizes.find(s => s.name === size);
            return sizeOption ? sizeOption.price : product.price;
        }
        return product.price;
    }

    async loadCart() {
        try {
            const token = localStorage.getItem('authToken');
            
            if (token) {
                const response = await fetch('/api/cart', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    this.cart = data.data.items || [];
                    this.updateCartUI();
                    return;
                }
            }
            
            // Fallback to local storage
            const savedCart = localStorage.getItem('hopeBitesCart');
            this.cart = savedCart ? JSON.parse(savedCart) : [];
            this.updateCartUI();
        } catch (error) {
            console.error('Error loading cart:', error);
            this.cart = [];
            this.updateCartUI();
        }
    }

    saveCartToStorage() {
        localStorage.setItem('hopeBitesCart', JSON.stringify(this.cart));
    }

    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const cartSummary = document.getElementById('cartSummary');
        const emptyCartMessage = document.getElementById('emptyCartMessage');
        
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        if (this.cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            cartSummary.style.display = 'none';
            cartItems.innerHTML = '<div class="empty-cart-message" id="emptyCartMessage"><i class="bx bx-cart"></i><p>Your cart is empty</p><button class="start-shopping-btn" onclick="shoppingApp.closeCart()">Start Shopping</button></div>';
            return;
        }
        
        emptyCartMessage.style.display = 'none';
        cartSummary.style.display = 'block';
        
        // Render cart items
        cartItems.innerHTML = this.cart.map(item => {
            const primaryImage = item.product.images?.find(img => img.isPrimary)?.url || 
                                item.product.images?.[0]?.url || '/assets/img-1.jpg';
            
            return `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${primaryImage}" alt="${item.product.name}">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.product.name}</div>
                        ${item.size ? `<div class="cart-item-size">${item.size}</div>` : ''}
                        <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="cart-quantity-btn" onclick="shoppingApp.updateCartItemQuantity('${item._id}', ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button class="cart-quantity-btn" onclick="shoppingApp.updateCartItemQuantity('${item._id}', ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <button class="remove-item" onclick="shoppingApp.removeFromCart('${item._id}')">
                        <i class='bx bx-trash'></i>
                    </button>
                </div>
            `;
        }).join('');
        
        // Update cart summary
        this.updateCartSummary();
    }

    updateCartSummary() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.08; // 8% tax
        const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
        
        let discount = 0;
        if (this.appliedPromo) {
            if (this.appliedPromo.type === 'percentage') {
                discount = subtotal * this.appliedPromo.discount;
            } else {
                discount = this.appliedPromo.discount;
            }
        }
        
        const total = subtotal - discount + tax + shipping;
        
        document.getElementById('cartSubtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('cartTax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('cartShipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
        document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
        
        const discountRow = document.getElementById('discountRow');
        if (discount > 0) {
            document.getElementById('cartDiscount').textContent = `-$${discount.toFixed(2)}`;
            discountRow.style.display = 'flex';
        } else {
            discountRow.style.display = 'none';
        }
    }

    async updateCartItemQuantity(itemId, newQuantity) {
        if (newQuantity < 1) {
            this.removeFromCart(itemId);
            return;
        }
        
        try {
            const token = localStorage.getItem('authToken');
            
            if (token) {
                const response = await fetch(`/api/cart/update/${itemId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ quantity: newQuantity })
                });
                
                if (response.ok) {
                    await this.loadCart();
                    return;
                }
            }
            
            // Fallback to local storage
            const itemIndex = this.cart.findIndex(item => item._id === itemId);
            if (itemIndex > -1) {
                this.cart[itemIndex].quantity = newQuantity;
                this.saveCartToStorage();
                this.updateCartUI();
            }
        } catch (error) {
            console.error('Error updating cart item:', error);
        }
    }

    async removeFromCart(itemId) {
        try {
            const token = localStorage.getItem('authToken');
            
            if (token) {
                const response = await fetch(`/api/cart/remove/${itemId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    await this.loadCart();
                    return;
                }
            }
            
            // Fallback to local storage
            this.cart = this.cart.filter(item => item._id !== itemId);
            this.saveCartToStorage();
            this.updateCartUI();
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    }

    async applyPromoCode() {
        const code = document.getElementById('promoCodeInput').value.trim();
        if (!code) return;
        
        try {
            const response = await fetch('/api/cart/promo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code })
            });
            
            if (response.ok) {
                const data = await response.json();
                this.appliedPromo = data.data;
                this.updateCartSummary();
                this.showNotification(`Promo code applied: ${data.data.description}`, 'success');
            } else {
                this.showNotification('Invalid promo code', 'error');
            }
        } catch (error) {
            // Fallback promo codes
            const promoCodes = {
                'WELCOME10': { discount: 0.10, type: 'percentage', description: '10% off your order' },
                'FREESHIP': { discount: 5.99, type: 'fixed', description: 'Free shipping' }
            };
            
            const promo = promoCodes[code.toUpperCase()];
            if (promo) {
                this.appliedPromo = promo;
                this.updateCartSummary();
                this.showNotification(`Promo code applied: ${promo.description}`, 'success');
            } else {
                this.showNotification('Invalid promo code', 'error');
            }
        }
    }

    toggleCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('overlay');
        
        cartSidebar.classList.toggle('open');
        overlay.style.display = cartSidebar.classList.contains('open') ? 'block' : 'none';
        
        if (cartSidebar.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }

    closeCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('overlay');
        
        cartSidebar.classList.remove('open');
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    openCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty', 'error');
            return;
        }
        
        this.closeCart();
        document.getElementById('checkoutModal').classList.add('active');
        document.getElementById('overlay').style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        this.currentStep = 1;
        this.updateCheckoutStep();
        this.populateOrderReview();
    }

    closeCheckout() {
        document.getElementById('checkoutModal').classList.remove('active');
        document.getElementById('overlay').style.display = 'none';
        document.body.style.overflow = 'auto';
        this.currentStep = 1;
    }

    nextCheckoutStep() {
        if (this.currentStep === 1 && !this.validateShippingForm()) {
            return;
        }
        
        if (this.currentStep === 2 && !this.validatePaymentForm()) {
            return;
        }
        
        this.currentStep++;
        this.updateCheckoutStep();
        
        if (this.currentStep === 3) {
            this.populateOrderReview();
        }
    }

    prevCheckoutStep() {
        this.currentStep--;
        this.updateCheckoutStep();
    }

    updateCheckoutStep() {
        // Update step indicators
        document.querySelectorAll('.step').forEach((step, index) => {
            step.classList.toggle('active', index + 1 === this.currentStep);
        });
        
        // Show/hide step content
        document.querySelectorAll('.checkout-step-content').forEach((content, index) => {
            content.classList.toggle('hidden', index + 1 !== this.currentStep);
        });
        
        // Update navigation buttons
        const prevBtn = document.getElementById('prevStepBtn');
        const nextBtn = document.getElementById('nextStepBtn');
        const placeOrderBtn = document.getElementById('placeOrderBtn');
        
        prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
        nextBtn.style.display = this.currentStep < 3 ? 'block' : 'none';
        placeOrderBtn.style.display = this.currentStep === 3 ? 'block' : 'none';
        
        // Mount Stripe card element on step 2
        if (this.currentStep === 2 && this.cardElement) {
            setTimeout(() => {
                const cardElementContainer = document.getElementById('cardElement');
                if (cardElementContainer && !cardElementContainer.hasChildNodes()) {
                    this.cardElement.mount('#cardElement');
                }
            }, 100);
        }
    }

    validateShippingForm() {
        const form = document.getElementById('shippingForm');
        const formData = new FormData(form);
        
        for (let [key, value] of formData.entries()) {
            if (!value.trim()) {
                this.showNotification('Please fill in all required fields', 'error');
                return false;
            }
        }
        
        return true;
    }

    validatePaymentForm() {
        const selectedMethod = document.querySelector('.payment-method.active').dataset.method;
        
        if (selectedMethod === 'stripe') {
            const cardName = document.getElementById('cardName').value.trim();
            if (!cardName) {
                this.showNotification('Please enter the name on card', 'error');
                return false;
            }
        }
        
        return true;
    }

    selectPaymentMethod(method) {
        document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
        document.querySelector(`[data-method="${method}"]`).classList.add('active');
        
        document.querySelectorAll('.payment-form').forEach(form => form.classList.add('hidden'));
        document.getElementById(`${method}PaymentForm`).classList.remove('hidden');
    }

    populateOrderReview() {
        // Order items
        const orderItemsList = document.getElementById('orderItemsList');
        orderItemsList.innerHTML = this.cart.map(item => {
            const primaryImage = item.product.images?.find(img => img.isPrimary)?.url || 
                                item.product.images?.[0]?.url || '/assets/img-1.jpg';
            
            return `
                <div class="order-item">
                    <img src="${primaryImage}" alt="${item.product.name}" class="order-item-image">
                    <div class="order-item-details">
                        <div class="order-item-name">${item.product.name}</div>
                        <div class="order-item-info">Qty: ${item.quantity}${item.size ? ` | Size: ${item.size}` : ''}</div>
                    </div>
                    <div class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `;
        }).join('');
        
        // Shipping address
        const formData = new FormData(document.getElementById('shippingForm'));
        const shippingAddress = `
            ${formData.get('firstName')} ${formData.get('lastName')}<br>
            ${formData.get('address')}<br>
            ${formData.get('city')}, ${formData.get('state')} ${formData.get('zipCode')}<br>
            ${formData.get('country')}
        `;
        document.getElementById('shippingAddressReview').innerHTML = shippingAddress;
        
        // Payment method
        const selectedMethod = document.querySelector('.payment-method.active');
        document.getElementById('paymentMethodReview').textContent = selectedMethod.textContent.trim();
        
        // Update totals
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.08;
        const shippingCost = this.getShippingCost();
        
        let discount = 0;
        if (this.appliedPromo) {
            if (this.appliedPromo.type === 'percentage') {
                discount = subtotal * this.appliedPromo.discount;
            } else {
                discount = this.appliedPromo.discount;
            }
        }
        
        const total = subtotal - discount + tax + shippingCost;
        
        document.getElementById('reviewSubtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('reviewShipping').textContent = shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`;
        document.getElementById('reviewTax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('reviewTotal').textContent = `$${total.toFixed(2)}`;
        
        const reviewDiscountRow = document.getElementById('reviewDiscountRow');
        if (discount > 0) {
            document.getElementById('reviewDiscount').textContent = `-$${discount.toFixed(2)}`;
            reviewDiscountRow.style.display = 'flex';
        } else {
            reviewDiscountRow.style.display = 'none';
        }
    }

    getShippingCost() {
        const selectedShipping = document.querySelector('input[name="shipping"]:checked');
        if (!selectedShipping) return 5.99;
        
        switch (selectedShipping.value) {
            case 'standard': return 5.99;
            case 'express': return 12.99;
            case 'overnight': return 24.99;
            default: return 5.99;
        }
    }

    async placeOrder() {
        const termsCheckbox = document.getElementById('termsCheckbox');
        if (!termsCheckbox.checked) {
            this.showNotification('Please accept the terms and conditions', 'error');
            return;
        }
        
        try {
            this.showLoading(true, 'Processing your order...');
            
            const selectedPaymentMethod = document.querySelector('.payment-method.active').dataset.method;
            
            if (selectedPaymentMethod === 'stripe') {
                await this.processStripePayment();
            } else if (selectedPaymentMethod === 'paypal') {
                await this.processPayPalPayment();
            }
        } catch (error) {
            console.error('Order placement error:', error);
            this.showNotification('Error processing your order. Please try again.', 'error');
            this.showLoading(false);
        }
    }

    async processStripePayment() {
        try {
            const total = this.calculateOrderTotal();
            
            // Create payment intent
            const response = await fetch('/api/payment/stripe/create-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
                },
                body: JSON.stringify({
                    amount: total,
                    currency: 'usd'
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to create payment intent');
            }
            
            const { clientSecret } = await response.json();
            
            // Confirm payment with Stripe
            const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: this.cardElement,
                    billing_details: {
                        name: document.getElementById('cardName').value,
                    },
                }
            });
            
            if (error) {
                throw new Error(error.message);
            }
            
            if (paymentIntent.status === 'succeeded') {
                await this.completeOrder(paymentIntent.id);
            }
        } catch (error) {
            throw error;
        }
    }

    async processPayPalPayment() {
        // PayPal integration would go here
        // For demo purposes, we'll simulate a successful payment
        setTimeout(async () => {
            await this.completeOrder('paypal_demo_payment_id');
        }, 2000);
    }

    async completeOrder(paymentId) {
        try {
            // Create order in database
            const orderData = this.buildOrderData(paymentId);
            
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
                },
                body: JSON.stringify(orderData)
            });
            
            let orderId;
            if (response.ok) {
                const data = await response.json();
                orderId = data.data._id;
            } else {
                // Fallback for demo
                orderId = 'ORDER_' + Date.now();
            }
            
            // Clear cart
            this.cart = [];
            this.saveCartToStorage();
            this.updateCartUI();
            
            // Show confirmation
            this.showOrderConfirmation(orderId);
            
        } catch (error) {
            console.error('Error completing order:', error);
            // Still show confirmation for demo purposes
            this.showOrderConfirmation('ORDER_' + Date.now());
        }
    }

    buildOrderData(paymentId) {
        const formData = new FormData(document.getElementById('shippingForm'));
        const selectedShipping = document.querySelector('input[name="shipping"]:checked');
        
        return {
            orderItems: this.cart.map(item => ({
                product: item.product._id,
                name: item.product.name,
                quantity: item.quantity,
                price: item.price,
                size: item.size,
                image: item.product.images?.[0]?.url || '/assets/img-1.jpg'
            })),
            shippingInfo: {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                city: formData.get('city'),
                state: formData.get('state'),
                zipCode: formData.get('zipCode'),
                country: formData.get('country')
            },
            paymentMethod: document.querySelector('.payment-method.active').textContent.trim(),
            paymentResult: {
                id: paymentId,
                status: 'completed'
            },
            shippingMethod: selectedShipping ? selectedShipping.value : 'standard',
            taxPrice: this.calculateOrderTotal() * 0.08,
            shippingPrice: this.getShippingCost(),
            totalPrice: this.calculateOrderTotal()
        };
    }

    calculateOrderTotal() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.08;
        const shipping = this.getShippingCost();
        
        let discount = 0;
        if (this.appliedPromo) {
            if (this.appliedPromo.type === 'percentage') {
                discount = subtotal * this.appliedPromo.discount;
            } else {
                discount = this.appliedPromo.discount;
            }
        }
        
        return subtotal - discount + tax + shipping;
    }

    showOrderConfirmation(orderId) {
        this.showLoading(false);
        this.closeCheckout();
        
        document.getElementById('orderNumber').textContent = orderId;
        document.getElementById('confirmationEmail').textContent = 
            document.getElementById('email').value || 'customer@example.com';
        
        const selectedShipping = document.querySelector('input[name="shipping"]:checked');
        let deliveryTime = '5-7 business days';
        if (selectedShipping) {
            switch (selectedShipping.value) {
                case 'express': deliveryTime = '2-3 business days'; break;
                case 'overnight': deliveryTime = '1 business day'; break;
            }
        }
        document.getElementById('estimatedDelivery').textContent = deliveryTime;
        
        document.getElementById('confirmationModal').classList.add('active');
        document.getElementById('overlay').style.display = 'block';
        
        // Setup confirmation modal buttons
        document.getElementById('continueShoppingBtn').onclick = () => {
            document.getElementById('confirmationModal').classList.remove('active');
            document.getElementById('overlay').style.display = 'none';
            document.body.style.overflow = 'auto';
        };
        
        document.getElementById('viewOrderBtn').onclick = () => {
            // Redirect to order details page (would be implemented)
            alert('Order details page would open here');
        };
    }

    async subscribeNewsletter() {
        const email = document.getElementById('newsletterEmail').value.trim();
        if (!email) {
            this.showNotification('Please enter your email address', 'error');
            return;
        }
        
        // Simulate newsletter subscription
        try {
            // In a real app, this would call an API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.showNotification('Successfully subscribed to newsletter!', 'success');
            document.getElementById('newsletterEmail').value = '';
        } catch (error) {
            this.showNotification('Error subscribing to newsletter', 'error');
        }
    }

    showLoading(show, message = 'Loading...') {
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (show) {
            loadingIndicator.style.display = 'block';
            loadingIndicator.querySelector('p').textContent = message;
        } else {
            loadingIndicator.style.display = 'none';
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="bx ${type === 'success' ? 'bx-check-circle' : type === 'error' ? 'bx-error-circle' : 'bx-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize the shopping app when the page loads
let shoppingApp;
document.addEventListener('DOMContentLoaded', () => {
    shoppingApp = new ShoppingApp();
});