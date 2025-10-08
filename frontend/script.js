document.addEventListener("DOMContentLoaded", () => {
  const backendURL = "https://jewellery-website-5xi0.onrender.com"; // <-- your Render backend URL

  // ===== REGISTER FORM =====
  const registerForm = document.getElementById("registerForm");
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("regName").value.trim();
    const address = document.getElementById("regAddress").value.trim();
    const phone = document.getElementById("regPhone").value.trim();

    if (!name || !address || !/^\d{10}$/.test(phone)) {
      alert("Please enter valid details.");
      return;
    }

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

  // ===== LOGIN FORM WITH OTP =====
  const sendOtpBtn = document.getElementById("sendOtpBtn");
  const loginBtn = document.getElementById("loginBtn");
  const otpGroup = document.querySelector(".otp-group");
  let generatedOtp = "";

  sendOtpBtn.addEventListener("click", async () => {
    const phone = document.getElementById("loginPhone").value.trim();

    if (!/^\d{10}$/.test(phone)) {
      alert("Enter a valid 10-digit phone number.");
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
    }
  });

  // ===== Navbar welcome message & logout =====
  const loginBtnNav = document.getElementById("loginbtn");
  const navLinks = loginBtnNav?.parentNode;
  const marquee = document.querySelector(".marquee");
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userName = localStorage.getItem("userName");
  const userPhone = localStorage.getItem("userPhone");

  if (isLoggedIn === "true") {
    const displayName = userName || userPhone;
    if (marquee) {
      marquee.textContent = `🎉 Welcome, ${displayName}! Explore our exclusive jewellery collections! ✨`;
    }

    if (loginBtnNav) loginBtnNav.style.display = "none";

    if (navLinks) {
      const logoutBtn = document.createElement("a");
      logoutBtn.textContent = "Logout";
      logoutBtn.href = "#";
      logoutBtn.className = "btn";
      logoutBtn.style.marginLeft = "10px";
      logoutBtn.onclick = (e) => {
        e.preventDefault();
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userPhone");
        localStorage.removeItem("userName");
        window.location.reload();
      };
      navLinks.appendChild(logoutBtn);
    }
  }

  // ===== Navbar scroll effect =====
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.style.background = "rgba(255, 255, 255, 0.9)";
    } else {
      navbar.style.background = "rgba(255, 255, 255, 0.25)";
    }
  });

  // ===== Smooth scroll for hero button =====
  const scrollBtn = document.querySelector(".hero .btn");
  if (scrollBtn) {
    scrollBtn.addEventListener("click", () => {
      const collections = document.querySelector("#collections");
      collections.scrollIntoView({ behavior: "smooth" });
    });
  }

  // ===== Card reveal on scroll =====
  const cards = document.querySelectorAll(".card");
  function revealCards() {
    const triggerBottom = window.innerHeight * 0.85;
    cards.forEach((card) => {
      const cardTop = card.getBoundingClientRect().top;
      if (cardTop < triggerBottom) {
        card.classList.add("visible");
      }
    });
  }
  window.addEventListener("scroll", revealCards);
  window.addEventListener("load", revealCards);

  // ===== Page load animation =====
  window.addEventListener("load", () => {
    document.body.classList.add("loaded");
  });
});
