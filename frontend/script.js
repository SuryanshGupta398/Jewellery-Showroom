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
        for (let i = 0; i < 50; i++) {
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
                description: `Beautiful ${karat} ${material} ${category} with ${type.toLowerCase()} design. Perfect for special occasions.`,
                rating: (Math.random() * 0.5 + 4.5).toFixed(1),
                reviewCount: Math.floor(Math.random() * 200) + 50,
                badge: Math.random() > 0.7 ? (Math.random() > 0.5 ? 'Bestseller' : 'New') : null
            });
        }
    });
    
    return jewelleryData;
}

// ===== JEWELLERY DISPLAY SYSTEM =====
class JewelleryDisplay {
    constructor() {
        this.jewelleryData = generateJewelleryData();
        this.currentCategory = 'all';
        this.displayedProducts = 12;
        this.productsPerLoad = 12;
        this.init();
    }

    init() {
        console.log('🔄 Initializing Jewellery Display with', this.jewelleryData.length, 'items');
        this.renderProducts();
        this.setupEventListeners();
    }

    renderProducts() {
        const collectionGrid = document.getElementById('collectionGrid');
        if (!collectionGrid) {
            console.error('❌ collectionGrid not found!');
            return;
        }

        collectionGrid.innerHTML = '';
        
        const filteredProducts = this.currentCategory === 'all' 
            ? this.jewelleryData 
            : this.jewelleryData.filter(item => item.category === this.currentCategory);
        
        const productsToShow = filteredProducts.slice(0, this.displayedProducts);
        
        console.log(`🎯 Rendering ${productsToShow.length} items for category: ${this.currentCategory}`);
        
        productsToShow.forEach(product => {
            const productCard = this.createProductCard(product);
            collectionGrid.appendChild(productCard);
        });
        
        // Show/hide load more button
        this.updateLoadMoreButton(filteredProducts.length);
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-category', product.category);
        card.setAttribute('data-product-id', product.id);
        
        let badgeHTML = '';
        if (product.badge) {
            badgeHTML = `<div class="card-badge">${product.badge}</div>`;
        }
        
        card.innerHTML = `
            ${badgeHTML}
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="card-actions">
                <button class="action-btn"><i class="fas fa-heart"></i></button>
                <button class="action-btn view-details-btn"><i class="fas fa-eye"></i></button>
            </div>
            <div class="card-info">
                <h3>${product.name}</h3>
                <p class="description">${product.description}</p>
                <p class="price">₹${this.formatPrice(product.basePrice)}</p>
                <button class="details-btn" data-product-id="${product.id}">View Details</button>
                <div class="quantity-control">
                    <button class="decrease">-</button>
                    <span class="qty">1</span>
                    <button class="increase">+</button>
                </div>
                <div class="rating">
                    ${this.generateStarRating(product.rating)}
                    <span>(${product.reviewCount})</span>
                </div>
                <button class="btn add-to-cart" data-product-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        // Add event listeners
        this.attachCardEventListeners(card, product);
        return card;
    }

    attachCardEventListeners(card, product) {
        // View details button
        const detailsBtn = card.querySelector('.details-btn');
        detailsBtn.addEventListener('click', () => this.showProductDetails(product.id));

        // View details from eye icon
        const viewDetailsBtn = card.querySelector('.view-details-btn');
        viewDetailsBtn.addEventListener('click', () => this.showProductDetails(product.id));

        // Quantity controls
        const decreaseBtn = card.querySelector('.decrease');
        const increaseBtn = card.querySelector('.increase');
        const qtySpan = card.querySelector('.qty');
        
        decreaseBtn.addEventListener('click', () => {
            let qty = parseInt(qtySpan.textContent);
            if (qty > 1) {
                qtySpan.textContent = qty - 1;
            }
        });
        
        increaseBtn.addEventListener('click', () => {
            let qty = parseInt(qtySpan.textContent);
            qtySpan.textContent = qty + 1;
        });

        // Add to cart button
        const addToCartBtn = card.querySelector('.add-to-cart');
        addToCartBtn.addEventListener('click', () => this.addToCart(product.id));
    }

    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let starsHTML = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        
        return starsHTML;
    }

    showProductDetails(productId) {
        const product = this.jewelleryData.find(p => p.id === productId);
        if (!product) return;
        
        const modal = document.getElementById('productModal');
        const productDetails = document.getElementById('productDetails');
        
        // Calculate base price per gram
        const basePricePerGram = product.basePrice / parseFloat(product.defaultWeight);
        
        productDetails.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                
                <div class="specifications">
                    <div class="spec-item">
                        <label>Material:</label>
                        <span>${product.material.charAt(0).toUpperCase() + product.material.slice(1)}</span>
                    </div>
                    <div class="spec-item">
                        <label>Default Weight:</label>
                        <span>${product.defaultWeight} grams</span>
                    </div>
                    ${product.karat ? `
                    <div class="spec-item">
                        <label>Karat:</label>
                        <span>${product.karat.toUpperCase()}</span>
                    </div>
                    ` : ''}
                </div>
                
                ${product.material === 'gold' ? `
                <div class="karat-selection">
                    <h4>Select Gold Purity:</h4>
                    <div class="karat-options">
                        <button class="karat-btn ${product.karat === '24k' ? 'active' : ''}" data-karat="24k">24K</button>
                        <button class="karat-btn ${product.karat === '22k' ? 'active' : ''}" data-karat="22k">22K</button>
                        <button class="karat-btn ${product.karat === '18k' ? 'active' : ''}" data-karat="18k">18K</button>
                    </div>
                </div>
                ` : ''}
                
                <div class="weight-selection">
                    <h4>Select Weight (grams):</h4>
                    <div class="weight-options">
                        <button class="weight-btn active" data-weight="${product.defaultWeight}">${product.defaultWeight}g (Standard)</button>
                        <button class="weight-btn" data-weight="${(parseFloat(product.defaultWeight) * 1.5).toFixed(2)}">${(parseFloat(product.defaultWeight) * 1.5).toFixed(2)}g</button>
                        <button class="weight-btn" data-weight="${(parseFloat(product.defaultWeight) * 2).toFixed(2)}">${(parseFloat(product.defaultWeight) * 2).toFixed(2)}g</button>
                    </div>
                </div>
                
                <div class="dynamic-price">
                    Final Price: ₹<span id="finalPrice">${this.formatPrice(product.basePrice)}</span>
                </div>
                
                <div class="price-breakdown">
                    <p>Base Price (${product.defaultWeight}g): ₹${this.formatPrice(product.basePrice)}</p>
                    <p id="karatAdjustment">${product.material === 'gold' ? 'Karat Adjustment: ₹0' : ''}</p>
                    <p id="weightAdjustment">Weight Adjustment: ₹0</p>
                </div>
                
                <div class="rating">
                    ${this.generateStarRating(product.rating)}
                    <span>(${product.reviewCount} reviews)</span>
                </div>
                
                <button class="btn add-to-cart-modal" data-product-id="${product.id}" style="width: 100%; margin-top: 20px;">
                    <i class="fas fa-shopping-cart"></i> Add to Cart with Customizations
                </button>
            </div>
        `;
        
        // Set up event listeners for modal
        this.attachModalEventListeners(product, basePricePerGram);
        
        // Show the modal
        modal.style.display = 'block';
    }

    attachModalEventListeners(product, basePricePerGram) {
        const modal = document.getElementById('productModal');
        
        // Karat selection
        if (product.material === 'gold') {
            const karatBtns = document.querySelectorAll('.karat-btn');
            karatBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    karatBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.updateModalPrice(product, basePricePerGram);
                });
            });
        }
        
        // Weight selection
        const weightBtns = document.querySelectorAll('.weight-btn');
        weightBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                weightBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.updateModalPrice(product, basePricePerGram);
            });
        });
        
        // Add to cart from modal
        const addToCartModal = document.querySelector('.add-to-cart-modal');
        addToCartModal.addEventListener('click', () => {
            const selectedKarat = product.material === 'gold' ? 
                document.querySelector('.karat-btn.active').getAttribute('data-karat') : product.karat;
            const selectedWeight = parseFloat(
                document.querySelector('.weight-btn.active').getAttribute('data-weight')
            );
            
            this.addToCartWithCustomizations(product, selectedWeight, selectedKarat);
            modal.style.display = 'none';
        });
    }

    updateModalPrice(product, basePricePerGram) {
        const selectedKarat = product.material === 'gold' ? 
            document.querySelector('.karat-btn.active').getAttribute('data-karat') : product.karat;
        const selectedWeight = parseFloat(
            document.querySelector('.weight-btn.active').getAttribute('data-weight')
        );
        
        // Calculate new price
        const newPrice = this.calculateCustomPrice(product, selectedWeight, selectedKarat);
        
        // Calculate adjustments
        const karatAdjustment = product.material === 'gold' ? 
            newPrice - (basePricePerGram * selectedWeight * (currentGoldPrices[product.karat] / currentGoldPrices[selectedKarat])) : 0;
        const weightAdjustment = newPrice - product.basePrice;
        
        // Update display
        document.getElementById('finalPrice').textContent = this.formatPrice(newPrice);
        
        if (product.material === 'gold') {
            document.getElementById('karatAdjustment').textContent = 
                `Karat Adjustment: ₹${this.formatPrice(Math.round(karatAdjustment))}`;
        }
        
        document.getElementById('weightAdjustment').textContent = 
            `Weight Adjustment: ₹${this.formatPrice(Math.round(weightAdjustment))}`;
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

        console.log('Adding to cart with customizations:', customItem);
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

    updateLoadMoreButton(totalProducts) {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (!loadMoreBtn) return;

        if (this.displayedProducts >= totalProducts) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }

    setupEventListeners() {
        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.currentCategory = button.getAttribute('data-category');
                this.displayedProducts = 12;
                this.renderProducts();
            });
        });
        
        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.displayedProducts += this.productsPerLoad;
                this.renderProducts();
            });
        }
        
        // Close modal
        const closeModal = document.getElementById('closeModal');
        const modal = document.getElementById('productModal');
        
        if (closeModal && modal) {
            closeModal.addEventListener('click', () => {
                modal.style.display = 'none';
            });
            
            // Close modal when clicking outside
            window.addEventListener('click', (event) => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    }

    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
}

// ===== ROYAL ANIMATION SYSTEM =====
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
        const showAgain = new URLSearchParams(window.location.search).get('showAnimation') === 'true';
        const forceShow = localStorage.getItem('forceShowAnimation') === 'true';
        
        if (isHomePage && (!this.animationShown || showAgain || forceShow)) {
            if (forceShow) localStorage.removeItem('forceShowAnimation');
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
        document.body.style.overflow = 'hidden';
        
        const overlay = this.createRoyalOverlay();
        document.body.appendChild(overlay);
        
        this.startRoyalCountdown();
    }

    createRoyalOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'royal-welcome-overlay';
        overlay.id = 'royalWelcomeOverlay';
        overlay.innerHTML = `
            <div class="royal-welcome-container">
                <div class="royal-welcome-card">
                    <div class="royal-crown">👑</div>
                    <div class="royal-logo">Prabhanjan Mragendra Jewellers PVT LTD</div>
                    <div class="royal-tagline">Prabhanjan Jewellers</div>
                    <div class="royal-message">
                        Enter our exclusive world of luxury jewellery, where every piece tells a story of royal craftsmanship and timeless elegance.
                    </div>
                    <button class="royal-enter-btn" id="royalEnterBtn">
                        <i class="fas fa-gem"></i> Enter Royal Boutique
                    </button>
                    <div class="royal-countdown" id="royalCountdown">
                        Entering automatically in <span id="countdownNumber">5</span> seconds
                    </div>
                </div>
            </div>
        `;

        overlay.querySelector('#royalEnterBtn').addEventListener('click', () => this.enterBoutique());
        return overlay;
    }

    startRoyalCountdown() {
        let countdown = 5;
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
        const showNextTime = localStorage.getItem('showAnimationNextTime') === 'true';
        if (!showNextTime) {
            sessionStorage.setItem('royalAnimationShown', 'true');
        }
        
        const overlay = document.getElementById('royalWelcomeOverlay');
        if (overlay) {
            overlay.remove();
        }
        
        this.showMainContent();
    }

    showMainContent() {
        document.body.style.overflow = 'auto';
        this.addAnimationToggleButton();
    }

    skipAnimation() {
        sessionStorage.setItem('royalAnimationShown', 'true');
        this.showMainContent();
    }

    addAnimationToggleButton() {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && !document.getElementById('showAnimationBtn')) {
            const showAnimationBtn = document.createElement('a');
            showAnimationBtn.id = 'showAnimationBtn';
            showAnimationBtn.href = '#';
            showAnimationBtn.className = 'btn';
            showAnimationBtn.innerHTML = '<i class="fas fa-crown"></i> Show Intro';
            showAnimationBtn.style.marginLeft = '10px';
            
            showAnimationBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.setItem('forceShowAnimation', 'true');
                window.location.reload();
            });
            
            navLinks.appendChild(showAnimationBtn);
        }
    }
}

// ===== MAIN APP INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
    console.log('DOMContentLoaded - Main app code running');
    
    // Initialize Royal Animation
    new RoyalAnimation();

    // Initialize Jewellery Display
    const jewelleryDisplay = new JewelleryDisplay();

    // ===== NAVBAR FUNCTIONALITY =====
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userPhone = localStorage.getItem("userPhone");
    const userName = localStorage.getItem("userName");
    const loginBtnNav = document.getElementById("loginbtn");

    // Update navbar for logged in users
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

    console.log('👑 Royal Jewellery App Initialized Successfully');
});
