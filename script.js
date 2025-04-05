document.addEventListener('DOMContentLoaded', function () {
    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', function () {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking nav links
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function () {
            navLinks.classList.remove('active');
        });
    });

    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            header.style.padding = '5px 0';
            header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '15px 0';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });

    // Animate elements when scrolled into view
    const elements = document.querySelectorAll('.stat-item, .program-card, .team-member, .involvement-option');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(element => {
        observer.observe(element);
    });
});

// Intersection Observer for scroll animations
document.addEventListener('DOMContentLoaded', function() {
    // Add animation classes to products, categories and testimonials
    const animatedElements = document.querySelectorAll('.product-card, .category-card, .testimonial-card');
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = "0";
        element.style.transform = "translateY(30px)";
    });
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Get all cards in the parent section
                const cards = entry.target.querySelectorAll('.product-card, .category-card, .testimonial-card');
                
                // Animate each card with a delay
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
                        card.style.opacity = "1";
                        card.style.transform = "translateY(0)";
                    }, 100 * index);
                });
                
                // Once animated, no need to observe anymore
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // Observe sections
    document.querySelectorAll('.product-section, .product-categories, .testimonials').forEach(section => {
        observer.observe(section);
    });
    
    // Hero section animation
    const heroTitle = document.querySelector('.product-hero h1');
    const heroText = document.querySelector('.product-hero p');
    
    if (heroTitle && heroText) {
        heroTitle.style.opacity = "0";
        heroTitle.style.transform = "translateY(-20px)";
        heroText.style.opacity = "0";
        heroText.style.transform = "translateY(20px)";
        
        setTimeout(() => {
            heroTitle.style.transition = "opacity 0.8s ease, transform 0.8s ease";
            heroTitle.style.opacity = "1";
            heroTitle.style.transform = "translateY(0)";
        }, 300);
        
        setTimeout(() => {
            heroText.style.transition = "opacity 0.8s ease, transform 0.8s ease";
            heroText.style.opacity = "1";
            heroText.style.transform = "translateY(0)";
        }, 500);
    }
    
    // Add hover effects to product cards
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const img = this.querySelector('.product-img img');
            const title = this.querySelector('h3');
            const actions = this.querySelector('.product-actions');
            
            if (img) img.style.transform = "scale(1.08)";
            if (title) title.style.color = "var(--secondary-color)";
            if (actions) actions.style.transform = "translateY(-5px)";
        });
        
        card.addEventListener('mouseleave', function() {
            const img = this.querySelector('.product-img img');
            const title = this.querySelector('h3');
            const actions = this.querySelector('.product-actions');
            
            if (img) img.style.transform = "scale(1)";
            if (title) title.style.color = "var(--primary-color)";
            if (actions) actions.style.transform = "translateY(0)";
        });
    });
    
    // Add click animations to buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add smooth scrolling for category links
document.addEventListener('DOMContentLoaded', function() {
    const categoryLinks = document.querySelectorAll('a[href^="#"]');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Offset for fixed header
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});