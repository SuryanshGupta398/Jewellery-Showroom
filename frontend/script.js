// ===== CURRENT GOLD PRICES IN INDIA (per gram) =====
const currentGoldPrices = {
    '24k': 6500,  // 24K gold price per gram
    '22k': 6000,  // 22K gold price per gram
    '18k': 5000,  // 18K gold price per gram
    'silver': 80,  // Silver price per gram
    'platinum': 3000 // Platinum price per gram
};

// ===== JEWELLERY DATA GENERATOR =====
function generateJewelleryData() {
    const categories = ['rings', 'necklaces', 'bracelets', 'earrings'];
    const types = {
        rings: ['Diamond', 'Emerald', 'Ruby', 'Sapphire', 'Pearl', 'Plain', 'Designer', 'Signet', 'Cluster', 'Eternity'],
        necklaces: ['Diamond', 'Pearl', 'Traditional', 'Modern', 'Choker', 'Pendant', 'Statement', 'Minimalist', 'Y Necklace', 'Layered'],
        bracelets: ['Tennis', 'Charm', 'Bangle', 'Cuff', 'Chain', 'Beaded', 'Diamond', 'Gold', 'Silver', 'Designer'],
        earrings: ['Stud', 'Hoop', 'Dangler', 'Jhumka', 'Chandelier', 'Threader', 'Huggie', 'Cluster', 'Solitaire', 'Traditional']
    };
    
    const materials = ['gold', 'silver', 'platinum'];
    const karats = ['24k', '22k', '18k'];
    
    // Sample Unsplash image IDs for jewellery
    const imageIds = [
        '1605100804763-247f67b3557e', '1599643478518-a784e5dc4c8f', '1515562141207-7a88fb7ce338',
        '1535632066927-ab7c9ab60908', '1544376664-80b17f09d399', '1606068543537-ec67e52613e9',
        '1588444650700-6c7f0c89d36b', '1596944946755-8a9cd2546d27', '1611591437281-460bfbe1220a',
        '1636214410913-7b7d8b46d8a9', '1535632066927-ab7c9ab60908', '1605100804763-247f67b3557e'
    ];
    
    let jewelleryData = [];
    let id = 1;
    
    categories.forEach(category => {
        for (let i = 0; i < 12; i++) { // Reduced to 12 per category for better performance
            const type = types[category][Math.floor(Math.random() * types[category].length)];
            const material = materials[Math.floor(Math.random() * materials.length)];
            const karat = material === 'gold' ? karats[Math.floor(Math.random() * karats.length)] : material;
            const imageId = imageIds[Math.floor(Math.random() * imageIds.length)];
            
            // Default weights based on category
            const defaultWeights = {
                rings: [2, 3, 4, 5, 6],
                necklaces: [15, 20, 25, 30, 35],
                bracelets: [8, 10, 12, 15, 18],
                earrings: [3, 4, 5, 6, 7]
            };
            
            const defaultWeight = defaultWeights[category][Math.floor(Math.random() * defaultWeights[category].length)];
            
            // Base price calculation
            let basePrice = 0;
            if (material === 'gold') {
                basePrice = currentGoldPrices[karat] * defaultWeight;
            } else if (material === 'silver') {
                basePrice = currentGoldPrices.silver * defaultWeight;
            } else {
                basePrice = currentGoldPrices.platinum * defaultWeight;
            }
            
            // Add premium for stones
            if (type.includes('Diamond')) basePrice += 20000;
            if (type.includes('Emerald') || type.includes('Ruby') || type.includes('Sapphire')) basePrice += 15000;
            if (type.includes('Pearl')) basePrice += 8000;
            
            // Add making charges (10%)
            basePrice += basePrice * 0.1;
            
            jewelleryData.push({
                id: id++,
                name: `${karat.toUpperCase()} ${type} ${category.charAt(0).toUpperCase() + category.slice(1)}`,
                basePrice: Math.round(basePrice),
                image: `https://images.unsplash.com/photo-${imageId}?w=400&h=300&fit=crop`,
                category: category,
                type: type,
                material: material,
                karat: karat,
                defaultWeight: defaultWeight,
                description: `Beautiful ${karat} ${material} ${category} with ${type.toLowerCase()} design. Perfect for special occasions.`
            });
        }
    });
    
    return jewelleryData;
}

// ===== DYNAMIC JEWELLERY DISPLAY =====
class JewelleryDisplay {
    constructor() {
        this.jewelleryData = generateJewelleryData();
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        console.log('🔄 Initializing Jewellery Display with', this.jewelleryData.length, 'items');
        this.renderJewelleryCards();
        this.setupEventListeners();
    }

    renderJewelleryCards(filter = 'all') {
        const container = document.getElementById('jewelleryContainer');
        if (!container) {
            console.error('❌ jewelleryContainer not found!');
            return;
        }

        const filteredData = filter === 'all' 
            ? this.jewelleryData 
            : this.jewelleryData.filter(item => item.category === filter);

        console.log(`🎯 Rendering ${filteredData.length} items for filter: ${filter}`);

        container.innerHTML = filteredData.map(item => `
            <div class="card" data-category="${item.category}" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
                <div class="card-info">
                    <h3>${item.name}</h3>
                    <p class="description">${item.description}</p>
                    <div class="price-section">
                        <span class="price">₹${this.formatPrice(item.basePrice)}</span>
                        <span class="weight">${item.defaultWeight}g ${item.karat}</span>
                    </div>
                    <div class="card-actions">
                        <button class="btn view-details" data-id="${item.id}">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                        <button class="btn add-to-cart" data-id="${item.id}">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add event listeners to new buttons
        this.attachCardEventListeners();
        
        // Trigger card reveal animation
        setTimeout(() => this.revealCards(), 100);
    }

    attachCardEventListeners() {
        // View Details buttons
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.closest('.view-details').dataset.id);
                this.showItemDetails(itemId);
            });
        });

        // Add to Cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.closest('.add-to-cart').dataset.id);
                this.addToCart(itemId);
            });
        });
    }

    revealCards() {
        const cards = document.querySelectorAll('.card');
        const triggerBottom = window.innerHeight * 0.85;
        
        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            if (cardTop < triggerBottom) {
                card.classList.add('visible');
            }
        });
    }

    showItemDetails(itemId) {
        const item = this.jewelleryData.find(i => i.id === itemId);
        if (!item) return;

        // Create modal for item details
        const modal = this.createDetailsModal(item);
        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => modal.classList.add('show'), 10);
    }

    createDetailsModal(item) {
        const modal = document.createElement('div');
        modal.className = 'jewellery-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="modal-body">
                    <div class="modal-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="modal-details">
                        <h2>${item.name}</h2>
                        <p class="modal-description">${item.description}</p>
                        
                        <div class="specifications">
                            <h3>Specifications</h3>
                            <div class="spec-grid">
                                <div class="spec-item">
                                    <label>Material:</label>
                                    <span>${item.material.charAt(0).toUpperCase() + item.material.slice(1)}</span>
                                </div>
                                <div class="spec-item">
                                    <label>Karat:</label>
                                    <span>${item.karat.toUpperCase()}</span>
                                </div>
                                <div class="spec-item">
                                    <label>Default Weight:</label>
                                    <span>${item.defaultWeight} grams</span>
                                </div>
                            </div>
                        </div>

                        <div class="customization">
                            <h3>Customize Your Jewellery</h3>
                            <div class="custom-options">
                                <div class="option-group">
                                    <label for="weight-${item.id}">Weight (grams):</label>
                                    <input type="number" id="weight-${item.id}" 
                                           min="${Math.max(1, item.defaultWeight - 5)}" 
                                           max="${item.defaultWeight + 20}" 
                                           value="${item.defaultWeight}" 
                                           step="0.5">
                                </div>
                                
                                ${item.material === 'gold' ? `
                                <div class="option-group">
                                    <label for="karat-${item.id}">Karat:</label>
                                    <select id="karat-${item.id}">
                                        <option value="24k" ${item.karat === '24k' ? 'selected' : ''}>24K Gold</option>
                                        <option value="22k" ${item.karat === '22k' ? 'selected' : ''}>22K Gold</option>
                                        <option value="18k" ${item.karat === '18k' ? 'selected' : ''}>18K Gold</option>
                                    </select>
                                </div>
                                ` : ''}
                            </div>
                            
                            <div class="price-calculation">
                                <div class="base-price">
                                    <span>Base Price:</span>
                                    <span>₹${this.formatPrice(item.basePrice)}</span>
                                </div>
                                <div class="custom-price">
                                    <span>Custom Price:</span>
                                    <span id="custom-price-${item.id}">₹${this.formatPrice(item.basePrice)}</span>
                                </div>
                                <div class="price-breakdown">
                                    <small>Price updates based on weight and karat selection</small>
                                </div>
                            </div>
                        </div>

                        <div class="modal-actions">
                            <button class="btn btn-secondary close-details">Close</button>
                            <button class="btn btn-primary add-custom-cart" data-id="${item.id}">
                                <i class="fas fa-shopping-cart"></i> Add to Cart with Customizations
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners for modal
        this.attachModalEventListeners(modal, item);
        return modal;
    }

    attachModalEventListeners(modal, item) {
        // Close modal
        modal.querySelector('.close-modal').addEventListener('click', () => this.closeModal(modal));
        modal.querySelector('.close-details').addEventListener('click', () => this.closeModal(modal));
        
        // Close when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal(modal);
        });

        // Price calculation on input change
        const weightInput = modal.querySelector(`#weight-${item.id}`);
        const karatSelect = modal.querySelector(`#karat-${item.id}`);
        const customPriceEl = modal.querySelector(`#custom-price-${item.id}`);

        const updatePrice = () => {
            const weight = parseFloat(weightInput.value) || item.defaultWeight;
            const karat = karatSelect ? karatSelect.value : item.karat;
            const newPrice = this.calculateCustomPrice(item, weight, karat);
            customPriceEl.textContent = `₹${this.formatPrice(newPrice)}`;
        };

        weightInput.addEventListener('input', updatePrice);
        if (karatSelect) karatSelect.addEventListener('change', updatePrice);

        // Add to cart with customizations
        modal.querySelector('.add-custom-cart').addEventListener('click', () => {
            const weight = parseFloat(weightInput.value) || item.defaultWeight;
            const karat = karatSelect ? karatSelect.value : item.karat;
            this.addToCartWithCustomizations(item, weight, karat);
            this.closeModal(modal);
        });
    }

    calculateCustomPrice(item, weight, karat) {
        let pricePerGram;
        
        if (item.material === 'gold') {
            pricePerGram = currentGoldPrices[karat];
        } else if (item.material === 'silver') {
            pricePerGram = currentGoldPrices.silver;
        } else {
            pricePerGram = currentGoldPrices.platinum;
        }

        // Calculate base metal price
        let basePrice = pricePerGram * weight;

        // Add premium for stones (proportional to weight change)
        const weightRatio = weight / item.defaultWeight;
        let stonePremium = 0;
        
        if (item.type.includes('Diamond')) stonePremium = 20000 * weightRatio;
        else if (item.type.includes('Emerald') || item.type.includes('Ruby') || item.type.includes('Sapphire')) 
            stonePremium = 15000 * weightRatio;
        else if (item.type.includes('Pearl')) stonePremium = 8000 * weightRatio;

        // Add making charges (10% of base price)
        const makingCharges = basePrice * 0.1;

        return Math.round(basePrice + stonePremium + makingCharges);
    }

    addToCartWithCustomizations(item, weight, karat) {
        const customPrice = this.calculateCustomPrice(item, weight, karat);
        const customItem = {
            ...item,
            customWeight: weight,
            customKarat: karat,
            finalPrice: customPrice,
            originalPrice: item.basePrice
        };

        console.log('Adding to cart:', customItem);
        this.addToCart(item.id, customItem);
    }

    addToCart(itemId, customItem = null) {
        const item = customItem || this.jewelleryData.find(i => i.id === itemId);
        if (!item) return;

        // Check if user is logged in
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
            alert('Please login first to add items to cart.');
            window.location.href = 'login.html';
            return;
        }

        const userPhone = localStorage.getItem('userPhone');
        const cartItem = {
            productId: item.id,
            name: item.name,
            price: customItem ? item.finalPrice : item.basePrice,
            image: item.image,
            quantity: 1,
            customizations: customItem ? {
                weight: customItem.customWeight,
                karat: customItem.customKarat,
                originalPrice: customItem.originalPrice
            } : null
        };

        // Send to backend
        this.sendToCart(userPhone, cartItem);
    }

    async sendToCart(userPhone, cartItem) {
        try {
            const res = await fetch('https://jewellery-website-5xi0.onrender.com/api/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: userPhone, product: cartItem })
            });
            
            const data = await res.json();
            if (res.ok) {
                alert(`${cartItem.name} added to cart!`);
                // Update cart UI if exists
                if (typeof updateCartUI === 'function') {
                    updateCartUI(data.cart);
                }
            } else {
                alert(data.message || 'Error adding item to cart');
            }
        } catch (err) {
            console.error('Cart error:', err);
            alert('Unable to add item. Please try again.');
        }
    }

    closeModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }

    setupEventListeners() {
        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        if (filterButtons.length > 0) {
            filterButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const filter = e.target.dataset.category;
                    this.currentFilter = filter;
                    
                    // Update active button
                    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    
                    // Render filtered items
                    this.renderJewelleryCards(filter);
                });
            });
        } else {
            console.warn('⚠️ No filter buttons found');
        }
    }

    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
}

// ===== ROYAL PREMIUM ANIMATION WITH FLOATING ELEMENTS =====
class RoyalAnimation {
    constructor() {
        this.animationShown = sessionStorage.getItem('royalAnimationShown');
        this.isMobile = this.checkMobile();
        this.init();
    }

    checkMobile() {
        return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    init() {
        const isHomePage = this.isHomePage();
        
        // Check if user wants to see animation again (via URL parameter or button)
        const showAgain = new URLSearchParams(window.location.search).get('showAnimation') === 'true';
        const forceShow = localStorage.getItem('forceShowAnimation') === 'true';
        
        if (isHomePage && (!this.animationShown || showAgain || forceShow)) {
            // Clear force show flag after use
            if (forceShow) {
                localStorage.removeItem('forceShowAnimation');
            }
            this.showRoyalAnimation();
        } else {
            this.skipAnimation();
        }
    }

    isHomePage() {
        return window.location.pathname.endsWith('index.html') || 
               window.location.pathname.endsWith('/') || 
               (document.querySelector('.hero') !== null && 
                !window.location.pathname.includes('login.html') &&
                !window.location.pathname.includes('register.html'));
    }

    showRoyalAnimation() {
        console.log('🦄 Showing royal premium animation');
        
        // Hide main content
        document.body.style.overflow = 'hidden';

        // Create royal overlay
        const overlay = this.createRoyalOverlay();
        document.body.appendChild(overlay);

        // Initialize particles and floating elements
        this.createRoyalParticles();
        this.createAnimationFloatingElements();

        // Start countdown
        this.startRoyalCountdown();
    }

    createRoyalOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'royal-welcome-overlay';
        overlay.id = 'royalWelcomeOverlay';

        overlay.innerHTML = `
            <div class="royal-pattern"></div>
            <div class="royal-particles" id="royalParticles"></div>
            <div class="royal-floating-elements" id="royalFloatingElements"></div>
            
            <div class="royal-welcome-container">
                <div class="royal-welcome-card">
                    <div class="royal-crown">👑</div>
                    <div class="royal-logo">Prabhanjan Mragendra Jewellers PVT LTD</div>
                    <div class="royal-tagline">Prabhanjan Jewellers</div>
                    
                    <div class="royal-diamond-showcase">
                        <div class="royal-diamond"></div>
                    </div>
                    
                    <div class="royal-message">
                        Enter our exclusive world of luxury jewellery, where every piece tells a story of royal craftsmanship and timeless elegance.
                    </div>
                    
                    <button class="royal-enter-btn" id="royalEnterBtn">
                        <i class="fas fa-gem royal-btn-icon"></i>
                        Enter Royal Boutique
                    </button>

                    <div class="royal-options">
                        <label class="royal-checkbox">
                            <input type="checkbox" id="showAgainCheckbox">
                            <span class="checkmark"></span>
                            Show this animation next time
                        </label>
                        <button class="royal-skip-btn" id="royalSkipBtn">
                            Skip Animation
                        </button>
                    </div>
                    
                    <div class="royal-loading-bar">
                        <div class="royal-loading-progress"></div>
                    </div>
                    
                    <div class="royal-countdown" id="royalCountdown">
                        Entering automatically in <span id="countdownNumber">5</span> seconds
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        const enterBtn = overlay.querySelector('#royalEnterBtn');
        enterBtn.addEventListener('click', () => this.enterBoutique());

        const skipBtn = overlay.querySelector('#royalSkipBtn');
        skipBtn.addEventListener('click', () => this.skipAnimation());

        const checkbox = overlay.querySelector('#showAgainCheckbox');
        checkbox.addEventListener('change', (e) => {
            localStorage.setItem('showAnimationNextTime', e.target.checked.toString());
        });

        // Set checkbox state
        const showNextTime = localStorage.getItem('showAnimationNextTime') === 'true';
        checkbox.checked = showNextTime;

        return overlay;
    }

    createRoyalParticles() {
        const particlesContainer = document.getElementById('royalParticles');
        if (!particlesContainer) return;

        // Limit particles for mobile performance
        const particleCount = this.isMobile ? 5 : 9;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'royal-particle';
            
            // Randomize properties
            const left = Math.random() * 100;
            const delay = Math.random() * 10;
            const duration = 6 + Math.random() * 4;
            
            particle.style.left = `${left}%`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.background = this.getRandomGoldColor();
            
            particlesContainer.appendChild(particle);
        }
    }

    createAnimationFloatingElements() {
        const floatingContainer = document.getElementById('royalFloatingElements');
        if (!floatingContainer) return;

        const animationJewels = ['💎', '✨', '🌟', '💫', '⭐', '🔮', '💍', '🔶', '💠'];
        const elementCount = this.isMobile ? 8 : 12;

        for (let i = 0; i < elementCount; i++) {
            const element = document.createElement('div');
            element.className = 'royal-floating-element';
            
            // Random properties for natural movement
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = 10 + Math.random() * 8;
            const size = 1.5 + Math.random() * 1.5;
            
            element.textContent = animationJewels[Math.floor(Math.random() * animationJewels.length)];
            element.style.left = `${left}%`;
            element.style.top = `${top}%`;
            element.style.animationDelay = `${delay}s`;
            element.style.animationDuration = `${duration}s`;
            element.style.fontSize = `${size}rem`;
            element.style.opacity = '0.7';
            element.style.filter = `hue-rotate(${Math.random() * 360}deg) brightness(1.2)`;
            
            floatingContainer.appendChild(element);
        }
    }

    getRandomGoldColor() {
        const goldColors = [
            '#d4af37', '#f5c542', '#ffd700', '#daa520', '#b8860b'
        ];
        return goldColors[Math.floor(Math.random() * goldColors.length)];
    }

    startRoyalCountdown() {
        let countdown = 15;
        const countdownEl = document.getElementById('countdownNumber');
        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdownEl) countdownEl.textContent = countdown;
            
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                this.enterBoutique();
            }
        }, 1000);
    }

    enterBoutique() {
        console.log('🏰 Entering royal boutique...');
        
        // Check if user wants to see animation next time
        const showNextTime = localStorage.getItem('showAnimationNextTime') === 'true';
        if (showNextTime) {
            // Don't set session storage, so animation shows next time
            console.log('🎭 Animation will show again next time');
        } else {
            // Mark as shown for this session
            sessionStorage.setItem('royalAnimationShown', 'true');
        }
        
        const overlay = document.getElementById('royalWelcomeOverlay');
        if (overlay) {
            // Add exit animation
            overlay.classList.add('exiting');
            
            setTimeout(() => {
                // Remove overlay
                overlay.remove();
                
                // Show main content
                this.showMainContent();
                
                console.log('🎉 Royal animation completed');
            }, 800);
        } else {
            this.showMainContent();
        }
    }

    showMainContent() {
        document.body.classList.add('loaded');
        document.body.style.overflow = 'auto';
        
        // Initialize any additional animations
        this.initializePageAnimations();
        
        // Add "Show Animation Again" button to navbar
        this.addAnimationToggleButton();
    }

    skipAnimation() {
        console.log('⚡ Skipping royal animation');
        // Mark as shown for this session
        sessionStorage.setItem('royalAnimationShown', 'true');
        this.showMainContent();
        
        const overlay = document.getElementById('royalWelcomeOverlay');
        if (overlay) {
            overlay.remove();
        }
    }

    addAnimationToggleButton() {
        // Add button to show animation again
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && !document.getElementById('showAnimationBtn')) {
            const showAnimationBtn = document.createElement('a');
            showAnimationBtn.id = 'showAnimationBtn';
            showAnimationBtn.href = '#';
            showAnimationBtn.className = 'btn royal-animation-btn';
            showAnimationBtn.innerHTML = '<i class="fas fa-crown"></i> Show Intro';
            showAnimationBtn.style.marginLeft = '10px';
            showAnimationBtn.style.background = 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)';
            
            showAnimationBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAnimationAgain();
            });
            
            navLinks.appendChild(showAnimationBtn);
        }
    }

    showAnimationAgain() {
        // Force show animation on next load
        localStorage.setItem('forceShowAnimation', 'true');
        // Reload the page
        window.location.reload();
    }

    initializePageAnimations() {
        // Initialize card animations
        this.initializeCardAnimations();
        
        // Initialize homepage floating elements
        this.initializeHomepageFloatingElements();
    }

    initializeCardAnimations() {
        const cards = document.querySelectorAll('.card');
        const revealCards = () => {
            const triggerBottom = window.innerHeight * 0.85;
            cards.forEach(card => {
                const cardTop = card.getBoundingClientRect().top;
                if (cardTop < triggerBottom) {
                    card.classList.add('visible');
                }
            });
        };

        // Throttle scroll for performance
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    revealCards();
                    scrollTimeout = null;
                }, 100);
            }
        });

        // Initial reveal
        revealCards();
    }

    initializeHomepageFloatingElements() {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;

        // Remove existing floating elements if any
        const existingFloating = document.getElementById('homepageFloatingElements');
        if (existingFloating) {
            existingFloating.remove();
        }

        const floatingContainer = document.createElement('div');
        floatingContainer.className = 'floating-elements';
        floatingContainer.id = 'homepageFloatingElements';
        
        const jewels = ['💎', '✨', '🔶', '💍', '🌟', '💫', '⭐', '🔸', '💠'];
        const elementCount = this.isMobile ? 6 : 9;
        
        for (let i = 0; i < elementCount; i++) {
            const element = this.createHomepageFloatingElement(jewels[i], i, elementCount);
            floatingContainer.appendChild(element);
        }
        
        heroSection.appendChild(floatingContainer);
        console.log('🎈 Homepage floating elements created');
    }

    createHomepageFloatingElement(jewel, index, totalCount) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.textContent = jewel;
        
        const position = ((index + 1) * (100 / (totalCount + 1)));
        const delay = index * 0.7;
        const duration = 8 + Math.random() * 4;
        const size = 1.2 + Math.random() * 0.8;
        
        element.style.left = `${position}%`;
        element.style.animationDelay = `${delay}s`;
        element.style.animationDuration = `${duration}s`;
        element.style.fontSize = `${size}rem`;
        element.style.opacity = '0.8';
        element.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        return element;
    }
}

// ===== FLOATING ELEMENTS MANAGER FOR HOMEPAGE =====
class FloatingElementsManager {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.init();
    }

    init() {
        // Only initialize on homepage
        if (this.isHomePage() && !document.getElementById('homepageFloatingElements')) {
            this.createFloatingElements();
            this.setupResizeHandler();
        }
    }

    isHomePage() {
        return document.querySelector('.hero') !== null && 
               !window.location.pathname.includes('login.html') &&
               !window.location.pathname.includes('register.html');
    }

    createFloatingElements() {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;

        const floatingContainer = document.createElement('div');
        floatingContainer.className = 'floating-elements';
        floatingContainer.id = 'homepageFloatingElements';
        
        const jewels = ['💎', '✨', '🔶', '💍', '🌟', '💫', '⭐', '🔸', '💠'];
        const elementCount = this.isMobile ? 6 : 9;
        
        for (let i = 0; i < elementCount; i++) {
            const element = this.createFloatingElement(jewels[i], i, elementCount);
            floatingContainer.appendChild(element);
        }
        
        heroSection.appendChild(floatingContainer);
        console.log(`🎈 Created ${elementCount} homepage floating elements`);
    }

    createFloatingElement(jewel, index, totalCount) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.textContent = jewel;
        
        // Calculate position for even distribution
        const position = ((index + 1) * (100 / (totalCount + 1)));
        
        // Randomize properties for natural look
        const delay = index * 0.7;
        const duration = 8 + Math.random() * 4;
        const size = 1.2 + Math.random() * 0.8;
        
        element.style.left = `${position}%`;
        element.style.animationDelay = `${delay}s`;
        element.style.animationDuration = `${duration}s`;
        element.style.fontSize = `${size}rem`;
        element.style.opacity = '0.8';
        
        // Add slight rotation for variety
        element.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        return element;
    }

    setupResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const newIsMobile = window.innerWidth <= 768;
                if (newIsMobile !== this.isMobile) {
                    this.isMobile = newIsMobile;
                    this.createFloatingElements();
                }
            }, 250);
        });
    }
}

// ===== MAIN APP CODE =====
document.addEventListener("DOMContentLoaded", () => {
    console.log('DOMContentLoaded - Main app code running');
    
    // Initialize Royal Animation
    new RoyalAnimation();

    // Initialize Floating Elements Manager
    const floatingManager = new FloatingElementsManager();
    
    // Initialize Jewellery Display
    const jewelleryDisplay = new JewelleryDisplay();

    // ===== REGISTER FORM =====
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("regName").value.trim();
            const address = document.getElementById("regAddress").value.trim();
            const phone = document.getElementById("regPhone").value.trim();
            const checkbox = document.getElementById("termsCheckbox");

            if (!checkbox.checked) return alert("You must agree to the Terms and Privacy Policy.");
            if (!name || !address || !/^\d{10}$/.test(phone)) return alert("Please enter valid details.");

            try {
                const res = await fetch("https://jewellery-website-5xi0.onrender.com/api/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, address, phone })
                });
                const data = await res.json();
                if (res.ok) {
                    alert(data.message || "Registration successful!");
                    registerForm.reset();
                    window.location.href = "login.html";
                } else {
                    alert(data.message || "Something went wrong!");
                }
            } catch (err) {
                console.error(err);
                alert("Server error. Try again later.");
            }
        });
    }

    // ===== LOGIN FORM WITH OTP =====
    const sendOtpBtn = document.getElementById("sendOtpBtn");
    const loginBtn = document.getElementById("loginBtn");
    const otpGroup = document.querySelector(".otp-group");

    if (sendOtpBtn) {
        sendOtpBtn.addEventListener("click", async () => {
            const phone = document.getElementById("loginPhone").value.trim();
            if (!/^\d{10}$/.test(phone)) return alert("Enter a valid 10-digit phone number.");

            try {
                const res = await fetch("https://jewellery-website-5xi0.onrender.com/api/login-otp", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ phone })
                });
                const data = await res.json();
                if (res.ok) {
                    alert("OTP sent! Check your SMS.");
                    otpGroup.style.display = "block";
                    sendOtpBtn.style.display = "none";
                    loginBtn.style.display = "block";
                    localStorage.setItem("userPhone", phone);
                } else {
                    alert(data.error);
                }
            } catch (err) {
                console.error(err);
                alert("Server error. Try again later.");
            }
        });
    }

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const phone = localStorage.getItem("userPhone");
            const otp = document.getElementById("otp").value.trim();

            try {
                const res = await fetch("https://jewellery-website-5xi0.onrender.com/api/login-verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ phone, otp })
                });
                const data = await res.json();
                if (res.ok) {
                    alert("Login successful!");
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("userName", data.name);
                    window.location.href = "index.html";
                } else {
                    alert(data.error);
                }
            } catch (err) {
                console.error(err);
                alert("Server error. Try again later.");
            }
        });
    }

    // ===== GLOBAL VARIABLES =====
    const userPhone = localStorage.getItem("userPhone");
    const userName = localStorage.getItem("userName");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    // ===== NAVBAR LOGIN / LOGOUT =====
    const loginBtnNav = document.getElementById("loginbtn");
    if (isLoggedIn) {
        const displayName = userName || userPhone;
        const marquee = document.querySelector(".marquee");
        if (marquee) marquee.textContent = `🎉 Welcome, ${displayName}! Explore our jewellery collections! ✨`;
        if (loginBtnNav) loginBtnNav.style.display = "none";

        const navLinks = loginBtnNav?.parentNode;
        if (navLinks) {
            const logoutBtn = document.createElement("a");
            logoutBtn.textContent = "Logout";
            logoutBtn.href = "#";
            logoutBtn.className = "btn";
            logoutBtn.style.marginLeft = "10px";
            logoutBtn.onclick = e => {
                e.preventDefault();
                localStorage.clear();
                sessionStorage.clear();
                window.location.reload();
            };
            navLinks.appendChild(logoutBtn);
        }
    }

    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        if (navbar) {
            navbar.style.background = window.scrollY > 50
                ? "rgba(255, 255, 255, 0.9)"
                : "rgba(255, 255, 255, 0.25)";
        }
    });

    // ===== HERO BUTTON SCROLL =====
    const scrollBtn = document.querySelector(".hero .btn");
    if (scrollBtn) scrollBtn.addEventListener("click", () => {
        document.querySelector("#collections").scrollIntoView({ behavior: "smooth" });
    });

    // ===== PERFORMANCE OPTIMIZATIONS =====
    // Throttle scroll events for better performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                jewelleryDisplay.revealCards();
                scrollTimeout = null;
            }, 100);
        }
    });

    console.log('👑 Royal Jewellery App Initialized Successfully');
});
