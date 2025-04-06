// Part 1 -- Product Display and Interaction
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements - Navigation
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    
    // DOM Elements - Carousel
    const carouselTrack = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const carouselIndicators = document.getElementById('carouselIndicators');
    
    // DOM Elements - Filtering
    const categoryFilter = document.getElementById('categoryFilter');
    const ageFilter = document.getElementById('ageFilter');
    const sortBy = document.getElementById('sortBy');
    const productSearch = document.getElementById('productSearch');
    const searchBtn = document.getElementById('searchBtn');
    
    // DOM Elements - Product Modal
    const productModal = document.getElementById('productModal');
    const closeModal = document.querySelector('.close-modal');
    const modalMainImage = document.getElementById('modalMainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
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
    
    // DOM Elements - Cart
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
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const viewDetailsBtns = document.querySelectorAll('.view-details-btn');
    
    // Product Data (Sample data - would normally come from your database)
    const products = [
        {
            id: 'fruit1',
            name: 'Mixed Berry Bites',
            shortDesc: 'Mixed fruit snack with added vitamins',
            fullDesc: 'Our Mixed Berry Bites are packed with real fruit and fortified with essential vitamins and minerals to support your child\'s growth and development. Made with organic berries and no artificial preservatives.',
            price: 12.99,
            originalPrice: 15.99,
            category: 'fruit',
            age: 'kids',
            image: 'assets/img-1.jpg',
            isNew: true,
            isBestseller: true,
            benefits: [
                'Rich in Vitamin C and antioxidants',
                'No artificial colors or flavors',
                'Supports immune system health',
                'Great for lunchboxes and on-the-go snacking'
            ],
            nutrition: [
                { nutrient: 'Calories', amount: '80', dailyValue: '-' },
                { nutrient: 'Protein', amount: '1g', dailyValue: '2%' },
                { nutrient: 'Vitamin C', amount: '45mg', dailyValue: '50%' },
                { nutrient: 'Fiber', amount: '3g', dailyValue: '12%' }
            ]
        },
        {
            id: 'fruit2',
            name: 'Apple Cinnamon Crisps',
            shortDesc: 'Crispy apple snacks with a hint of cinnamon',
            fullDesc: 'Crunchy, delicious apple slices with just a touch of cinnamon. These crisps are baked, not fried, making them a healthier alternative to traditional chips. Perfect for satisfying those crunchy cravings!',
            price: 10.99,
            originalPrice: 10.99,
            category: 'fruit',
            age: 'toddler',
            image: 'assets/img-1.jpg',
            isNew: false,
            isBestseller: false,
            benefits: [
                'Made with real apples',
                'Good source of fiber',
                'No added sugar',
                'Satisfying crunch kids love'
            ],
            nutrition: [
                { nutrient: 'Calories', amount: '70', dailyValue: '-' },
                { nutrient: 'Protein', amount: '0.5g', dailyValue: '1%' },
                { nutrient: 'Fiber', amount: '4g', dailyValue: '16%' },
                { nutrient: 'Vitamin A', amount: '80IU', dailyValue: '2%' }
            ]
        },
        {
            id: 'protein1',
            name: 'Chocolate Chip Protein Bar',
            shortDesc: 'Delicious protein bar with chocolate chips',
            fullDesc: 'Our Chocolate Chip Protein Bars are a delicious way to give your kids the protein they need for growth and development. Each bar contains 8g of protein and is made with real chocolate chips for a treat they\'ll love.',
            price: 14.99,
            originalPrice: 17.99,
            category: 'protein',
            age: 'kids',
            image: 'assets/img-1.jpg',
            isNew: false,
            isBestseller: false,
            benefits: [
                '8g of protein per bar',
                'Made with real chocolate chips',
                'No artificial sweeteners',
                'Supports muscle development'
            ],
            nutrition: [
                { nutrient: 'Calories', amount: '150', dailyValue: '-' },
                { nutrient: 'Protein', amount: '8g', dailyValue: '16%' },
                { nutrient: 'Carbs', amount: '15g', dailyValue: '5%' },
                { nutrient: 'Calcium', amount: '100mg', dailyValue: '10%' }
            ]
        }
    ];
    
    // Cart Data
    let cart = [];
    let currentDiscount = 0;
    let selectedSize = 'small';
    let currentProduct = null;
    
    // Initialize the page
    function init() {
        setupCarousel();
        setupMobileNav();
        setupProductFilters();
        setupProductModal();
        setupCart();
        loadCartFromStorage();
        updateCartDisplay();
    }
    
    // 1. CAROUSEL FUNCTIONALITY
    function setupCarousel() {
        if (!carouselTrack) return;
        
        const slides = document.querySelectorAll('.carousel-slide');
        const slideWidth = slides[0].getBoundingClientRect().width;
        let currentSlide = 0;
        let autoSlideInterval;
        
        // Position slides next to each other
        slides.forEach((slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        });
        
        // Create indicators
        slides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => {
                goToSlide(index);
                resetAutoSlide();
            });
            carouselIndicators.appendChild(indicator);
        });
        
        // Function to move to a specific slide
        function goToSlide(slideIndex) {
            if (slideIndex < 0) slideIndex = slides.length - 1;
            if (slideIndex >= slides.length) slideIndex = 0;
            
            carouselTrack.style.transform = `translateX(-${slideWidth * slideIndex}px)`;
            
            // Update indicators
            document.querySelectorAll('.indicator').forEach((indicator, index) => {
                indicator.classList.toggle('active', index === slideIndex);
            });
            
            currentSlide = slideIndex;
        }
        
        // Event listeners for prev/next buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToSlide(currentSlide - 1);
                resetAutoSlide();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goToSlide(currentSlide + 1);
                resetAutoSlide();
            });
        }
        
        // Auto slide functionality
        function startAutoSlide() {
            autoSlideInterval = setInterval(() => {
                goToSlide(currentSlide + 1);
            }, 5000); // Change slide every 5 seconds
        }
        
        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }
        
        // Start auto sliding
        startAutoSlide();
    }
    
    // 2. MOBILE NAVIGATION
    function setupMobileNav() {
        if (!mobileToggle || !navLinks) return;
        
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Change icon based on menu state
            const icon = mobileToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('bx-menu');
                icon.classList.add('bx-x');
            } else {
                icon.classList.remove('bx-x');
                icon.classList.add('bx-menu');
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && 
                !navLinks.contains(e.target) && 
                e.target !== mobileToggle) {
                navLinks.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('bx-x');
                icon.classList.add('bx-menu');
            }
        });
    }
    
    // 3. PRODUCT FILTERING
    function setupProductFilters() {
        // Get all product cards
        const productCards = document.querySelectorAll('.product-card');
        if (!productCards.length) return;
        
        // Filter by category
        if (categoryFilter) {
            categoryFilter.addEventListener('change', applyFilters);
        }
        
        // Filter by age group
        if (ageFilter) {
            ageFilter.addEventListener('change', applyFilters);
        }
        
        // Sort products
        if (sortBy) {
            sortBy.addEventListener('change', applyFilters);
        }
        
        // Search products
        if (searchBtn && productSearch) {
            searchBtn.addEventListener('click', applyFilters);
            productSearch.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    applyFilters();
                }
            });
        }
        
        function applyFilters() {
            const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
            const selectedAge = ageFilter ? ageFilter.value : 'all';
            const selectedSort = sortBy ? sortBy.value : 'popular';
            const searchQuery = productSearch ? productSearch.value.toLowerCase() : '';
            
            // Filter and sort products
            productCards.forEach(card => {
                const category = card.dataset.category;
                const age = card.dataset.age;
                const name = card.querySelector('h3').textContent.toLowerCase();
                const desc = card.querySelector('.product-short-desc').textContent.toLowerCase();
                
                // Check if card matches all filters
                const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
                const matchesAge = selectedAge === 'all' || age === selectedAge;
                const matchesSearch = searchQuery === '' || 
                                     name.includes(searchQuery) || 
                                     desc.includes(searchQuery);
                
                // Show or hide based on filters
                if (matchesCategory && matchesAge && matchesSearch) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Apply sorting
            const productGrid = document.querySelector('.product-grid');
            if (!productGrid) return;
            
            const sortedCards = Array.from(productCards).filter(card => card.style.display !== 'none');
            
            switch (selectedSort) {
                case 'price-low':
                    sortedCards.sort((a, b) => {
                        const priceA = parseFloat(a.querySelector('.price').textContent.replace('$', ''));
                        const priceB = parseFloat(b.querySelector('.price').textContent.replace('$', ''));
                        return priceA - priceB;
                    });
                    break;
                case 'price-high':
                    sortedCards.sort((a, b) => {
                        const priceA = parseFloat(a.querySelector('.price').textContent.replace('$', ''));
                        const priceB = parseFloat(b.querySelector('.price').textContent.replace('$', ''));
                        return priceB - priceA;
                    });
                    break;
                case 'newest':
                    sortedCards.sort((a, b) => {
                        const isNewA = a.querySelector('.badge.new') !== null;
                        const isNewB = b.querySelector('.badge.new') !== null;
                        return isNewB - isNewA; // Show new items first
                    });
                    break;
                case 'popular':
                default:
                    sortedCards.sort((a, b) => {
                        const isBestsellerA = a.querySelector('.badge.bestseller') !== null;
                        const isBestsellerB = b.querySelector('.badge.bestseller') !== null;
                        return isBestsellerB - isBestsellerA; // Show bestsellers first
                    });
                    break;
            }
            
            // Reorder the cards in the DOM
            sortedCards.forEach(card => {
                card.parentNode.appendChild(card);
            });
            
            // Check if any products are visible
            const visibleProducts = document.querySelectorAll('.product-card[style="display: block;"]');
            const productContainer = document.getElementById('product-container');
            
            if (visibleProducts.length === 0 && productContainer) {
                // No products match filters
                if (!document.getElementById('no-products-message')) {
                    const noProductsMessage = document.createElement('div');
                    noProductsMessage.id = 'no-products-message';
                    noProductsMessage.className = 'no-products-message';
                    noProductsMessage.innerHTML = `
                        <p>No products match your filters. Please try different criteria.</p>
                        <button id="resetFilters" class="btn">Reset Filters</button>
                    `;
                    productContainer.appendChild(noProductsMessage);
                    
                    document.getElementById('resetFilters').addEventListener('click', resetFilters);
                }
            } else {
                // Remove no products message if it exists
                const noProductsMessage = document.getElementById('no-products-message');
                if (noProductsMessage) {
                    noProductsMessage.remove();
                }
            }
        }
        
        function resetFilters() {
            if (categoryFilter) categoryFilter.value = 'all';
            if (ageFilter) ageFilter.value = 'all';
            if (sortBy) sortBy.value = 'popular';
            if (productSearch) productSearch.value = '';
            
            applyFilters();
        }
    }
    
    // 4. PRODUCT MODAL
    function setupProductModal() {
        if (!productModal) return;
        
        // Open modal when View Details is clicked
        viewDetailsBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.dataset.product;
                openProductModal(productId);
            });
        });
        
        // Close modal when X is clicked
        if (closeModal) {
            closeModal.addEventListener('click', closeProductModal);
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === productModal) {
                closeProductModal();
            }
        });
        
        // Thumbnail gallery
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // Update main image
                modalMainImage.src = this.getAttribute('data-src') || this.src;
                
                // Update active thumbnail
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // Quantity controls
        if (quantityMinus && quantityPlus && productQuantity) {
            quantityMinus.addEventListener('click', () => {
                let quantity = parseInt(productQuantity.value);
                if (quantity > 1) {
                    productQuantity.value = quantity - 1;
                }
            });
            
            quantityPlus.addEventListener('click', () => {
                let quantity = parseInt(productQuantity.value);
                if (quantity < 10) {
                    productQuantity.value = quantity + 1;
                }
            });
            
            productQuantity.addEventListener('change', () => {
                let quantity = parseInt(productQuantity.value);
                if (isNaN(quantity) || quantity < 1) {
                    productQuantity.value = 1;
                } else if (quantity > 10) {
                    productQuantity.value = 10;
                }
            });
        }
        
        // Size selection
        sizeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active size
                sizeBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Update price based on selected size
                selectedSize = this.dataset.size;
                if (currentProduct) {
                    let priceMultiplier = 1;
                    switch (selectedSize) {
                        case 'medium': priceMultiplier = 1.8; break;
                        case 'large': priceMultiplier = 2.5; break;
                        default: priceMultiplier = 1;
                    }
                    
                    const price = currentProduct.price * priceMultiplier;
                    modalProductPrice.textContent = `$${price.toFixed(2)}`;
                }
            });
        });
        
        // Add to cart from modal
        if (modalAddToCart) {
            modalAddToCart.addEventListener('click', () => {
                if (!currentProduct) return;
                
                const quantity = parseInt(productQuantity.value);
                const size = selectedSize;
                const isSubscription = subscribeOption.checked;
                
                // Calculate price based on size
                let priceMultiplier = 1;
                switch (size) {
                    case 'medium': priceMultiplier = 1.8; break;
                    case 'large': priceMultiplier = 2.5; break;
                    default: priceMultiplier = 1;
                }
                
                let price = currentProduct.price * priceMultiplier;
                
                // Apply subscription discount if selected
                if (isSubscription) {
                    price = price * 0.9; // 10% discount
                }
                
                addToCart({
                    id: currentProduct.id,
                    name: currentProduct.name,
                    price: price,
                    quantity: quantity,
                    image: currentProduct.image,
                    size: size,
                    isSubscription: isSubscription
                });
                
                closeProductModal();
                openCart();
            });
        }
    }
    
    function openProductModal(productId) {
        // Find product data
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        currentProduct = product;
        
        // Populate modal with product data
        modalProductTitle.textContent = product.name;
        modalProductPrice.textContent = `$${product.price.toFixed(2)}`;
        
        // Set original price or hide if no discount
        if (product.originalPrice > product.price) {
            modalOriginalPrice.textContent = `$${product.originalPrice.toFixed(2)}`;
            modalOriginalPrice.style.display = 'inline';
            document.querySelector('.discount-badge').style.display = 'inline';
        } else {
            modalOriginalPrice.style.display = 'none';
            document.querySelector('.discount-badge').style.display = 'none';
        }
        
        modalProductDesc.textContent = product.fullDesc;
        modalMainImage.src = product.image;
        
        // Reset thumbnails (would normally load product-specific thumbnails)
        thumbnails.forEach((thumbnail, index) => {
            thumbnail.src = product.image;
            thumbnail.classList.toggle('active', index === 0);
        });
        
        // Populate benefits list
        modalProductBenefits.innerHTML = '';
        product.benefits.forEach(benefit => {
            const li = document.createElement('li');
            li.textContent = benefit;
            modalProductBenefits.appendChild(li);
        });
        
        // Populate nutrition table
        const tableBody = modalNutritionTable.querySelector('tbody') || modalNutritionTable;
        tableBody.innerHTML = `
            <tr>
                <th>Nutrient</th>
                <th>Amount per Serving</th>
                <th>% Daily Value</th>
            </tr>
        `;
        
        product.nutrition.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.nutrient}</td>
                <td>${item.amount}</td>
                <td>${item.dailyValue}</td>
            `;
            tableBody.appendChild(row);
        });
        
        // Reset form elements
        productQuantity.value = 1;
        subscribeOption.checked = false;
        
        // Reset size selection
        selectedSize = 'small';
        sizeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.size === 'small');
        });
        
        // Show modal
        productModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    function closeProductModal() {
        productModal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
        currentProduct = null;
    }
    
    // 5. SHOPPING CART
    function setupCart() {
        // Quick add to cart buttons
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.dataset.product;
                const product = products.find(p => p.id === productId);
                
                if (product) {
                    addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: 1,
                        image: product.image,
                        size: 'small',
                        isSubscription: false
                    });
                    
                    // Show cart after adding
                    openCart();
                }
            });
        });
        
        // Open cart
        const cartIcon = document.querySelector('.shopping a');
        if (cartIcon) {
            cartIcon.addEventListener('click', function(e) {
                e.preventDefault();
                openCart();
            });
        }
        
        // Close cart
        if (closeCart) {
            closeCart.addEventListener('click', closeCartSidebar);
        }
        
        // Start shopping button
        if (startShopping) {
            startShopping.addEventListener('click', closeCartSidebar);
        }
        
        // Apply promo code
        if (applyPromo && promoCodeInput) {
            applyPromo.addEventListener('click', applyPromoCode);
        }
        
        // Checkout button
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                closeCartSidebar();
                if (typeof window.showCheckout === 'function') {
                    window.showCheckout();
                }
            });
        }
        
        // Close cart when clicking outside
        document.addEventListener('click', (e) => {
            if (cartSidebar && 
                cartSidebar.classList.contains('open') && 
                !cartSidebar.contains(e.target) && 
                !e.target.closest('.shopping')) {
                closeCartSidebar();
            }
        });
    }
    
    function openCart() {
        if (!cartSidebar) return;
        cartSidebar.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    function closeCartSidebar() {
        if (!cartSidebar) return;
        cartSidebar.classList.remove('open');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    function addToCart(item) {
        // Check if item already exists in cart
        const existingItemIndex = cart.findIndex(i => 
            i.id === item.id && i.size === item.size && i.isSubscription === item.isSubscription
        );
        
        if (existingItemIndex !== -1) {
            // Update quantity if item exists
            cart[existingItemIndex].quantity += item.quantity;
        } else {
            // Add new item
            cart.push(item);
        }
        
        // Update cart display
        updateCartDisplay();
        saveCartToStorage();
        
        // Show confirmation message
        showToast(`${item.name} added to cart!`);
    }
    
    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCartDisplay();
        saveCartToStorage();
    }
    
    function updateCartQuantity(index, newQuantity) {
        if (newQuantity < 1) newQuantity = 1;
        if (newQuantity > 10) newQuantity = 10;
        
        cart[index].quantity = newQuantity;
        updateCartDisplay();
        saveCartToStorage();
    }
    
    function updateCartDisplay() {
        // Update cart count
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        if (cartCount) cartCount.textContent = totalItems;
        if (cartItemCount) cartItemCount.textContent = `(${totalItems})`;
        
        // Show/hide empty cart message
        if (emptyCartMessage && cartItems && cartSummary) {
            if (cart.length === 0) {
                emptyCartMessage.style.display = 'flex';
                cartSummary.style.display = 'none';
            } else {
                emptyCartMessage.style.display = 'none';
                cartSummary.style.display = 'block';
            }
        }
        
        // Populate cart items
        if (cartItems) {
            // Clear current items
            cartItems.innerHTML = '';
            
            if (cart.length === 0) {
                cartItems.appendChild(emptyCartMessage);
            } else {
                // Add each item to cart
                cart.forEach((item, index) => {
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
                    
                    let sizeText = '';
                    switch (item.size) {
                        case 'small': sizeText = 'Small (3-pack)'; break;
                        case 'medium': sizeText = 'Medium (6-pack)'; break;
                        case 'large': sizeText = 'Large (12-pack)'; break;
                    }
                    
                    cartItem.innerHTML = `
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="cart-item-details">
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-size">${sizeText}</div>
                            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                            ${item.isSubscription ? '<div class="subscription-tag">Subscription (10% off)</div>' : ''}
                            <div class="cart-item-quantity">
                                <button class="cart-quantity-btn minus" data-index="${index}">-</button>
                                <span>${item.quantity}</span>
                                <button class="cart-quantity-btn plus" data-index="${index}">+</button>
                            </div>
                        </div>
                        <button class="remove-item" data-index="${index}">
                            <i class="bx bx-trash"></i>
                        </button>
                    `;
                    
                    cartItems.appendChild(cartItem);
                });
                
                // Add event listeners to new cart items
                document.querySelectorAll('.cart-quantity-btn.minus').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const index = parseInt(this.dataset.index);
                        updateCartQuantity(index, cart[index].quantity - 1);
                    });
                });
                
                document.querySelectorAll('.cart-quantity-btn.plus').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const index = parseInt(this.dataset.index);
                        updateCartQuantity(index, cart[index].quantity + 1);
                    });
                });
                
                document.querySelectorAll('.remove-item').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const index = parseInt(this.dataset.index);
                        removeFromCart(index);
                    });
                });
            }
        }
        
        // Update cart totals
        updateCartTotals();
    }
    
    function updateCartTotals() {
        if (!cartSubtotal || !shippingCost || !cartTotal) return;
        
        // Calculate subtotal
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        
        // Set shipping cost (free over $50)
        const shipping = subtotal > 50 ? 0 : 5.99;
        shippingCost.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
        
        // Apply discount if any
        if (currentDiscount > 0) {
            discountRow.style.display = 'flex';
            const discountValue = (subtotal * (currentDiscount / 100)).toFixed(2);
            discountAmount.textContent = `-$${discountValue}`;
        } else {
            discountRow.style.display = 'none';
        }
        
        // Calculate total
        const total = subtotal + shipping - (subtotal * (currentDiscount / 100));
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
    
    function applyPromoCode() {
        const promoCode = promoCodeInput.value.trim().toUpperCase();
        
        // Sample promo codes
        const promoCodes = {
            'WELCOME10': 10,
            'SUMMER20': 20,
            'FREESHIP': 5
        };
        
        if (promoCodes[promoCode]) {
            currentDiscount = promoCodes[promoCode];
            updateCartTotals();
            showToast(`Promo code applied! ${currentDiscount}% discount`);
            promoCodeInput.value = '';
        } else {
            showToast('Invalid promo code', 'error');
        }
    }
    
    // 6. STORAGE FUNCTIONS
    function saveCartToStorage() {
        localStorage.setItem('hopebitesCart', JSON.stringify(cart));
        localStorage.setItem('hopebitesDiscount', currentDiscount.toString());
    }
    
    function loadCartFromStorage() {
        const savedCart = localStorage.getItem('hopebitesCart');
        const savedDiscount = localStorage.getItem('hopebitesDiscount');
        
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
        
        if (savedDiscount) {
            currentDiscount = parseFloat(savedDiscount);
        }
    }
    
    // 7. UTILITY FUNCTIONS
    function showToast(message, type = 'success') {
        // Create toast element if it doesn't exist
        let toast = document.getElementById('toast-notification');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast-notification';
            document.body.appendChild(toast);
            
            // Add styles
            toast.style.position = 'fixed';
            toast.style.bottom = '20px';
            toast.style.left = '50%';
            toast.style.transform = 'translateX(-50%)';
            toast.style.padding = '10px 20px';
            toast.style.borderRadius = '5px';
            toast.style.color = 'white';
            toast.style.fontWeight = '500';
            toast.style.zIndex = '9999';
            toast.style.transition = 'opacity 0.3s, transform 0.3s';
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
        }
        
        // Set toast type
        if (type === 'success') {
            toast.style.backgroundColor = 'var(--primary-color, #2E5339)';
        } else if (type === 'error') {
            toast.style.backgroundColor = 'var(--secondary-color, #dd300a)';
        }
        
        // Set message and show toast
        toast.textContent = message;
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
        
        // Hide toast after 3 seconds
        clearTimeout(toast.timeout);
        toast.timeout = setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
        }, 3000);
    }
    
    // Initialize everything
    init();
});





// Part 2 -- Checkout system
document.addEventListener('DOMContentLoaded', function() {
    // Cart and Product Data (Sample data - would normally come from your database)
    const cartItems = [
        { id: 1, name: "Eco-Friendly Water Bottle", price: 24.99, quantity: 2, image: "/api/placeholder/60/60" },
        { id: 2, name: "Organic Cotton T-Shirt", price: 32.50, quantity: 1, image: "/api/placeholder/60/60" }
    ];
    
    // Initialize variables
    let currentStep = 1;
    let selectedPaymentMethod = 'card';
    let selectedShippingMethod = 'standard';
    let shippingCost = 5.99;
    let orderTotal = 0;
    
    // DOM Elements - Modals
    const checkoutModal = document.getElementById('checkoutModal');
    const confirmationModal = document.getElementById('confirmationModal');
    const closeCheckoutBtn = document.getElementById('closeCheckout');
    
    // DOM Elements - Step Navigation
    const stepIndicators = document.querySelectorAll('.step');
    const step1Content = document.getElementById('step1Content');
    const step2Content = document.getElementById('step2Content');
    const step3Content = document.getElementById('step3Content');
    
    // DOM Elements - Navigation Buttons
    const continueShopping = document.getElementById('continueShopping');
    const toPaymentBtn = document.getElementById('toPaymentBtn');
    const backToShipping = document.getElementById('backToShipping');
    const toReviewBtn = document.getElementById('toReviewBtn');
    const backToPayment = document.getElementById('backToPayment');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const viewOrderBtn = document.getElementById('viewOrderBtn');
    const continueBrowsingBtn = document.getElementById('continueBrowsingBtn');
    
    // DOM Elements - Payment Methods
    const paymentMethods = document.querySelectorAll('.payment-method');
    const cardPaymentForm = document.getElementById('cardPaymentForm');
    const paypalForm = document.getElementById('paypalForm');
    const applePayForm = document.getElementById('applePayForm');
    
    // DOM Elements - Shipping Options
    const shippingOptions = document.querySelectorAll('input[name="shipping"]');
    
    // DOM Elements - Form Elements
    const shippingForm = document.getElementById('shippingForm');
    const paymentForm = document.getElementById('paymentForm');
    const termsAgree = document.getElementById('termsAgree');
    
    // DOM Elements - Review Order Elements
    const reviewOrderItems = document.getElementById('reviewOrderItems');
    const reviewShippingDetails = document.getElementById('reviewShippingDetails');
    const reviewPaymentDetails = document.getElementById('reviewPaymentDetails');
    const reviewSubtotal = document.getElementById('reviewSubtotal');
    const reviewShipping = document.getElementById('reviewShipping');
    const reviewDiscount = document.getElementById('reviewDiscount');
    const reviewDiscountRow = document.getElementById('reviewDiscountRow');
    const reviewTax = document.getElementById('reviewTax');
    const reviewTotal = document.getElementById('reviewTotal');
    
    // DOM Elements - Confirmation Elements
    const orderNumber = document.getElementById('orderNumber');
    const confirmationEmail = document.getElementById('confirmationEmail');
    const confirmationDetails = document.getElementById('confirmationDetails');
    
    // Function to show checkout modal
    window.showCheckout = function() {
        calculateCart();
        checkoutModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling on background
    };
    
    // Function to close checkout modal
    function closeCheckout() {
        checkoutModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Function to show confirmation modal
    function showConfirmation() {
        checkoutModal.classList.remove('active');
        confirmationModal.classList.add('active');
    }
    
    // Function to close confirmation modal
    function closeConfirmation() {
        confirmationModal.classList.remove('active');
        document.body.style.overflow = '';
        resetCheckout();
    }
    
    // Calculate cart totals
    function calculateCart() {
        let subtotal = 0;
        cartItems.forEach(item => {
            subtotal += item.price * item.quantity;
        });
        
        // Apply shipping cost based on selected method
        switch (selectedShippingMethod) {
            case 'express':
                shippingCost = 12.99;
                break;
            case 'nextday':
                shippingCost = 19.99;
                break;
            default:
                shippingCost = 5.99;
        }
        
        // Calculate tax (example: 8.25%)
        const taxRate = 0.0825;
        const tax = subtotal * taxRate;
        
        // Calculate total
        orderTotal = subtotal + shippingCost + tax;
        
        // Update review page
        if (reviewSubtotal) {
            reviewSubtotal.textContent = `$${subtotal.toFixed(2)}`;
            reviewShipping.textContent = `$${shippingCost.toFixed(2)}`;
            reviewTax.textContent = `$${tax.toFixed(2)}`;
            reviewTotal.textContent = `$${orderTotal.toFixed(2)}`;
        }
    }
    
    // Show step by number
    function showStep(stepNumber) {
        // Hide all steps
        step1Content.classList.add('hidden');
        step2Content.classList.add('hidden');
        step3Content.classList.add('hidden');
        
        // Remove active class from all step indicators
        stepIndicators.forEach(step => {
            step.classList.remove('active');
        });
        
        // Show the requested step
        document.getElementById(`step${stepNumber}Content`).classList.remove('hidden');
        
        // Set the active step indicator
        document.querySelector(`.step[data-step="${stepNumber}"]`).classList.add('active');
        
        // Update current step
        currentStep = stepNumber;
        
        // If going to review step, update review information
        if (stepNumber === 3) {
            updateReviewPage();
        }
    }
    
    // Update payment form based on selected method
    function updatePaymentForm(method) {
        // Hide all payment forms
        cardPaymentForm.classList.add('hidden');
        paypalForm.classList.add('hidden');
        applePayForm.classList.add('hidden');
        
        // Show selected payment form
        document.getElementById(`${method}PaymentForm`).classList.remove('hidden');
        
        // Update selected payment method
        selectedPaymentMethod = method;
    }
    
    // Update shipping method
    function updateShippingMethod(method) {
        selectedShippingMethod = method;
        calculateCart();
    }
    
    // Populate review page with data from previous steps
    function updateReviewPage() {
        // Populate order items
        reviewOrderItems.innerHTML = '';
        cartItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="order-item-image">
                <div class="order-item-details">
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-info">Quantity: ${item.quantity}</div>
                </div>
                <div class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            `;
            reviewOrderItems.appendChild(itemElement);
        });
        
        // Populate shipping details
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const state = document.getElementById('state').value;
        const zipCode = document.getElementById('zipCode').value;
        const country = document.getElementById('country').value;
        
        let shippingMethodName = "Standard Shipping";
        if (selectedShippingMethod === 'express') {
            shippingMethodName = "Express Shipping";
        } else if (selectedShippingMethod === 'nextday') {
            shippingMethodName = "Next Day Delivery";
        }
        
        reviewShippingDetails.innerHTML = `
            <p>${firstName} ${lastName}</p>
            <p>${address}</p>
            <p>${city}, ${state} ${zipCode}</p>
            <p>${country}</p>
            <p><strong>Method:</strong> ${shippingMethodName} ($${shippingCost.toFixed(2)})</p>
        `;
        
        // Populate payment details
        let paymentMethodName = "";
        switch (selectedPaymentMethod) {
            case 'card':
                const cardName = document.getElementById('cardName').value;
                const cardNumber = document.getElementById('cardNumber').value;
                paymentMethodName = `Credit Card (ending in ${cardNumber.slice(-4)})`;
                break;
            case 'paypal':
                paymentMethodName = "PayPal";
                break;
            case 'apple':
                paymentMethodName = "Apple Pay";
                break;
        }
        
        reviewPaymentDetails.innerHTML = `<p>${paymentMethodName}</p>`;
        
        // Update totals
        calculateCart();
        
        // Check if discount is applied (example)
        const hasDiscount = false; // Set to true to show discount
        if (hasDiscount) {
            reviewDiscountRow.style.display = 'flex';
            reviewDiscount.textContent = '-$10.00';
            orderTotal -= 10;
            reviewTotal.textContent = `$${orderTotal.toFixed(2)}`;
        } else {
            reviewDiscountRow.style.display = 'none';
        }
    }
    
    // Place Order function
    function placeOrder() {
        if (!termsAgree.checked) {
            alert("Please agree to the Terms and Conditions to place your order.");
            return;
        }
        
        // Show loading indicator
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
        step3Content.appendChild(loadingOverlay);
        
        // Simulate order processing (would be an API call in a real system)
        setTimeout(() => {
            step3Content.removeChild(loadingOverlay);
            
            // Generate order number
            const randomOrderNum = Math.floor(100000 + Math.random() * 900000);
            orderNumber.textContent = `#${randomOrderNum}`;
            
            // Set confirmation email
            confirmationEmail.textContent = document.getElementById('email').value;
            
            // Populate confirmation details
            confirmationDetails.innerHTML = `
                <div class="confirmation-item">
                    <p><strong>Items:</strong> ${cartItems.length}</p>
                    <p><strong>Shipping:</strong> ${reviewShippingDetails.querySelector('p:last-child').textContent}</p>
                    <p><strong>Total:</strong> ${reviewTotal.textContent}</p>
                </div>
            `;
            
            // Show confirmation modal
            showConfirmation();
        }, 1500);
    }
    
    // Reset checkout to initial state
    function resetCheckout() {
        // Reset step
        showStep(1);
        
        // Reset forms
        shippingForm.reset();
        paymentForm.reset();
        
        // Reset payment method
        updatePaymentForm('card');
        paymentMethods.forEach(method => {
            if (method.getAttribute('data-method') === 'card') {
                method.classList.add('active');
            } else {
                method.classList.remove('active');
            }
        });
        
        // Reset shipping method
        selectedShippingMethod = 'standard';
        document.querySelector('input[value="standard"]').checked = true;
    }
    
    // Validate shipping form
    function validateShippingForm() {
        const requiredFields = [
            'firstName', 'lastName', 'email', 'phone',
            'address', 'city', 'state', 'zipCode', 'country'
        ];
        
        for (const field of requiredFields) {
            const element = document.getElementById(field);
            if (!element.value.trim()) {
                alert(`Please fill in the ${element.previousElementSibling.textContent} field.`);
                element.focus();
                return false;
            }
        }
        
        // Validate email format
        const email = document.getElementById('email').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            document.getElementById('email').focus();
            return false;
        }
        
        return true;
    }
    
    // Validate payment form
    function validatePaymentForm() {
        if (selectedPaymentMethod === 'card') {
            const requiredFields = ['cardName', 'cardNumber', 'expiryDate', 'cvv'];
            
            for (const field of requiredFields) {
                const element = document.getElementById(field);
                if (!element.value.trim()) {
                    alert(`Please fill in the ${element.previousElementSibling.textContent} field.`);
                    element.focus();
                    return false;
                }
            }
            
            // Validate card number format (basic validation)
            const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
            if (!/^\d{16}$/.test(cardNumber)) {
                alert("Please enter a valid 16-digit card number.");
                document.getElementById('cardNumber').focus();
                return false;
            }
            
            // Validate expiry date format
            const expiryDate = document.getElementById('expiryDate').value;
            if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
                alert("Please enter a valid expiry date in MM/YY format.");
                document.getElementById('expiryDate').focus();
                return false;
            }
            
            // Validate CVV format
            const cvv = document.getElementById('cvv').value;
            if (!/^\d{3,4}$/.test(cvv)) {
                alert("Please enter a valid CVV code.");
                document.getElementById('cvv').focus();
                return false;
            }
        }
        
        return true;
    }
    
    // Event Listeners - Modal Controls
    closeCheckoutBtn.addEventListener('click', closeCheckout);
    continueShopping.addEventListener('click', closeCheckout);
    
    // Event Listeners - Step Navigation
    toPaymentBtn.addEventListener('click', () => {
        if (validateShippingForm()) {
            showStep(2);
        }
    });
    
    backToShipping.addEventListener('click', () => {
        showStep(1);
    });
    
    toReviewBtn.addEventListener('click', () => {
        if (validatePaymentForm()) {
            showStep(3);
        }
    });
    
    backToPayment.addEventListener('click', () => {
        showStep(2);
    });
    
    placeOrderBtn.addEventListener('click', placeOrder);
    
    // Event Listeners - Payment Methods
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Remove active class from all methods
            paymentMethods.forEach(m => m.classList.remove('active'));
            
            // Add active class to clicked method
            this.classList.add('active');
            
            // Update payment form
            updatePaymentForm(this.getAttribute('data-method'));
        });
    });
    
    // Event Listeners - Shipping Options
    shippingOptions.forEach(option => {
        option.addEventListener('change', function() {
            updateShippingMethod(this.value);
        });
    });
    
    // Event Listeners - Confirmation Modal
    viewOrderBtn.addEventListener('click', () => {
        // This would typically go to an order details page
        alert("View Order functionality would go to order details page.");
        closeConfirmation();
    });
    
    continueBrowsingBtn.addEventListener('click', closeConfirmation);
    
    // Card Format Helper Functions
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            // Remove all non-digits
            let value = this.value.replace(/\D/g, '');
            
            // Add space after every 4 digits
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            
            // Limit to 19 characters (16 digits + 3 spaces)
            value = value.substring(0, 19);
            
            // Update input value
            this.value = value;
        });
    }
    
    const expiryDateInput = document.getElementById('expiryDate');
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function(e) {
            // Remove all non-digits
            let value = this.value.replace(/\D/g, '');
            
            // Add slash after first 2 digits
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2);
            }
            
            // Limit to 5 characters (MM/YY)
            value = value.substring(0, 5);
            
            // Update input value
            this.value = value;
        });
    }
    
    // Initialize checkout - showing first step
    resetCheckout();
    
    // For demo purposes - add a method to show the checkout modal from outside this script
    window.addEventListener('keydown', function(e) {
        // Pressing 'C' will open the checkout for demo purposes
        if (e.key.toLowerCase() === 'c') {
            showCheckout();
        }
    });
    
    // Optional: Add a button to your page to open the checkout
    const demoCheckoutButton = document.createElement('button');
    demoCheckoutButton.textContent = "Open Checkout";
    demoCheckoutButton.className = "primary-button";
    demoCheckoutButton.style.position = "fixed";
    demoCheckoutButton.style.bottom = "20px";
    demoCheckoutButton.style.right = "20px";
    demoCheckoutButton.style.zIndex = "999";
    demoCheckoutButton.addEventListener('click', showCheckout);
    document.body.appendChild(demoCheckoutButton);
});





// Part 3 -- Footer
// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Select the theme toggle button
    const themeToggle = document.querySelector('.theme-toggle');
    
    // Check for saved theme preference or use system preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');
    
    // Set initial theme
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', () => {
        // If current mode is dark, switch to light, and vice versa
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Set the new theme
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Save preference to localStorage
        localStorage.setItem('theme', newTheme);
    });
    
    // Listen for system preference changes
    prefersDarkScheme.addEventListener('change', (event) => {
        // Only automatically switch if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
            const newTheme = event.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
        }
    });
    
    // Newsletter Form Submission (prevent default behavior for demo)
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            
            // Simple validation
            if (emailInput.value.trim() !== '' && emailInput.value.includes('@')) {
                // Here you would typically send this to your backend
                alert('Thank you for subscribing!');
                emailInput.value = '';
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }
    
    // Smooth scrolling for footer navigation links
    const footerLinks = document.querySelectorAll('.footer-links a[href^="#"]');
    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 100, // Offset for fixed header if you have one
                    behavior: 'smooth'
                });
            }
        });
    });
});