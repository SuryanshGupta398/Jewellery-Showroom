// ===== server.js =====
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const twilio = require("twilio");

const app = express();

// ===== MIDDLEWARE =====
app.use(cors({
  origin: [
    "https://jewellery-showroom-4svb.vercel.app",
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
  .catch(err => console.error("❌ MongoDB connection error:", err));

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
  ],
  otp: String,
  otpExpires: Date
});

const User = mongoose.model("User", userSchema);

// ===== ROUTES =====

// 🧾 Send OTP for login
app.post("/api/login-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone is required" });

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Send OTP via Twilio
    await client.messages.create({
      body: `Your login OTP is ${otp}`,
      from: TWILIO_NUMBER,
      to: `+91${phone}` // India numbers must include +91
    });

    // Save OTP in user document
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

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

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check OTP and expiration
    if (!user.otp || !user.otpExpires || new Date() > user.otpExpires) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    if (user.otp === otp) {
      // OTP correct, clear it
      user.otp = null;
      user.otpExpires = null;
      await user.save();

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

// 🔍 Optional: Fetch user info
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

// 🛍️ Cart routes remain same as your current code

// 🔧 Test route
app.get("/", (req, res) => {
  res.send("✅ Backend running successfully");
});

// ===== SERVER LISTEN =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
