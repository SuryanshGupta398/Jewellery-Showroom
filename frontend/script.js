// ===== PREMIUM ANIMATION - RUNS IMMEDIATELY =====
(function checkAndShowAnimation() {
  // Check if we're on homepage and animation hasn't been shown
  const isHomePage = window.location.pathname.endsWith('index.html') || 
                    window.location.pathname.endsWith('/') || 
                    (document.querySelector('.hero') !== null && 
                     !window.location.pathname.includes('login.html') &&
                     !window.location.pathname.includes('register.html'));
  
  // Debug log
  console.log('Animation check:', {
    isHomePage,
    pathname: window.location.pathname,
    hasHero: document.querySelector('.hero') !== null,
    animationShown: sessionStorage.getItem('animationShown')
  });
  
  if (isHomePage && !sessionStorage.getItem('animationShown')) {
    console.log('Showing animation');
    initializePremiumAnimation();
  } else {
    console.log('Skipping animation');
    // Show content immediately
    document.body.classList.add('loaded');
    document.body.style.overflow = 'auto';
  }
})();

// ===== OPTIMIZED PREMIUM ANIMATION =====
function initializePremiumAnimation() {
  console.log('Initializing premium animation...');
  
  // Hide main content initially
  document.body.style.overflow = 'hidden';
  
  // Create welcome overlay
  const welcomeOverlay = document.createElement('div');
  welcomeOverlay.className = 'welcome-overlay';
  welcomeOverlay.id = 'welcomeOverlay';
  
  welcomeOverlay.innerHTML = `
    <div class="welcome-container">
      <div class="welcome-card">
        <div class="simple-jewels">
          <div class="jewel">💎</div>
          <div class="jewel">✨</div>
          <div class="jewel">💍</div>
        </div>
        <div class="welcome-logo">✨ Shimmer & Shine</div>
        <div class="welcome-tagline">Timeless Elegance</div>
        
        <div class="simple-diamond">
          <div class="diamond-shape"></div>
        </div>
        
        <div class="welcome-message">
          Discover jewellery that celebrates your most precious moments.
        </div>
        
        <button class="enter-btn" id="enterBtn">
          <i class="fas fa-gem btn-icon"></i>
          Enter Boutique
        </button>
        
        <div class="skip-text">Automatically entering in <span id="countdown">3</span>s</div>
      </div>
    </div>
  `;
  
  document.body.appendChild(welcomeOverlay);
  
  // Handle enter button click
  const enterBtn = document.getElementById('enterBtn');
  enterBtn.addEventListener('click', function() {
    console.log('Enter button clicked');
    enterBoutique();
  });

  // Auto-enter countdown
  let countdown = 3;
  const countdownEl = document.getElementById('countdown');
  const countdownInterval = setInterval(() => {
    countdown--;
    if (countdownEl) countdownEl.textContent = countdown;
    
    if (countdown <= 0) {
      clearInterval(countdownInterval);
      if (document.getElementById('welcomeOverlay')) {
        enterBoutique();
      }
    }
  }, 1000);
}

function enterBoutique() {
  console.log('Entering boutique...');
  
  // Mark animation as shown for this session
  sessionStorage.setItem('animationShown', 'true');
  
  const welcomeOverlay = document.getElementById('welcomeOverlay');
  if (welcomeOverlay) {
    // Add exiting animation
    welcomeOverlay.classList.add('exiting');
    
    setTimeout(() => {
      // Remove overlay
      welcomeOverlay.remove();
      
      // Show main content
      document.body.classList.add('loaded');
      document.body.style.overflow = 'auto';
      
      console.log('Animation completed, main content shown');
    }, 600);
  } else {
    // Fallback if overlay doesn't exist
    document.body.classList.add('loaded');
    document.body.style.overflow = 'auto';
  }
}

// ===== MAIN APP CODE =====
document.addEventListener("DOMContentLoaded", () => {
  console.log('DOMContentLoaded - Main app code running');
  
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
        sessionStorage.clear(); // Clear session storage on logout
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
      if (card.getBoundingClientRect().top < triggerBottom) card.classList.add("visible");
    });
  }
  window.addEventListener("scroll", revealCards);
  
  // Only run revealCards on load if animation isn't showing
  if (!document.getElementById('welcomeOverlay')) {
    window.addEventListener("load", revealCards);
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
          card.classList.add("visible");
        } else {
          card.style.display = "none";
          card.classList.remove("visible");
        }
      });

      // Optional: smooth scroll to collections section
      const collectionsSection = document.querySelector("#collections");
      if (collectionsSection) {
        collectionsSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});
