// ===== index.js =====
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const twilio = require("twilio");

const app = express();

// ===== MIDDLEWARE =====
app.use(cors({
  origin: [
    "https://jewellery-showroom-4svb.vercel.app", // Vercel frontend
    "http://localhost:3000",
    "http://127.0.0.1:5500"
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// ===== ENV VARIABLES =====
const mongoURI = process.env.MONGODB_URI;
const TWILIO_ACCOUNT_SID = process.env.ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.AUTH_TOKEN;
const TWILIO_NUMBER = process.env.TWILIO_PHONE_NUMBER;

if (!mongoURI || !TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_NUMBER) {
  console.error("❌ Environment variables missing");
  process.exit(1);
}

// ===== TWILIO CLIENT =====
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// ===== MONGODB CONNECTION =====
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===== USER MODEL =====
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  cart: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: { type: Number, default: 1 },
      image: String
    }
  ]
});

const User = mongoose.model("grahak", userSchema);

// ===== OTP STORE (in-memory) =====
global.otpStore = {}; // phone: otp

// ===== ROUTES =====

// 🧾 Send OTP for login
app.post("/api/login-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone is required" });

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Send OTP via Twilio
    await client.messages.create({
      body: `Your login OTP is ${otp}`,
      from: TWILIO_NUMBER,
      to: phone
    });

    // Store OTP in memory
    global.otpStore[phone] = otp;

    res.status(200).json({ message: "OTP sent successfully!" });
  } catch (err) {
    console.error("❌ Send login OTP error:", err);
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
});

// ✅ Verify login OTP
app.post("/api/login-verify", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ message: "Phone and OTP are required" });

    const validOtp = global.otpStore[phone];
    if (!validOtp) return res.status(400).json({ message: "OTP not found or expired" });

    if (parseInt(otp) === validOtp) {
      delete global.otpStore[phone]; // OTP used

      // Fetch user info
      const user = await User.findOne({ phone });
      if (!user) return res.status(404).json({ message: "User not found" });

      return res.status(200).json({
        message: "Login successful!",
        user: { name: user.name, phone: user.phone }
      });
    } else {
      return res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (err) {
    console.error("❌ Login OTP verify error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 🔍 Login route (without OTP, optional)
app.get("/api/login", async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) return res.status(400).json({ error: "Phone is required" });

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ name: user.name, phone: user.phone });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🛍️ Cart routes
app.post("/api/cart/add", async (req, res) => {
  try {
    const { phone, product } = req.body;
    if (!phone || !product) return res.status(400).json({ message: "Phone and product are required" });

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    const existingItem = user.cart.find(item => item.productId === product.productId);
    if (existingItem) {
      existingItem.quantity += product.quantity || 1;
    } else {
      user.cart.push({ ...product, quantity: product.quantity || 1 });
    }

    await user.save();
    res.status(200).json({ message: "Item added to cart", cart: user.cart });
  } catch (err) {
    console.error("❌ Add to cart error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/api/cart", async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) return res.status(400).json({ message: "Phone is required" });

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ cart: user.cart });
  } catch (err) {
    console.error("❌ Get cart error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 🔧 Test route
app.get("/", (req, res) => {
  res.send("✅ Backend running successfully");
});

// ===== SERVER LISTEN =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
