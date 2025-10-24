
// ===== ROYAL PREMIUM ANIMATION WITH FLOATING ELEMENTS =====
class RoyalAnimation {
    constructor() {
        this.animationShown = sessionStorage.getItem('royalAnimationShown');
        this.isMobile = this.checkMobile();
        this.initRoyalAnimation();
    }
    checkMobile() {
        return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    // Rename init to initRoyalAnimation to avoid conflicts
    initRoyalAnimation() {
        const isHomePage = this.isHomePage();
        const showAgain = new URLSearchParams(window.location.search).get('showAnimation') === 'true';
        const forceShow = localStorage.getItem('forceShowAnimation') === 'true';

        if (isHomePage && (!this.animationShown || showAgain || forceShow)) {
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
const products = [
    // Rings (20 items)
    {
        id: 'ring-1',
        name: 'Royal Diamond Ring',
        category: 'rings',
        price: 270000,
        oldPrice: 250000,
        image: 'ChatGPT Image Oct 17, 2025, 12_05_29 PM.png',
        description: 'Exquisite diamond ring with premium gold setting.',
        material: 'Gold',
        purities: ['18K', '22K', '24K'],
        purityPrices: {
            '18K': -5000,
            '22K': 0,
            '24K': 8000
        },
        weight: '8.5g',
        stone: 'Diamond',
        stoneWeight: '0.5ct',
        makingCharges: '15%',
        warranty: '2 Years',
        rating: 4.8,
        reviewCount: 124,
        badge: 'Bestseller'
    },
    {
        id: 'ring-2',
        name: 'Elegant Emerald Ring',
        category: 'rings',
        price: 92000,
        oldPrice: 88000,
        image: 'ChatGPT Image Oct 18, 2025, 01_39_39 AM.png',
        images: [
            'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
            'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400'
        ],
        description: 'Beautiful emerald ring with intricate gold work. A timeless piece for the modern woman.',
        material: 'Gold',
        purities: ['18K', '22K', '24K'],
        purityPrices: {
            '18K': -5000,
            '22K': 0,
            '24K': 8000
        },
        weight: '7.2g',
        stone: 'Emerald',
        stoneWeight: '2.5ct',
        makingCharges: '12%',
        warranty: '1 Year',
        rating: 4.6,
        reviewCount: 89
    },
    {
        id: 'ring-3',
        name: 'Classic Gold Band',
        category: 'rings',
        price: 87611,
        image: 'eb528f17-564f-41bd-90cc-3557537678c8.png',
        description: 'Simple yet elegant gold band for daily wear. Crafted with precision and care.',
        material: 'Gold',
        purities: ['18K', '22K', '24K'],
        purityPrices: {
            '18K': -5000,
            '22K': 0,
            '24K': 8000
        },
        weight: '6.8g',
        makingCharges: '10%',
        warranty: 'Lifetime',
        rating: 4.4,
        reviewCount: 67
    },
    {
        id: 'ring-4',
        name: 'Ruby Cluster Ring',
        category: 'rings',
        price: 170000,
        oldPrice: 150000,
        image: 'ChatGPT Image Oct 18, 2025, 01_45_59 AM.png',
        description: 'Stunning ruby cluster ring with diamond accents. A statement piece for special events.',
        material: 'Gold',
        purities: ['18K', '22K', '24K'],
        purityPrices: {
            '18K': -5000,
            '22K': 0,
            '24K': 8000
        },
        weight: '9.2g',
        stone: 'Ruby & Diamond',
        stoneWeight: '3.1ct',
        makingCharges: '18%',
        warranty: '2 Years',
        rating: 4.9,
        reviewCount: 156,
        badge: 'New'
    },
    {
        id: 'ring-5',
        name: 'Pearl & Diamond Ring',
        category: 'rings',
        price: 32000,
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
        description: 'Elegant combination of pearl and diamonds in a sophisticated design.',
        material: '18K Gold',
        weight: '7.5g',
        stone: 'Pearl & Diamond',
        stoneWeight: '1.8ct',
        makingCharges: '14%',
        warranty: '1 Year',
        rating: 4.5,
        reviewCount: 78
    },
    // Add 15 more rings...
    {
        id: 'ring-6', name: 'Sapphire Solitaire', category: 'rings', price: 41000, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', description: 'Beautiful sapphire solitaire ring.', material: '22K Gold', weight: '8.1g', rating: 4.7, reviewCount: 92
    },
    {
        id: 'ring-7', name: 'Tennis Diamond Ring', category: 'rings', price: 68000, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', description: 'Luxurious tennis ring with multiple diamonds.', material: '18K Gold', weight: '10.2g', rating: 4.8, reviewCount: 134
    },
    {
        id: 'ring-8', name: 'Vintage Style Ring', category: 'rings', price: 29000, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400', description: 'Vintage inspired ring with intricate details.', material: '22K Gold', weight: '7.8g', rating: 4.3, reviewCount: 56
    },
    {
        id: 'ring-9', name: 'Modern Geometric Ring', category: 'rings', price: 23000, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', description: 'Contemporary geometric design ring.', material: '18K Gold', weight: '6.5g', rating: 4.2, reviewCount: 43
    },
    {
        id: 'ring-10', name: 'Traditional Indian Ring', category: 'rings', price: 37000, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', description: 'Traditional Indian design with meenakari work.', material: '22K Gold', weight: '9.5g', rating: 4.6, reviewCount: 87
    },

    // Necklaces (20 items)
    {
        id: 'necklace-1',
        name: 'Diamond Choker Necklace',
        category: 'necklaces',
        price: 565000,
        oldPrice: 555000,
        image: 'ChatGPT Image Oct 18, 2025, 01_48_28 AM.png',
        description: 'Stunning diamond choker necklace for grand occasions.',
        material: 'Gold',
        purities: ['18K', '22K', '24K'],
        purityPrices: {
            '18K': -5000,
            '22K': 0,
            '24K': 8000
        },
        weight: '45.2g',
        stone: 'Diamond',
        stoneWeight: '8.5ct',
        makingCharges: '20%',
        warranty: '3 Years',
        rating: 4.9,
        reviewCount: 89,
        badge: 'Bestseller'
    },
    {
        id: 'necklace-2',
        name: 'Pearl Strand Necklace',
        category: 'necklaces',
        price: 68000,
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
        description: 'Elegant pearl strand necklace with gold clasp.',
        material: '18K Gold',
        weight: '32.5g',
        stone: 'Pearl',
        makingCharges: '15%',
        warranty: '2 Years',
        rating: 4.7,
        reviewCount: 67
    },
    {
        id: 'necklace-3',
        name: 'Temple Necklace',
        category: 'necklaces',
        price: 185000,
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',
        description: 'Traditional temple design necklace with intricate work.',
        material: '22K Gold',
        weight: '68.3g',
        makingCharges: '25%',
        warranty: 'Lifetime',
        rating: 4.8,
        reviewCount: 112
    },
    {
        id: 'necklace-4',
        name: 'Modern Pendant Necklace',
        category: 'necklaces',
        price: 45000,
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
        description: 'Contemporary pendant necklace with diamond accents.',
        material: '18K Gold',
        weight: '28.7g',
        stone: 'Diamond',
        stoneWeight: '1.2ct',
        makingCharges: '16%',
        warranty: '2 Years',
        rating: 4.5,
        reviewCount: 78
    },
    {
        id: 'necklace-5',
        name: 'Ruby & Emerald Necklace',
        category: 'necklaces',
        price: 156000,
        oldPrice: 175000,
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
        description: 'Magnificent necklace with ruby and emerald stones.',
        material: '22K Gold',
        weight: '52.4g',
        stone: 'Ruby & Emerald',
        stoneWeight: '12.8ct',
        makingCharges: '22%',
        warranty: '3 Years',
        rating: 4.9,
        reviewCount: 95,
        badge: 'New'
    },
    // Add 15 more necklaces...
    {
        id: 'necklace-6', name: 'Gold Chain Necklace', category: 'necklaces', price: 32000, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', description: 'Simple gold chain necklace.', material: '22K Gold', weight: '25.3g', rating: 4.3, reviewCount: 45
    },
    {
        id: 'necklace-7', name: 'Kundan Necklace', category: 'necklaces', price: 89000, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', description: 'Traditional kundan work necklace.', material: '22K Gold', weight: '48.6g', rating: 4.7, reviewCount: 82
    },
    {
        id: 'necklace-8', name: 'Diamond Riviere', category: 'necklaces', price: 210000, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400', description: 'Luxurious diamond riviere necklace.', material: '18K Gold', weight: '38.9g', rating: 4.9, reviewCount: 67
    },
    {
        id: 'necklace-9', name: 'Polki Necklace', category: 'necklaces', price: 145000, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', description: 'Traditional polki diamond necklace.', material: '22K Gold', weight: '55.1g', rating: 4.8, reviewCount: 74
    },
    {
        id: 'necklace-10', name: 'Polki Necklace', category: 'necklaces', price: 145000, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', description: 'Traditional polki diamond necklace.', material: '22K Gold', weight: '42.1g', rating: 4.8, reviewCount: 76
    },
    {
        id: 'necklace-11', name: 'Antique Gold Necklace', category: 'necklaces', price: 98000, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', description: 'Antique finish gold necklace.', material: '22K Gold', weight: '35.8g', rating: 4.6, reviewCount: 58
    },
    {
        id: 'necklace-12', name: 'Sapphire Pendant Set', category: 'necklaces', price: 112000, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400', description: 'Sapphire pendant with matching chain.', material: '18K Gold', weight: '29.4g', rating: 4.7, reviewCount: 63
    },
    {
        id: 'necklace-13', name: 'Bridal Necklace Set', category: 'necklaces', price: 235000, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', description: 'Complete bridal necklace set.', material: '22K Gold', weight: '78.5g', rating: 4.9, reviewCount: 94
    },
    {
        id: 'necklace-14', name: 'Minimalist Gold Necklace', category: 'necklaces', price: 28000, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', description: 'Simple and elegant minimalist necklace.', material: '18K Gold', weight: '18.2g', rating: 4.4, reviewCount: 41
    },
    {
        id: 'necklace-15', name: 'Statement Collar Necklace', category: 'necklaces', price: 167000, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400', description: 'Bold statement collar necklace.', material: '22K Gold', weight: '55.7g', rating: 4.8, reviewCount: 72
    },
    {
        id: 'necklace-16', name: 'Diamond Bar Necklace', category: 'necklaces', price: 76000, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', description: 'Modern diamond bar necklace.', material: '18K Gold', weight: '26.3g', rating: 4.5, reviewCount: 49
    },
    {
        id: 'necklace-17', name: 'Gold Coin Necklace', category: 'necklaces', price: 54000, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', description: 'Necklace with antique gold coins.', material: '22K Gold', weight: '31.8g', rating: 4.6, reviewCount: 55
    },
    {
        id: 'necklace-18', name: 'Emerald Drop Necklace', category: 'necklaces', price: 134000, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400', description: 'Elegant emerald drop necklace.', material: '22K Gold', weight: '39.2g', rating: 4.7, reviewCount: 68
    },
    {
        id: 'necklace-19', name: 'Ruby Cluster Necklace', category: 'necklaces', price: 198000, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', description: 'Stunning ruby cluster necklace.', material: '22K Gold', weight: '61.4g', rating: 4.9, reviewCount: 81
    },
    {
        id: 'necklace-20', name: 'Diamond Heart Pendant', category: 'necklaces', price: 67000, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', description: 'Romantic diamond heart pendant.', material: '18K Gold', weight: '22.7g', rating: 4.5, reviewCount: 52
    },

    // Bracelets (20 items)
    {
        id: 'bracelet-1',
        name: 'Diamond Tennis Bracelet',
        category: 'bracelets',
        price: 282000,
        oldPrice: 276000,
        image: 'WhatsApp Image 2025-10-18 at 02.05.08_2b08b230.jpg',
        description: 'Classic diamond tennis bracelet for elegant wear.',
        material: 'Gold',
        purities: ['18K', '22K', '24K'],
        purityPrices: {
            '18K': -5000,
            '22K': 0,
            '24K': 8000
        },
        weight: '22.5g',
        stone: 'Diamond',
        stoneWeight: '3.8ct',
        makingCharges: '18%',
        warranty: '2 Years',
        rating: 4.8,
        reviewCount: 112,
        badge: 'Bestseller'
    },
    {
        id: 'bracelet-2',
        name: 'Gold Chain Bracelet',
        category: 'bracelets',
        price: 230000,
        image: 'WhatsApp Image 2025-10-18 at 02.01.42_3cdd83a2.jpg',
        description: 'Simple and elegant gold chain bracelet.',
        material: 'Gold',
        purities: ['18K', '22K', '24K'],
        purityPrices: {
            '18K': -5000,
            '22K': 0,
            '24K': 8000
        },
        weight: '18.7g',
        makingCharges: '12%',
        warranty: '1 Year',
        rating: 4.4,
        reviewCount: 67
    },
    {
        id: 'bracelet-3',
        name: 'Emerald & Diamond Bracelet',
        category: 'bracelets',
        price: 125000,
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
        description: 'Luxurious bracelet with emerald and diamond accents.',
        material: '22K Gold',
        weight: '28.3g',
        stone: 'Emerald & Diamond',
        stoneWeight: '6.2ct',
        makingCharges: '20%',
        warranty: '3 Years',
        rating: 4.9,
        reviewCount: 89
    },
    {
        id: 'bracelet-4',
        name: 'Bangle Set',
        category: 'bracelets',
        price: 68000,
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
        description: 'Set of three matching gold bangles.',
        material: '22K Gold',
        weight: '45.2g',
        makingCharges: '15%',
        warranty: '2 Years',
        rating: 4.6,
        reviewCount: 78
    },
    {
        id: 'bracelet-5',
        name: 'Ruby Cuff Bracelet',
        category: 'bracelets',
        price: 95000,
        oldPrice: 110000,
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',
        description: 'Statement cuff bracelet with ruby stones.',
        material: '18K Gold',
        weight: '32.8g',
        stone: 'Ruby',
        stoneWeight: '4.5ct',
        makingCharges: '22%',
        warranty: '2 Years',
        rating: 4.7,
        reviewCount: 94,
        badge: 'New'
    },
    {
        id: 'bracelet-6', name: 'Pearl Bracelet', category: 'bracelets', price: 42000, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', description: 'Elegant pearl strand bracelet.', material: '18K Gold', weight: '15.3g', rating: 4.5, reviewCount: 56
    },
    {
        id: 'bracelet-7', name: 'Diamond Line Bracelet', category: 'bracelets', price: 78000, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400', description: 'Single line diamond bracelet.', material: '18K Gold', weight: '20.1g', rating: 4.7, reviewCount: 73
    },
    {
        id: 'bracelet-8', name: 'Gold Charm Bracelet', category: 'bracelets', price: 55000, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', description: 'Charm bracelet with gold pendants.', material: '22K Gold', weight: '25.6g', rating: 4.4, reviewCount: 62
    },
    {
        id: 'bracelet-9', name: 'Sapphire Bracelet', category: 'bracelets', price: 112000, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', description: 'Beautiful sapphire and gold bracelet.', material: '18K Gold', weight: '26.9g', rating: 4.8, reviewCount: 81
    },
    {
        id: 'bracelet-10', name: 'Traditional Kada', category: 'bracelets', price: 45000, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400', description: 'Traditional Indian gold kada.', material: '22K Gold', weight: '38.4g', rating: 4.6, reviewCount: 69
    },
    {
        id: 'bracelet-11', name: 'Diamond Eternity Bracelet', category: 'bracelets', price: 145000, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', description: 'Full eternity diamond bracelet.', material: '18K Gold', weight: '24.7g', rating: 4.9, reviewCount: 88
    },
    {
        id: 'bracelet-12', name: 'Gold Rope Bracelet', category: 'bracelets', price: 29000, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', description: 'Twisted rope design gold bracelet.', material: '22K Gold', weight: '16.8g', rating: 4.3, reviewCount: 47
    },
    {
        id: 'bracelet-13', name: 'Emerald Line Bracelet', category: 'bracelets', price: 98000, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400', description: 'Single line emerald bracelet.', material: '18K Gold', weight: '19.5g', rating: 4.7, reviewCount: 74
    },
    {
        id: 'bracelet-14', name: 'Diamond & Pearl Bracelet', category: 'bracelets', price: 67000, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', description: 'Combination of diamonds and pearls.', material: '18K Gold', weight: '17.2g', rating: 4.5, reviewCount: 58
    },
    {
        id: 'bracelet-15', name: 'Gold Mesh Bracelet', category: 'bracelets', price: 38000, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', description: 'Modern mesh design gold bracelet.', material: '18K Gold', weight: '14.9g', rating: 4.4, reviewCount: 51
    },
    {
        id: 'bracelet-16', name: 'Ruby Tennis Bracelet', category: 'bracelets', price: 118000, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400', description: 'Tennis bracelet with ruby stones.', material: '18K Gold', weight: '23.4g', rating: 4.8, reviewCount: 79
    },
    {
        id: 'bracelet-17', name: 'Diamond Charm Bracelet', category: 'bracelets', price: 92000, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', description: 'Charm bracelet with diamond accents.', material: '18K Gold', weight: '21.8g', rating: 4.6, reviewCount: 65
    },
    {
        id: 'bracelet-18', name: 'Gold Bangle Set', category: 'bracelets', price: 76000, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', description: 'Set of five thin gold bangles.', material: '22K Gold', weight: '42.7g', rating: 4.7, reviewCount: 72
    },
    {
        id: 'bracelet-19', name: 'Sapphire Cuff Bracelet', category: 'bracelets', price: 105000, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400', description: 'Elegant sapphire cuff bracelet.', material: '18K Gold', weight: '29.3g', rating: 4.8, reviewCount: 83
    },
    {
        id: 'bracelet-20', name: 'Diamond Cluster Bracelet', category: 'bracelets', price: 132000, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', description: 'Bracelet with diamond clusters.', material: '18K Gold', weight: '26.5g', rating: 4.9, reviewCount: 91
    },

    // Earrings (20 items)
    {
        id: 'earring-1',
        name: 'Diamond Stud Earrings',
        category: 'earrings',
        price: 105000,
        oldPrice: 100000,
        image: 'WhatsApp Image 2025-10-18 at 02.06.19_bf1aa984.jpg',
        description: 'Classic diamond stud earrings for everyday elegance.',
        material: 'Gold',
        purities: ['18K', '22K', '24K'],
        purityPrices: {
            '18K': -5000,
            '22K': 0,
            '24K': 8000
        },
        weight: '8.2g',
        stone: 'Diamond',
        stoneWeight: '2.0ct',
        makingCharges: '15%',
        warranty: '2 Years',
        rating: 4.8,
        reviewCount: 134,
        badge: 'Bestseller'
    },
    {
        id: 'earring-2',
        name: 'Gold Jhumka Earrings',
        category: 'earrings',
        price: 153000,
        image: 'WhatsApp Image 2025-10-18 at 02.07.21_c3233114.jpg',
        description: 'Traditional Indian jhumka earrings.',
        material: 'Gold',
        purities: ['18K', '22K', '24K'],
        purityPrices: {
            '18K': -5000,
            '22K': 0,
            '24K': 8000
        },
        weight: '12.5g',
        makingCharges: '18%',
        warranty: '1 Year',
        rating: 4.6,
        reviewCount: 89
    },
    {
        id: 'earring-3',
        name: 'Pearl Drop Earrings',
        category: 'earrings',
        price: 28000,
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',
        description: 'Elegant pearl drop earrings for formal occasions.',
        material: '18K Gold',
        weight: '9.8g',
        stone: 'Pearl',
        makingCharges: '14%',
        warranty: '2 Years',
        rating: 4.5,
        reviewCount: 76
    },
    {
        id: 'earring-4',
        name: 'Ruby & Diamond Earrings',
        category: 'earrings',
        price: 78000,
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
        description: 'Luxurious ruby and diamond combination earrings.',
        material: '18K Gold',
        weight: '11.3g',
        stone: 'Ruby & Diamond',
        stoneWeight: '3.5ct',
        makingCharges: '20%',
        warranty: '3 Years',
        rating: 4.9,
        reviewCount: 98
    },
    {
        id: 'earring-5',
        name: 'Emerald Chandelier Earrings',
        category: 'earrings',
        price: 125000,
        oldPrice: 145000,
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
        description: 'Grand chandelier earrings with emerald stones.',
        material: '22K Gold',
        weight: '28.7g',
        stone: 'Emerald',
        stoneWeight: '8.2ct',
        makingCharges: '25%',
        warranty: '3 Years',
        rating: 4.8,
        reviewCount: 112,
        badge: 'New'
    },
    {
        id: 'earring-6', name: 'Gold Hoop Earrings', category: 'earrings', price: 22000, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', description: 'Classic gold hoop earrings.', material: '22K Gold', weight: '10.4g', rating: 4.4, reviewCount: 67
    },
    {
        id: 'earring-7', name: 'Diamond Drop Earrings', category: 'earrings', price: 68000, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', description: 'Elegant diamond drop earrings.', material: '18K Gold', weight: '12.8g', rating: 4.7, reviewCount: 84
    },
    {
        id: 'earring-8', name: 'Sapphire Stud Earrings', category: 'earrings', price: 52000, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400', description: 'Beautiful sapphire stud earrings.', material: '18K Gold', weight: '9.1g', rating: 4.6, reviewCount: 73
    },
    {
        id: 'earring-9', name: 'Traditional Chandbalis', category: 'earrings', price: 45000, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', description: 'Traditional moon-shaped chandbali earrings.', material: '22K Gold', weight: '15.6g', rating: 4.7, reviewCount: 79
    },
    {
        id: 'earring-10', name: 'Diamond Cluster Earrings', category: 'earrings', price: 89000, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', description: 'Cluster design diamond earrings.', material: '18K Gold', weight: '13.2g', rating: 4.8, reviewCount: 91
    },
    {
        id: 'earring-11', name: 'Gold Thread Earrings', category: 'earrings', price: 18000, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400', description: 'Lightweight thread earrings.', material: '18K Gold', weight: '6.3g', rating: 4.3, reviewCount: 52
    },
    {
        id: 'earring-12', name: 'Ruby Stud Earrings', category: 'earrings', price: 48000, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', description: 'Classic ruby stud earrings.', material: '18K Gold', weight: '8.7g', rating: 4.6, reviewCount: 68
    },
    {
        id: 'earring-13', name: 'Pearl & Diamond Earrings', category: 'earrings', price: 55000, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', description: 'Combination of pearls and diamonds.', material: '18K Gold', weight: '10.9g', rating: 4.7, reviewCount: 75
    },
    {
        id: 'earring-14', name: 'Gold Jhumka Set', category: 'earrings', price: 38000, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400', description: 'Set of traditional jhumka earrings.', material: '22K Gold', weight: '14.2g', rating: 4.5, reviewCount: 63
    },
    {
        id: 'earring-15', name: 'Emerald Drop Earrings', category: 'earrings', price: 72000, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', description: 'Elegant emerald drop earrings.', material: '18K Gold', weight: '11.8g', rating: 4.8, reviewCount: 82
    },
    {
        id: 'earring-16', name: 'Diamond Hoop Earrings', category: 'earrings', price: 95000, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', description: 'Diamond encrusted hoop earrings.', material: '18K Gold', weight: '14.5g', rating: 4.7, reviewCount: 88
    },
    {
        id: 'earring-17', name: 'Gold Chand Earrings', category: 'earrings', price: 42000, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400', description: 'Traditional gold chand earrings.', material: '22K Gold', weight: '16.3g', rating: 4.6, reviewCount: 71
    },
    {
        id: 'earring-18', name: 'Sapphire Drop Earrings', category: 'earrings', price: 68000, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', description: 'Beautiful sapphire drop earrings.', material: '18K Gold', weight: '12.1g', rating: 4.7, reviewCount: 77
    },
    {
        id: 'earring-19', name: 'Diamond Jacket Earrings', category: 'earrings', price: 112000, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', description: 'Modern diamond jacket earrings.', material: '18K Gold', weight: '15.7g', rating: 4.8, reviewCount: 86
    },
    {
        id: 'earring-20', name: 'Ruby & Pearl Earrings', category: 'earrings', price: 58000, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400', description: 'Combination of ruby and pearl.', material: '18K Gold', weight: '11.2g', rating: 4.6, reviewCount: 69
    }
];
// ===== JEWELLERY COLLECTION MANAGEMENT =====
class JewelleryCollection {
    constructor() {
        this.currentCategory = 'all';
        this.displayedProducts = 8;
        this.productsPerLoad = 8;
        this.cart = JSON.parse(localStorage.getItem('jewelleryCart')) || {};
        this.init();
    }

    init() {
        this.renderProducts();
        this.setupEventListeners();
        this.updateCartCount();
    }

    renderProducts(category = this.currentCategory) {
        const collectionGrid = document.getElementById('collectionGrid');
        if (!collectionGrid) return;

        // Update current category
        this.currentCategory = category;

        const filteredProducts = category === 'all' 
            ? products 
            : products.filter(product => product.category === category);

        const productsToDisplay = filteredProducts.slice(0, this.displayedProducts);

        collectionGrid.innerHTML = productsToDisplay.map(product => {
            const stars = this.generateStars(product.rating);
            const currentQuantity = this.cart[product.id] || 1;
            const currentPurity = this.cart[`${product.id}_purity`] || (product.purities ? product.purities[0] : '22K');
            
            return `
                <div class="card" data-category="${product.category}" data-id="${product.id}">
                    ${product.badge ? `<div class="card-badge">${product.badge}</div>` : ''}
                    <div class="card-actions">
                        <button class="action-btn"><i class="far fa-heart"></i></button>
                        <button class="action-btn"><i class="fas fa-share-alt"></i></button>
                    </div>
                    <img src="${product.image}" alt="${product.name}">
                    <div class="card-info">
                        <h3>${product.name}</h3>
                        <div class="rating">
                            ${stars}
                            <span>${product.rating} (${product.reviewCount})</span>
                        </div>
                        
                        <!-- Gold Purity Selector -->
                        ${product.purities ? this.generatePuritySelector(product.id, product.purities, currentPurity, product.purityPrices) : ''}
                        
                        <div class="price">
                            ${product.oldPrice ? `<span class="old-price">₹${product.oldPrice.toLocaleString()}</span>` : ''}
                            <span class="current-price" data-id="${product.id}">
                                ₹${this.calculatePrice(product, currentPurity).toLocaleString()}
                            </span>
                        </div>
                        
                        <!-- Quantity Controls -->
                        <div class="quantity-controls">
                            <button class="quantity-btn decrease" data-id="${product.id}">-</button>
                            <span class="quantity-display" data-id="${product.id}">${currentQuantity}</span>
                            <button class="quantity-btn increase" data-id="${product.id}">+</button>
                        </div>
                        
                        <button class="details-btn" data-id="${product.id}">View Details</button>
                        <button class="btn add-to-cart" data-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        this.attachProductEventListeners();
        this.updateLoadMoreButton(filteredProducts.length);
        
        // Trigger card animations after render
        setTimeout(() => this.revealCards(), 100);
    }

    setupEventListeners() {
        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const category = btn.dataset.category;
                this.renderProducts(category);

                // Smooth scroll to collections section
                const collectionsSection = document.querySelector('#collections');
                if (collectionsSection) {
                    collectionsSection.scrollIntoView({ behavior: 'smooth' });
                }
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

        // Modal close
        const closeModal = document.getElementById('closeModal');
        const productModal = document.getElementById('productModal');
        if (closeModal && productModal) {
            closeModal.addEventListener('click', () => {
                productModal.style.display = 'none';
            });

            window.addEventListener('click', (event) => {
                if (event.target === productModal) {
                    productModal.style.display = 'none';
                }
            });
        }

        // Explore button
        const exploreBtn = document.getElementById('exploreBtn');
        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => {
                document.getElementById('collections').scrollIntoView({ behavior: 'smooth' });
            });
        }
    }

    // Card reveal animation
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
    generatePuritySelector(productId, purities, currentPurity, purityPrices = {}) {
        return `
            <div class="purity-selector">
                <label>Gold Purity:</label>
                <div class="purity-options">
                    ${purities.map(purity => `
                        <button class="purity-btn ${purity === currentPurity ? 'active' : ''}" 
                                data-id="${productId}" 
                                data-purity="${purity}"
                                data-price="${purityPrices[purity] || ''}">
                            ${purity}
                            ${purityPrices[purity] ? `<span class="purity-price">+₹${(purityPrices[purity] / 1000).toFixed(0)}K</span>` : ''}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    calculatePrice(product, purity) {
        if (product.purityPrices && product.purityPrices[purity]) {
            return product.price + product.purityPrices[purity];
        }
        return product.price;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        let stars = '';
        for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star"></i>';
        if (halfStar) stars += '<i class="fas fa-star-half-alt"></i>';
        for (let i = 0; i < emptyStars; i++) stars += '<i class="far fa-star"></i>';

        return stars;
    }

    attachProductEventListeners() {
    // View Details buttons
    document.querySelectorAll('.details-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-id');
            this.showProductDetails(productId);
        });
    });

    // Add to Cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-id');
            this.addToCart(productId);
        });
    });

    // Quantity controls
    document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-id');
            this.decreaseQuantity(productId);
        });
    });

    document.querySelectorAll('.quantity-btn.increase').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-id');
            this.increaseQuantity(productId);
        });
    });

    // Purity selection - use event delegation for better performance
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('purity-btn') && !e.target.closest('.modal-purity-selector')) {
            const productId = e.target.getAttribute('data-id');
            const purity = e.target.getAttribute('data-purity');
            if (productId && purity) {
                this.selectPurity(productId, purity);
            }
        }
    });
}

selectPurity(productId, purity) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Update active state in card
    const card = document.querySelector(`.card[data-id="${productId}"]`);
    if (card) {
        const purityButtons = card.querySelectorAll('.purity-btn');
        purityButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeButton = card.querySelector(`.purity-btn[data-purity="${purity}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }
    
    // Store selection
    this.cart[`${productId}_purity`] = purity;
    this.saveCart();
    
    // Update price display
    this.updateProductPrice(productId, purity);
}

    updateProductPrice(productId, purity) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const priceElement = document.querySelector(`.current-price[data-id="${productId}"]`);
        if (priceElement) {
            const newPrice = this.calculatePrice(product, purity);
            priceElement.textContent = `₹${newPrice.toLocaleString()}`;
        }
    }

    decreaseQuantity(productId) {
        const currentQty = this.cart[productId] || 1;
        if (currentQty > 1) {
            this.cart[productId] = currentQty - 1;
            this.updateQuantityDisplay(productId);
            this.saveCart();
        }
    }

    increaseQuantity(productId) {
        const currentQty = this.cart[productId] || 1;
        this.cart[productId] = currentQty + 1;
        this.updateQuantityDisplay(productId);
        this.saveCart();
    }

    updateQuantityDisplay(productId) {
        const quantityDisplay = document.querySelector(`.quantity-display[data-id="${productId}"]`);
        if (quantityDisplay) {
            quantityDisplay.textContent = this.cart[productId] || 1;
        }
    }

    showProductDetails(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const stars = this.generateStars(product.rating);
        const currentQuantity = this.cart[productId] || 1;
        const currentPurity = this.cart[`${productId}_purity`] || (product.purities ? product.purities[0] : '22K');
        const currentPrice = this.calculatePrice(product, currentPurity);

        const productModal = document.getElementById('productModal');
        const productDetails = document.getElementById('productDetails');

        productDetails.innerHTML = `
        <div class="product-image-section">
            <div class="product-main-image">
                <img src="${product.image}" alt="${product.name}" id="mainProductImage">
            </div>
        </div>
        <div class="product-info-section">
            <h1 class="product-title">${product.name}</h1>
            <span class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
            
            <div class="rating">
                ${stars}
                <span>${product.rating} (${product.reviewCount} reviews)</span>
            </div>
            
            <p class="product-description">${product.description}</p>
            
            <div class="product-specs">
                <h3 class="specs-title">Specifications</h3>
                <div class="specs-grid">
                    <div class="spec-item">
                        <span class="spec-label">Material:</span>
                        <span class="spec-value">${product.material || 'Gold'}</span>
                    </div>
                    ${product.purities ? `
                    <div class="spec-item">
                        <span class="spec-label">Available Purity:</span>
                        <span class="spec-value">${product.purities.join(', ')}</span>
                    </div>
                    ` : ''}
                    <div class="spec-item">
                        <span class="spec-label">Weight:</span>
                        <span class="spec-value">${product.weight || 'N/A'}</span>
                    </div>
                    ${product.stone ? `
                    <div class="spec-item">
                        <span class="spec-label">Stone:</span>
                        <span class="spec-value">${product.stone}</span>
                    </div>
                    ` : ''}
                    ${product.stoneWeight ? `
                    <div class="spec-item">
                        <span class="spec-label">Stone Weight:</span>
                        <span class="spec-value">${product.stoneWeight}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
            
            <!-- Gold Purity Selector in Modal -->
            ${product.purities ? `
            <div class="modal-purity-selector">
                <label>Select Gold Purity:</label>
                <div class="purity-options" id="modalPurityOptions-${productId}">
                    ${product.purities.map(purity => `
                        <button class="purity-btn ${purity === currentPurity ? 'active' : ''}" 
                                data-id="${product.id}" 
                                data-purity="${purity}"
                                data-price="${product.purityPrices ? product.purityPrices[purity] : ''}">
                            ${purity}
                            ${product.purityPrices && product.purityPrices[purity] ?
                `<span class="purity-price">+₹${(product.purityPrices[purity] / 1000).toFixed(0)}K</span>` : ''}
                        </button>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            <div class="price-section">
                <div class="final-price">
                    ${product.oldPrice ? `<span class="old-price">₹${product.oldPrice.toLocaleString()}</span>` : ''}
                    <span class="current-price-modal" id="modalCurrentPrice-${productId}">
                        ₹${currentPrice.toLocaleString()}
                    </span>
                </div>
                <div class="price-breakdown">
                    Inclusive of all taxes and making charges
                </div>
            </div>

            <!-- Quantity Controls in Modal -->
            <div class="modal-quantity-controls">
                <label>Quantity:</label>
                <div class="quantity-controls">
                    <button class="quantity-btn decrease-modal" id="decreaseModal-${productId}">-</button>
                    <span class="quantity-display-modal" id="quantityDisplayModal-${productId}">${currentQuantity}</span>
                    <button class="quantity-btn increase-modal" id="increaseModal-${productId}">+</button>
                </div>
            </div>
            
            <div class="action-buttons">
                <button class="btn add-to-cart-modal" id="addToCartModal-${productId}">
                    <i class="fas fa-shopping-cart"></i> Add to Cart (${currentQuantity})
                </button>
                <button class="btn btn-secondary">
                    <i class="fas fa-heart"></i> Add to Wishlist
                </button>
            </div>
        </div>
    `;

        // Add event listeners for modal with proper element selection
        this.attachModalEventListeners(productId);
        productModal.style.display = 'block';
    }

    attachModalEventListeners(productId) {
        // Wait for DOM to be updated
        setTimeout(() => {
            // Quantity controls in modal
            const decreaseBtn = document.getElementById(`decreaseModal-${productId}`);
            const increaseBtn = document.getElementById(`increaseModal-${productId}`);
            const addToCartBtn = document.getElementById(`addToCartModal-${productId}`);

            if (decreaseBtn) {
                decreaseBtn.addEventListener('click', () => {
                    this.decreaseQuantity(productId);
                    this.updateModalQuantity(productId);
                });
            }

            if (increaseBtn) {
                increaseBtn.addEventListener('click', () => {
                    this.increaseQuantity(productId);
                    this.updateModalQuantity(productId);
                });
            }

            // Purity selection in modal
            const purityButtons = document.querySelectorAll(`#modalPurityOptions-${productId} .purity-btn`);
            purityButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const purity = e.target.getAttribute('data-purity');
                    this.selectPurityInModal(productId, purity);
                });
            });

            // Add to cart in modal
            if (addToCartBtn) {
                addToCartBtn.addEventListener('click', () => {
                    this.addToCart(productId);
                });
            }
        }, 100);
    }

    selectPurityInModal(productId, purity) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        // Update active state in modal
        const purityButtons = document.querySelectorAll(`#modalPurityOptions-${productId} .purity-btn`);
        purityButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        const activeButton = document.querySelector(`#modalPurityOptions-${productId} .purity-btn[data-purity="${purity}"]`);
        if (activeButton) {
            activeButton.classList.add('active');

            // Store selection
            this.cart[`${productId}_purity`] = purity;
            this.saveCart();

            // Update price in modal
            this.updateModalPrice(productId, purity);
        }
    }

    updateModalPrice(productId, purity) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const priceElement = document.getElementById(`modalCurrentPrice-${productId}`);
        if (priceElement) {
            const newPrice = this.calculatePrice(product, purity);
            priceElement.textContent = `₹${newPrice.toLocaleString()}`;
        }
    }

    updateModalQuantity(productId) {
        const quantityDisplay = document.getElementById(`quantityDisplayModal-${productId}`);
        const addToCartBtn = document.getElementById(`addToCartModal-${productId}`);

        if (quantityDisplay) {
            quantityDisplay.textContent = this.cart[productId] || 1;
        }

        if (addToCartBtn) {
            addToCartBtn.innerHTML = `<i class="fas fa-shopping-cart"></i> Add to Cart (${this.cart[productId] || 1})`;
        }
    }

    addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const quantity = this.cart[productId] || 1;
        const purity = this.cart[`${productId}_purity`] || (product.purities ? product.purities[0] : '22K');
        const finalPrice = this.calculatePrice(product, purity);

        if (localStorage.getItem('isLoggedIn') === 'true') {
            this.addToBackendCart(product, quantity, purity, finalPrice);
        } else {
            this.addToLocalCart(product, quantity, purity, finalPrice);
        }
    }

    addToBackendCart(product, quantity, purity, finalPrice) {
        const userPhone = localStorage.getItem('userPhone');
        const cartItem = {
            productId: product.id,
            name: product.name,
            price: finalPrice,
            image: product.image,
            quantity: quantity,
            purity: purity,
            basePrice: product.price
        };

        fetch("https://jewellery-website-mongodburi.up.railway.app/api/cart/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone: userPhone, product: cartItem })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    this.showCartNotification(product.name, quantity, purity);
                    this.updateCartCount();
                } else {
                    alert(data.message || "Error adding item to cart");
                }
            })
            .catch(err => {
                console.error(err);
                alert("Unable to add item. Try again later.");
            });
    }

    addToLocalCart(product, quantity, purity, finalPrice) {
        this.showCartNotification(product.name, quantity, purity);
        this.updateCartCount();

        const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
        const existingItemIndex = guestCart.findIndex(item => item.id === product.id && item.purity === purity);

        if (existingItemIndex > -1) {
            guestCart[existingItemIndex].quantity += quantity;
            guestCart[existingItemIndex].totalPrice += finalPrice * quantity;
        } else {
            guestCart.push({
                id: product.id,
                name: product.name,
                price: finalPrice,
                basePrice: product.price,
                image: product.image,
                quantity: quantity,
                purity: purity,
                totalPrice: finalPrice * quantity
            });
        }

        localStorage.setItem('guestCart', JSON.stringify(guestCart));
    }

    showCartNotification(productName, quantity, purity) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>Added ${quantity} x ${productName} (${purity}) to cart!</span>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (!cartCount) return;

        if (localStorage.getItem('isLoggedIn') === 'true') {
            const userPhone = localStorage.getItem('userPhone');
            fetch(`https://jewellery-website-mongodburi.up.railway.app/api/cart?phone=${encodeURIComponent(userPhone)}`)
                .then(res => res.json())
                .then(data => {
                    const totalItems = data.cart ? data.cart.reduce((sum, item) => sum + item.quantity, 0) : 0;
                    cartCount.textContent = totalItems;
                    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
                })
                .catch(() => {
                    this.updateLocalCartCount();
                });
        } else {
            this.updateLocalCartCount();
        }
    }

    updateLocalCartCount() {
        const cartCount = document.querySelector('.cart-count');
        const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
        const totalItems = guestCart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    saveCart() {
        localStorage.setItem('jewelleryCart', JSON.stringify(this.cart));
    }

    updateLoadMoreButton(totalProducts) {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = this.displayedProducts >= totalProducts ? 'none' : 'inline-flex';
        }
    }

    setupEventListeners() {
        // ... (keep your existing event listeners)
        const filterButtons = document.querySelectorAll('.filter-btn');
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        const closeModal = document.getElementById('closeModal');
        const productModal = document.getElementById('productModal');
        const exploreBtn = document.getElementById('exploreBtn');

        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                this.currentCategory = e.target.getAttribute('data-category');
                this.displayedProducts = 8;
                this.renderProducts();
            });
        });

        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.displayedProducts += this.productsPerLoad;
                this.renderProducts();
            });
        }

        if (closeModal && productModal) {
            closeModal.addEventListener('click', () => {
                productModal.style.display = 'none';
            });

            window.addEventListener('click', (event) => {
                if (event.target === productModal) {
                    productModal.style.display = 'none';
                }
            });
        }

        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => {
                document.getElementById('collections').scrollIntoView({ behavior: 'smooth' });
            });
        }
    }
}

// ===== MAIN APP CODE =====
// ===== MAIN APP CODE =====
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded - Main app code running");
  // ===== INITIALIZE ANIMATIONS =====
  new RoyalAnimation();

  new JewelleryCollection();
  const floatingManager = new FloatingElementsManager();

  // ===== REGISTER FORM =====
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("regName").value.trim();
      const address = document.getElementById("regAddress").value.trim();
      const phone = document.getElementById("regPhone").value.trim();
      const checkbox = document.getElementById("termsCheckbox");

      if (!checkbox.checked)
        return alert("You must agree to the Terms and Privacy Policy.");
      if (!name || !address || !/^\d{10}$/.test(phone))
        return alert("Please enter valid details.");

      try {
        const res = await fetch(
          "https://jewellery-website-mongodburi.up.railway.app/api/register",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, address, phone }),
          }
        );
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
  const otpGroup = document.querySelector(".otp-group");
  const loginBtn = document.getElementById("loginBtn");
  const loginForm = document.getElementById("loginForm");

  if (sendOtpBtn) {
    sendOtpBtn.addEventListener("click", () => {
      const phone = document.getElementById("loginPhone").value.trim();

      if (!/^\d{10}$/.test(phone)) {
        alert("📱 Please enter a valid 10-digit phone number.");
        return;
      }

      alert("✅ OTP sent successfully! (Use 123456 to verify)");
      otpGroup.style.display = "block";
      sendOtpBtn.style.display = "none";
      loginBtn.style.display = "block";
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const phone = document.getElementById("loginPhone").value.trim();
      const otp = document.getElementById("otp").value.trim();

      if (otp === "123456") {
        alert("🎉 Login successful!");
        // Save login info
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userPhone", phone);
        localStorage.setItem("userName", "User " + phone.slice(-4));
        window.location.href = "index.html";
      } else {
        alert("❌ Invalid OTP. Please enter 123456.");
      }
    });
  }

  // ===== GLOBAL VARIABLES =====
  const userPhone = localStorage.getItem("userPhone");
  const userName = localStorage.getItem("userName");
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  // ===== QUANTITY BUTTONS ON HOMEPAGE =====
  document.querySelectorAll(".card-info").forEach((card) => {
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

  // ===== ADD TO CART =====
  async function handleAddToCart(card) {
    if (!isLoggedIn) {
      alert("Please login first.");
      window.location.href = "login.html";
      return;
    }

    const productId =
      card.dataset.productId || card.querySelector("h3").textContent;
    const name = card.querySelector("h3").innerText;
    const price = parseInt(
      card.querySelector(".price").innerText.replace(/[₹,]/g, "")
    );
    const image = card.closest(".card").querySelector("img").src;

    let quantity = 1;
    const qtyEl = card.querySelector(".qty");
    if (qtyEl) quantity = parseInt(qtyEl.textContent) || 1;

    const product = { productId, name, price, image, quantity };

    try {
      const res = await fetch(
        "https://jewellery-website-mongodburi.up.railway.app/api/cart/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: userPhone, product }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert(`${name} added to your cart (x${quantity})!`);
        updateCartUI(data.cart);
        if (qtyEl) qtyEl.textContent = 1;
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

    document.querySelectorAll(".increase").forEach((btn) => {
      btn.addEventListener("click", () => changeQuantity(btn.dataset.id, 1));
    });
    document.querySelectorAll(".decrease").forEach((btn) => {
      btn.addEventListener("click", () => changeQuantity(btn.dataset.id, -1));
    });
  }

  // ===== CHANGE QUANTITY =====
  async function changeQuantity(productId, delta) {
    try {
      const phone = localStorage.getItem("userPhone");
      const resCart = await fetch(
        `https://jewellery-website-5xi0.onrender.com/api/cart?phone=${phone}`
      );
      const data = await resCart.json();
      const item = data.cart.find((i) => i.productId === productId);
      if (!item) return;

      const newQty = item.quantity + delta;
      const res = await fetch(
        "https://jewellery-website-mongodburi.up.railway.app/api/cart/update",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, productId, quantity: newQty }),
        }
      );
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
    fetch(
      `https://jewellery-website-mongodburi.up.railway.app/api/cart?phone=${encodeURIComponent(
        userPhone
      )}`
    )
      .then((res) => res.json())
      .then((data) => updateCartUI(data.cart))
      .catch((err) => console.error(err));
  }

  // ===== ADD TO CART BUTTONS =====
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".card-info");
      if (!card) return;
      handleAddToCart(card);
    });
  });

  // ===== NAVBAR LOGIN / LOGOUT =====
  const loginBtnNav = document.getElementById("loginbtn");
 if (isLoggedIn) {
  const displayName = userName && userName !== "undefined" 
    ? userName 
    : "User";

  const marquee = document.querySelector(".marquee");
  if (marquee) 
    marquee.textContent = `🎉 Welcome, ${displayName}! Explore our jewellery collections! ✨`;
if (loginBtnNav) loginBtnNav.style.display = "none";

    const navLinks = loginBtnNav?.parentNode;
    if (navLinks) {
      const logoutBtn = document.createElement("a");
      logoutBtn.textContent = "Logout";
      logoutBtn.href = "#";
      logoutBtn.className = "btn";
      logoutBtn.style.marginLeft = "10px";
      logoutBtn.onclick = (e) => {
        e.preventDefault();
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
      };
      navLinks.appendChild(logoutBtn);
    }
  }

  // ===== CARD REVEAL ANIMATION =====
  function revealCards() {
    const cards = document.querySelectorAll(".card");
    const triggerBottom = window.innerHeight * 0.85;

    cards.forEach((card) => {
      const cardTop = card.getBoundingClientRect().top;
      if (cardTop < triggerBottom) {
        card.classList.add("visible");
      }
    });
  }

  const container = document.getElementById("jewelleryContainer");
  if (container) {
    const observer = new MutationObserver(() => revealCards());
    observer.observe(container, { childList: true, subtree: true });
  }

  revealCards();
  window.addEventListener("scroll", revealCards);
  window.addEventListener("load", revealCards);

  // ===== NAVBAR SCROLL EFFECT =====
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (navbar) {
      navbar.style.background =
        window.scrollY > 50
          ? "rgba(255, 255, 255, 0.9)"
          : "rgba(255, 255, 255, 0.25)";
    }
  });

  // ===== HERO BUTTON SCROLL =====
  const scrollBtn = document.querySelector(".hero .btn");
  if (scrollBtn)
    scrollBtn.addEventListener("click", () => {
      document
        .querySelector("#collections")
        .scrollIntoView({ behavior: "smooth" });
    });

  console.log("👑 Royal Jewellery App Initialized Successfully");
});






