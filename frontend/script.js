document.addEventListener("DOMContentLoaded", () => {
  const backendURL = "https://jewellery-website-5xi0.onrender.com"; // <-- your Render backend URL

  // ===== REGISTER FORM =====
  const registerForm = document.getElementById("registerForm");
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("regName").value.trim();
    const address = document.getElementById("regAddress").value.trim();
    const phone = document.getElementById("regPhone").value.trim();

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
      const res = await fetch(`${backendURL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, address })
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Registered successfully!");
        registerForm.reset();
      } else {
        alert(data.message || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Try again later.");
    }
  });
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

<<<<<<< HEAD
  sendOtpBtn.addEventListener("click", async () => {
    const phone = document.getElementById("loginPhone").value.trim();
=======
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
  localStorage.setItem("skipAnimation", "true");  // ✅ Add this line
  window.location.href = "index.html";
}
 else {
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


    try {
      const res = await fetch(`${backendURL}/api/login?phone=${encodeURIComponent(phone)}`);
      const data = await res.json();

      if (data.message) {
        alert(data.message); // user not found
      } else {
        // Generate OTP (demo only)
        generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("OTP for demo:", generatedOtp);
        alert("OTP sent! Check console for demo.");

        otpGroup.style.display = "block";
        sendOtpBtn.style.display = "none";
        loginBtn.style.display = "block";

        localStorage.setItem("userName", data.name);
        localStorage.setItem("userPhone", data.phone);
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Try again later.");
    }
  });

  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const enteredOtp = document.getElementById("otp").value.trim();
    if (enteredOtp === generatedOtp) {
      alert("Login successful!");
      localStorage.setItem("isLoggedIn", "true");
      window.location.reload();
    } else {
      alert("Invalid OTP. Try again.");
=======
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

  // ===== PAGE LOAD ANIMATION =====
  window.addEventListener("load", () => document.body.classList.add("loaded"));
  // ===== FILTER FUNCTIONALITY (FIXED) =====
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
  btn.addEventListener("click", () => {
    const card = btn.closest(".product-card");
    modalName.textContent = card.dataset.name;
    modalMaterial.textContent = card.dataset.material;
    modalWeight.textContent = card.dataset.weight;
    modalPrice.textContent = card.dataset.price;
    modalDesc.textContent = card.dataset.desc;
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  });
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
  document.body.style.overflow = "auto";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
});
  // ===== FILTER FUNCTIONALITY =====
});

// Premium Opening Animation
document.addEventListener("DOMContentLoaded", function () {
  // Run animation only on homepage
  const currentPage = window.location.pathname.split("/").pop();
  if (currentPage !== "" && currentPage !== "index.html") return;

  // Hide main content initially
  document.body.style.overflow = "hidden";

  // Create premium welcome overlay
  const welcomeOverlay = document.createElement("div");
  welcomeOverlay.className = "welcome-overlay";

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
          Step into a world where every piece tells a story of craftsmanship, 
          luxury, and timeless beauty. Discover jewellery that celebrates 
          your most precious moments.
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

  // Create background particles
  createParticles();

  const enterBtn = welcomeOverlay.querySelector(".enter-btn");
  enterBtn.addEventListener("click", () => enterBoutique(welcomeOverlay, enterBtn));

  // Keyboard Enter support
  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && document.contains(welcomeOverlay)) {
      enterBoutique(welcomeOverlay, enterBtn);
    }
  });

  // ===== Functions =====
  function enterBoutique(welcomeOverlay, enterBtn) {
    enterBtn.innerHTML = '<i class="fas fa-spinner fa-spin btn-icon"></i> Loading...';
    enterBtn.disabled = true;

    welcomeOverlay.classList.add("exiting");
    playClickSound();

    setTimeout(() => {
      welcomeOverlay.remove();
      document.body.style.overflow = "auto";
      animateMainContent();
      createFloatingElements(); // ✅ Show floating jewels AFTER entry
    }, 1000);
  }

  function createParticles() {
    const particlesContainer = document.getElementById("backgroundParticles");
    if (!particlesContainer) return;

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.top = Math.random() * 100 + "%";
      particle.style.animationDelay = Math.random() * 6 + "s";
      particle.style.background = `hsl(${Math.random() * 20 + 40}, 70%, 60%)`;
      particle.style.width = Math.random() * 4 + 2 + "px";
      particle.style.height = particle.style.width;
      particlesContainer.appendChild(particle);
    }
  }

  function animateMainContent() {
    const elements = [
      ".navbar",
      ".hero",
      ".collections",
      ".main-content",
      ".marquee-container",
    ];
    elements.forEach((selector, index) => {
      const element = document.querySelector(selector);
      if (element) {
        setTimeout(() => {
          element.classList.add("visible");
        }, index * 300);
      }
    });
  }

  function createFloatingElements() {
    // ✅ Create floating background jewels after welcome overlay disappears
    let floatingContainer = document.getElementById("floatingElements");
    if (!floatingContainer) {
      floatingContainer = document.createElement("div");
      floatingContainer.id = "floatingElements";
      document.body.appendChild(floatingContainer);
    }

    const jewels = ["💎", "✨", "🔶", "💍", "🌟", "💫", "⭐", "🔸"];
    for (let i = 0; i < 10; i++) {
      const jewel = document.createElement("div");
      jewel.className = "floating-element";
      jewel.textContent = jewels[Math.floor(Math.random() * jewels.length)];
      jewel.style.left = Math.random() * 100 + "%";
      jewel.style.top = Math.random() * 100 + "%";
      jewel.style.animationDelay = Math.random() * 5 + "s";
      jewel.style.fontSize = Math.random() * 1.5 + 1 + "rem";
      floatingContainer.appendChild(jewel);
    }
  }

  function playClickSound() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        1200,
        audioContext.currentTime + 0.1
      );

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.1
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      console.log("Audio context not supported");
    }
  }
});

