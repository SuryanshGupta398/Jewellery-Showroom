document.addEventListener("DOMContentLoaded", () => {
  // ===== DETECT PAGE =====
  const isHomePage = window.location.pathname.includes("index.html") || window.location.pathname === "/";
  const isLoginPage = window.location.pathname.includes("login.html");
  const isRegisterPage = window.location.pathname.includes("register.html");

  // ===== REGISTER FORM =====
  if (isRegisterPage) {
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
  }

  // ===== LOGIN FORM WITH OTP =====
  if (isLoginPage) {
    const sendOtpBtn = document.getElementById("sendOtpBtn");
    const loginBtn = document.getElementById("loginBtn");
    const otpGroup = document.querySelector(".otp-group");
    let generatedOtp = "";

    if (sendOtpBtn) {
      sendOtpBtn.addEventListener("click", async () => {
        const phone = document.getElementById("loginPhone").value.trim();
        if (!/^\d{10}$/.test(phone)) return alert("Enter a valid 10-digit phone number.");

        try {
          const res = await fetch(`https://jewellery-website-5xi0.onrender.com/api/login?phone=${encodeURIComponent(phone)}`);
          const data = await res.json();
          if (data.error) return alert(data.error);

          // Demo OTP
          generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
          console.log("Demo OTP:", generatedOtp);
          alert("OTP sent! (Check console for demo)");

          otpGroup.style.display = "block";
          sendOtpBtn.style.display = "none";
          loginBtn.style.display = "block";

          localStorage.setItem("userName", data.name);
          localStorage.setItem("userPhone", data.phone);
        } catch (err) {
          console.error(err);
          alert("Server error. Try again later.");
        }
      });
    }

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const enteredOtp = document.getElementById("otp").value.trim();
        if (enteredOtp === generatedOtp) {
          alert("Login successful!");
          localStorage.setItem("isLoggedIn", "true");
          window.location.href = "index.html";
        } else {
          alert("Invalid OTP. Try again.");
        }
      });
    }
  }

  // ===== HOMEPAGE FUNCTIONS =====
  if (isHomePage) {
    // Premium Opening Animation
    runPremiumAnimation();

    // Initialize floating elements
    createFloatingElements();

    // Navbar scroll effect
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
      if (navbar) {
        navbar.style.background = window.scrollY > 50
          ? "rgba(255, 255, 255, 0.9)"
          : "rgba(255, 255, 255, 0.25)";
      }
    });

    // Hero scroll button
    const scrollBtn = document.querySelector(".hero .btn");
    if (scrollBtn) scrollBtn.addEventListener("click", () => {
      document.querySelector("#collections").scrollIntoView({ behavior: "smooth" });
    });

    // Card reveal animation
    const cards = document.querySelectorAll(".card");
    function revealCards() {
      const triggerBottom = window.innerHeight * 0.85;
      cards.forEach(card => {
        if (card.getBoundingClientRect().top < triggerBottom) card.classList.add("visible");
      });
    }
    window.addEventListener("scroll", revealCards);
    window.addEventListener("load", revealCards);

    // Filter buttons
    const filterButtons = document.querySelectorAll(".filter-btn");
    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const category = btn.dataset.category;
        cards.forEach(card => {
          if (category === "all" || card.dataset.category === category) {
            card.style.display = "block";
            card.classList.add("visible");
          } else {
            card.style.display = "none";
            card.classList.remove("visible");
          }
        });
        const collectionsSection = document.querySelector("#collections");
        if (collectionsSection) {
          collectionsSection.scrollIntoView({ behavior: "smooth" });
        }
      });
    });

    // Cart & Add to Cart
    const userPhone = localStorage.getItem("userPhone");
    const userName = localStorage.getItem("userName");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    document.querySelectorAll(".add-to-cart").forEach(btn => {
      btn.addEventListener("click", e => {
        const card = e.target.closest(".card-info");
        if (!card) return;
        handleAddToCart(card, userPhone, isLoggedIn);
      });
    });

    // Navbar login/logout
    const loginBtnNav = document.getElementById("loginbtn");
    if (isLoggedIn && loginBtnNav) {
      const displayName = userName || userPhone;
      const marquee = document.querySelector(".marquee");
      if (marquee) marquee.textContent = `🎉 Welcome, ${displayName}! Explore our jewellery collections! ✨`;
      loginBtnNav.style.display = "none";

      const navLinks = loginBtnNav.parentNode;
      if (navLinks) {
        const logoutBtn = document.createElement("a");
        logoutBtn.textContent = "Logout";
        logoutBtn.href = "#";
        logoutBtn.className = "btn";
        logoutBtn.style.marginLeft = "10px";
        logoutBtn.onclick = e => {
          e.preventDefault();
          localStorage.clear();
          window.location.reload();
        };
        navLinks.appendChild(logoutBtn);
      }
    }

    // Initialize cart
    if (isLoggedIn) {
      fetch(`https://jewellery-website-5xi0.onrender.com/api/cart?phone=${encodeURIComponent(userPhone)}`)
        .then(res => res.json())
        .then(data => updateCartUI(data.cart))
        .catch(err => console.error(err));
    }
  }
});

// ===== PREMIUM ANIMATION FUNCTION =====
function runPremiumAnimation() {
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  if (isMobile) return; // skip heavy animation on mobile

  document.body.style.overflow = 'hidden';

  const welcomeOverlay = document.createElement('div');
  welcomeOverlay.className = 'welcome-overlay';

  welcomeOverlay.innerHTML = `
    <div class="background-particles" id="backgroundParticles"></div>
    <div class="welcome-container">
      <div class="welcome-card">
        <div class="floating-jewels-premium">
          <div class="jewel-premium">💎</div>
          <div class="jewel-premium">✨</div>
          <div class="jewel-premium">🔶</div>
          <div class="jewel-premium">💍</div>
          <div class="jewel-premium">🌟</div>
          <div class="jewel-premium">💫</div>
        </div>
        <div class="welcome-logo">✨ Shimmer & Shine</div>
        <div class="welcome-tagline">Timeless Elegance</div>
        <div class="diamond-showcase">
          <div class="diamond-3d"></div>
        </div>
        <div class="welcome-message">
          Step into a world where every piece tells a story of craftsmanship, luxury, and timeless beauty.
        </div>
        <button class="enter-btn">
          <i class="fas fa-gem btn-icon"></i>
          Enter the Boutique
        </button>
        <div class="loading-bar-container">
          <div class="loading-bar"></div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(welcomeOverlay);
  createParticles();

  const enterBtn = welcomeOverlay.querySelector('.enter-btn');
  enterBtn.addEventListener('click', () => enterBoutique(welcomeOverlay, enterBtn));
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && document.contains(welcomeOverlay)) {
      enterBoutique(welcomeOverlay, enterBtn);
    }
  });
}

function enterBoutique(welcomeOverlay, enterBtn) {
  const originalText = enterBtn.innerHTML;
  enterBtn.innerHTML = '<i class="fas fa-spinner fa-spin btn-icon"></i> Preparing Your Experience...';
  enterBtn.disabled = true;
  welcomeOverlay.classList.add('exiting');
  playClickSound();
  setTimeout(() => {
    welcomeOverlay.remove();
    document.body.classList.add('loaded');
    document.body.style.overflow = 'auto';
    animateMainContent();
  }, 1000);
}

// ===== PARTICLES =====
function createParticles() {
  const particlesContainer = document.getElementById('backgroundParticles');
  if (!particlesContainer) return;
  for (let i = 0; i < 10; i++) { // reduced for performance
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.background = `hsl(${Math.random() * 20 + 40}, 70%, 60%)`;
    particle.style.width = Math.random() * 4 + 2 + 'px';
    particle.style.height = particle.style.width;
    particlesContainer.appendChild(particle);
  }
}

// ===== FLOATING ELEMENTS =====
function createFloatingElements() {
  const floatingContainer = document.getElementById('floatingElements');
  if (!floatingContainer) return;
  const jewels = ['💎','✨','🔶','💍','🌟','💫','⭐','🔸'];
  for (let i = 0; i < 8; i++) {
    const jewel = document.createElement('div');
    jewel.className = 'floating-element';
    jewel.textContent = jewels[i];
    jewel.style.left = Math.random() * 100 + '%';
    jewel.style.top = Math.random() * 100 + '%';
    jewel.style.animationDelay = Math.random() * 2 + 's';
    jewel.style.fontSize = (Math.random() * 1 + 1.5) + 'rem';
    floatingContainer.appendChild(jewel);
  }
}

// ===== AUDIO =====
function playClickSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch(e) { console.log('Audio context not supported'); }
}

// ===== ANIMATE MAIN CONTENT =====
function animateMainContent() {
  const elements = [
    { selector: '.navbar', delay: 300 },
    { selector: '.marquee-container', delay: 500 },
    { selector: '.hero', delay: 700 },
    { selector: '.collections', delay: 900 },
    { selector: '.main-content', delay: 0 }
  ];
  elements.forEach(({selector, delay}) => {
    const element = document.querySelector(selector);
    if (element) setTimeout(() => element.classList.add('visible'), delay);
  });
}

// ===== CART HANDLERS (HOMEPAGE) =====
async function handleAddToCart(card, userPhone, isLoggedIn) {
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
      if (qtyEl) qtyEl.textContent = 1;
    } else {
      alert(data.message || "Error adding item to cart");
    }
  } catch (err) {
    console.error(err);
    alert("Unable to add item. Try again later.");
  }
}

function updateCartUI(cart) {
  const cartContainer = document.querySelector(".cart-items");
  if (!cartContainer) return;
  cartContainer.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
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

  document.querySelectorAll(".increase").forEach(btn => btn.addEventListener("click", () => changeQuantity(btn.dataset.id, 1)));
  document.querySelectorAll(".decrease").forEach(btn => btn.addEventListener("click", () => changeQuantity(btn.dataset.id, -1)));
}

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
