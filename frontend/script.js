document.addEventListener("DOMContentLoaded", () => {
  // ===== REGISTER FORM =====
  const registerForm = document.getElementById("registerForm");
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("regName").value.trim();
    const address = document.getElementById("regAddress").value.trim();
    const phone = document.getElementById("regPhone").value.trim();

    if (!name || !address || !/^\d{10}$/.test(phone)) {
      alert("Please enter valid details.");
      return;
    }

    // Send data to backend via GET request
    fetch(
      `http://localhost:5000/api/register?name=${encodeURIComponent(
        name
      )}&phone=${encodeURIComponent(phone)}&address=${encodeURIComponent(
        address
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          alert(data.message);
          registerForm.reset();
        } else {
          alert("Something went wrong!");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Server error. Try again later.");
      });
  });

  // ===== LOGIN FORM WITH OTP =====
  const sendOtpBtn = document.getElementById("sendOtpBtn");
  const loginBtn = document.getElementById("loginBtn");
  const otpGroup = document.querySelector(".otp-group");
  let generatedOtp = "";

  sendOtpBtn.addEventListener("click", () => {
    const phone = document.getElementById("loginPhone").value.trim();

    if (!/^\d{10}$/.test(phone)) {
      alert("Enter a valid 10-digit phone number.");
      return;
    }

    // Check backend for registered user
    fetch(`http://localhost:5000/api/login?phone=${encodeURIComponent(phone)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          alert(data.message); // User not found or error
        } else {
          // Generate OTP (demo only)
          generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
          console.log("OTP for demo:", generatedOtp);
          alert("OTP sent! Check console for demo.");

          otpGroup.style.display = "block";
          sendOtpBtn.style.display = "none";
          loginBtn.style.display = "block";

          // Save user info temporarily for welcome message
          localStorage.setItem("userName", data.name);
          localStorage.setItem("userPhone", data.phone);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Server error. Try again later.");
      });
  });

  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const enteredOtp = document.getElementById("otp").value.trim();
    if (enteredOtp === generatedOtp) {
      alert("Login successful!");
      localStorage.setItem("isLoggedIn", "true"); // mark login
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
