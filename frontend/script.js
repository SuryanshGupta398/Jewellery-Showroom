// ===== CURRENT GOLD PRICES IN INDIA (per gram) =====
const goldPrices = {
    '24k': 13250,  // per gram (approx 24k price based on 22k)
    '22k': 12135,  // per gram (current market rate)
    '18k': 9920    // per gram (approx 18k price based on 22k)
};

// ===== JEWELLERY DATA =====
const products = [];
const categories = ['rings', 'necklaces', 'bracelets', 'earrings'];
const materials = ['Gold', 'Silver', 'Diamond', 'Pearl', 'Platinum'];
const designs = ['Classic', 'Modern', 'Vintage', 'Contemporary', 'Art Deco', 'Minimalist'];

// Generate 50 products for each category
categories.forEach(category => {
  for (let i = 1; i <= 50; i++) {
    const material = materials[Math.floor(Math.random() * materials.length)];
    const design = designs[Math.floor(Math.random() * designs.length)];
    
    // Calculate realistic base price based on material and weight
    const weight = (Math.random() * 10 + 5).toFixed(2); // Weight between 5g and 15g
    let basePrice;
    
    if (material === 'Gold') {
      // For gold items, base price is calculated based on 22k gold rate
      basePrice = Math.round(goldPrices['22k'] * weight * 1.2); // Adding 20% for making charges
    } else if (material === 'Diamond') {
      basePrice = Math.floor(Math.random() * 100000) + 50000; // Between 50,000 and 150,000
    } else if (material === 'Platinum') {
      basePrice = Math.floor(Math.random() * 80000) + 40000; // Between 40,000 and 120,000
    } else {
      basePrice = Math.floor(Math.random() * 30000) + 5000; // Between 5,000 and 35,000
    }
    
    products.push({
      id: `${category}-${i}`,
      name: `${material} ${design} ${category.charAt(0).toUpperCase() + category.slice(1)}`,
      category: category,
      price: basePrice,
      image: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 10000000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80`,
      description: `Exquisite ${material.toLowerCase()} ${category} with ${design.toLowerCase()} design. Handcrafted to perfection.`,
      weight: weight,
      karat: material === 'Gold' ? ['18k', '22k', '24k'] : null,
      material: material,
      rating: (Math.random() * 0.5 + 4.5).toFixed(1), // Rating between 4.5 and 5.0
      reviewCount: Math.floor(Math.random() * 200) + 50, // Between 50 and 250 reviews
      badge: Math.random() > 0.7 ? (Math.random() > 0.5 ? 'Bestseller' : 'New') : null,
      makingCharges: 0.2 // 20% making charges
    });
  }
});

// ===== JEWELLERY DISPLAY SYSTEM =====
class JewelleryDisplay {
    constructor() {
        this.currentCategory = 'all';
        this.displayedProducts = 12;
        this.productsPerLoad = 12;
        this.init();
    }

    init() {
        console.log('🔄 Initializing Jewellery Display with', products.length, 'items');
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
            ? products 
            : products.filter(product => product.category === this.currentCategory);
        
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
                <p class="price">₹${this.formatPrice(product.price)}</p>
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
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        const modal = document.getElementById('productModal');
        const productDetails = document.getElementById('productDetails');
        
        // Calculate base price per gram for gold items
        const basePricePerGram = product.material === 'Gold' ? 
            (product.price / (1 + product.makingCharges)) / parseFloat(product.weight) : 0;
        
        productDetails.innerHTML = `
            <div class="product-image" id="productImage">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <p><strong>Material:</strong> ${product.material}</p>
                <p><strong>Weight:</strong> ${product.weight} grams</p>
                
                ${product.karat ? `
                <div class="karat-selection">
                    <h4>Select Gold Purity:</h4>
                    <div class="karat-options">
                        <button class="karat-btn" data-karat="18k">18K Gold</button>
                        <button class="karat-btn active" data-karat="22k">22K Gold</button>
                        <button class="karat-btn" data-karat="24k">24K Gold</button>
                    </div>
                    <p><small>Current Gold Rate: 22K - ₹${goldPrices['22k'].toLocaleString()}/gm | 18K - ₹${goldPrices['18k'].toLocaleString()}/gm | 24K - ₹${goldPrices['24k'].toLocaleString()}/gm</small></p>
                </div>
                ` : ''}
                
                <div class="weight-selection">
                    <h4>Select Weight (grams):</h4>
                    <div class="weight-options">
                        <button class="weight-btn active" data-weight="${product.weight}">${product.weight}g (Standard)</button>
                        <button class="weight-btn" data-weight="${(parseFloat(product.weight) * 1.5).toFixed(2)}">${(parseFloat(product.weight) * 1.5).toFixed(2)}g</button>
                        <button class="weight-btn" data-weight="${(parseFloat(product.weight) * 2).toFixed(2)}">${(parseFloat(product.weight) * 2).toFixed(2)}g</button>
                    </div>
                </div>
                
                <div class="dynamic-price">
                    Final Price: ₹<span id="finalPrice">${this.formatPrice(product.price)}</span>
                </div>
                
                <div class="price-breakdown">
                    <p>Base Price (${product.weight}g): ₹${this.formatPrice(Math.round(product.price / (1 + product.makingCharges)))}</p>
                    ${product.karat ? '<p id="karatAdjustment">Karat Adjustment: ₹0</p>' : ''}
                    <p id="weightAdjustment">Weight Adjustment: ₹0</p>
                    <p>Making Charges (20%): ₹${this.formatPrice(Math.round(product.price * product.makingCharges))}</p>
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
        if (product.material === 'Gold') {
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
            const selectedKarat = product.material === 'Gold' ? 
                document.querySelector('.karat-btn.active').getAttribute('data-karat') : product.karat;
            const selectedWeight = parseFloat(
                document.querySelector('.weight-btn.active').getAttribute('data-weight')
            );
            
            this.addToCartWithCustomizations(product, selectedWeight, selectedKarat);
            modal.style.display = 'none';
        });

        // Image zoom functionality
        const productImage = document.getElementById('productImage');
        if (productImage) {
            productImage.addEventListener('click', function() {
                this.classList.toggle('zoomed');
            });
        }
    }

    updateModalPrice(product, basePricePerGram) {
        const selectedKarat = product.material === 'Gold' ? 
            document.querySelector('.karat-btn.active').getAttribute('data-karat') : null;
        const selectedWeight = parseFloat(
            document.querySelector('.weight-btn.active').getAttribute('data-weight')
        );
        
        let finalPrice;
        
        if (product.material === 'Gold') {
            // For gold items, calculate based on gold rate
            const goldValue = goldPrices[selectedKarat] * selectedWeight;
            const makingCharges = goldValue * product.makingCharges;
            finalPrice = goldValue + makingCharges;
        } else {
            // For non-gold items, calculate based on weight multiplier
            const weightMultiplier = selectedWeight / parseFloat(product.weight);
            finalPrice = product.price * weightMultiplier;
        }
        
        // Calculate adjustments
        const karatAdjustment = product.karat ? 
            finalPrice - (product.price * (selectedWeight / parseFloat(product.weight))) : 0;
        
        const weightAdjustment = finalPrice - product.price;
        
        // Update display
        document.getElementById('finalPrice').textContent = this.formatPrice(Math.round(finalPrice));
        
        if (product.karat) {
            document.getElementById('karatAdjustment').textContent = 
                `Karat Adjustment: ₹${this.formatPrice(Math.round(karatAdjustment))}`;
        }
        
        document.getElementById('weightAdjustment').textContent = 
            `Weight Adjustment: ₹${this.formatPrice(Math.round(weightAdjustment))}`;
    }

    addToCartWithCustomizations(item, weight, karat) {
        let finalPrice;
        
        if (item.material === 'Gold') {
            const goldValue = goldPrices[karat] * weight;
            const makingCharges = goldValue * item.makingCharges;
            finalPrice = goldValue + makingCharges;
        } else {
            const weightMultiplier = weight / parseFloat(item.weight);
            finalPrice = item.price * weightMultiplier;
        }

        const customItem = {
            ...item,
            customWeight: weight,
            customKarat: karat,
            finalPrice: Math.round(finalPrice),
            originalPrice: item.price
        };

        console.log('Adding to cart with customizations:', customItem);
        this.addToCart(item.id, customItem);
    }

    addToCart(itemId, customItem = null) {
        const item = customItem || products.find(i => i.id === itemId);
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
            price: customItem ? item.finalPrice : item.price,
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

        // Explore button
        const exploreBtn = document.querySelector('.hero .btn');
        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => {
                document.getElementById('collections').scrollIntoView({ behavior: 'smooth' });
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

    console.log('👑 Royal Jewellery App Initialized Successfully');
});

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

// ===== QUANTITY INCREMENT / DECREMENT ON HOMEPAGE =====
document.querySelectorAll(".card-info").forEach(card => {
    const decreaseBtn = card.querySelector(".decrease");
    const increaseBtn = card.querySelector(".increase");
    const qtySpan = card.querySelector(".qty");

    if (decreaseBtn && increaseBtn && qtySpan) {
        decreaseBtn.addEventListener("click", () => {
            let qty = parseInt(qtySpan.textContent);
            if (qty > 1) qtySpan.textContent = qty - 1;
        });

        increaseBtn.addEventListener("click", () => {
            let qty = parseInt(qtySpan.textContent);
            qtySpan.textContent = qty + 1;
        });
    }
});

// ===== ADD TO CART FUNCTION =====
async function handleAddToCart(card) {
    if (!isLoggedIn) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    const productId = card.dataset.productId || card.querySelector("h3").textContent;
    const name = card.querySelector("h3").innerText;
    const price = parseInt(card.querySelector(".price").innerText.replace(/[₹,]/g, ""));
    const image = card.closest(".card").querySelector("img").src;

    let quantity = 1;
    const qtyEl = card.querySelector(".qty");
    if (qtyEl) quantity = parseInt(qtyEl.textContent) || 1;

    const product = { productId, name, price, image, quantity };

    try {
        const res = await fetch("https://jewellery-website-5xi0.onrender.com/api/cart/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone: userPhone, product })
        });
        const data = await res.json();
        if (res.ok) {
            alert(`${name} added to your cart (x${quantity})!`);
            updateCartUI(data.cart);

            if (qtyEl) qtyEl.textContent = 1; // reset after add
        } else {
            alert(data.message || "Error adding item to cart");
        }
    } catch (err) {
        console.error(err);
        alert("Unable to add item. Try again later.");
    }
}

// ===== UPDATE CART UI =====
function updateCartUI(cart) {
    const cartContainer = document.querySelector(".cart-items");
    if (!cartContainer) return;

    cartContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item) => {
        total += item.price * item.quantity;
        cartContainer.innerHTML += `
            <div class="cart-item">
                <span>${item.name}</span>
                <div class="quantity-controls">
                    <button class="decrease" data-id="${item.productId}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase" data-id="${item.productId}">+</button>
                </div>
                <span>₹${item.price * item.quantity}</span>
            </div>
        `;
    });

    const totalEl = document.querySelector(".cart-total");
    if (totalEl) totalEl.textContent = `Total: ₹${total}`;

    document.querySelectorAll(".increase").forEach(btn => {
        btn.addEventListener("click", () => changeQuantity(btn.dataset.id, 1));
    });
    document.querySelectorAll(".decrease").forEach(btn => {
        btn.addEventListener("click", () => changeQuantity(btn.dataset.id, -1));
    });
}

// ===== CHANGE QUANTITY (Backend) =====
async function changeQuantity(productId, delta) {
    try {
        const phone = localStorage.getItem("userPhone");
        const resCart = await fetch(`https://jewellery-website-5xi0.onrender.com/api/cart?phone=${phone}`);
        const data = await resCart.json();
        const item = data.cart.find(i => i.productId === productId);
        if (!item) return;

        const newQty = item.quantity + delta;
        const res = await fetch("https://jewellery-website-5xi0.onrender.com/api/cart/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, productId, quantity: newQty })
        });
        const updatedData = await res.json();
        if (res.ok) updateCartUI(updatedData.cart);
        else alert(updatedData.message || "Error updating quantity");
    } catch (err) {
        console.error(err);
        alert("Server error. Try again later.");
    }
}

// ===== INITIALIZE CART =====
if (isLoggedIn) {
    fetch(`https://jewellery-website-5xi0.onrender.com/api/cart?phone=${encodeURIComponent(userPhone)}`)
        .then(res => res.json())
        .then(data => updateCartUI(data.cart))
        .catch(err => console.error(err));
}

// ===== ADD TO CART BUTTON EVENTS =====
document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", e => {
        const card = e.target.closest(".card-info");
        if (!card) return;
        handleAddToCart(card);
    });
});

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

// ===== CARD REVEAL ANIMATION =====
const cards = document.querySelectorAll(".card");
function revealCards() {
    const triggerBottom = window.innerHeight * 0.85;
    cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        if (cardTop < triggerBottom) {
            card.classList.add("visible");
        }
    });
}

// Initialize card animations
window.addEventListener("scroll", revealCards);
window.addEventListener("load", revealCards);

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

// ===== FILTER FUNCTIONALITY =====
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        // Remove active class from all
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const category = btn.dataset.category;

        cards.forEach(card => {
            if (category === "all" || card.dataset.category === category) {
                card.style.display = "block";
                setTimeout(() => card.classList.add("visible"), 50);
            } else {
                card.style.display = "none";
                card.classList.remove("visible");
            }
        });

        // Smooth scroll to collections section
        const collectionsSection = document.querySelector("#collections");
        if (collectionsSection) {
            collectionsSection.scrollIntoView({ behavior: "smooth" });
        }
    });
});

// ===== PERFORMANCE OPTIMIZATIONS =====
// Throttle scroll events for better performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            revealCards();
            scrollTimeout = null;
        }, 100);
    }
});

console.log('👑 Royal Jewellery App Initialized Successfully');
