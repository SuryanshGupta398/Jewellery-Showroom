const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ===== MIDDLEWARE =====
app.use(cors({
  origin: [
    "https://jewellery-showroom-4svb.vercel.app",
    "http://localhost:3000",       // for Live Server
    "http://127.0.0.1:5500",       // fallback
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
 // allow all origins (you can restrict to your domain later)
app.use(express.json()); // parse JSON body

// ===== MONGODB CONNECTION =====
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error("❌ MONGODB_URI not set in environment variables");
  process.exit(1);
}

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
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

// ===== ROUTES =====

// 🧩 Register new user
app.post("/api/register", async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    console.log("Register request body:", req.body);

    if (!name || !phone || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "Phone already registered" });
    }

    const newUser = new User({ name, phone, address });
    const savedUser = await newUser.save();

    console.log("Saved user:", savedUser);
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 🔍 Login route (check if phone exists)
app.get("/api/login", async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) return res.status(400).json({ error: "Phone is required" });

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Send user data (no sensitive info)
    res.json({ name: user.name, phone: user.phone });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🛍️ Add item to user's cart
// 🛍️ Add item to user's cart (or increase quantity)
app.post("/api/cart/add", async (req, res) => {
  try {
    const { phone, product } = req.body;

    if (!phone || !product) {
      return res.status(400).json({ message: "Phone and product are required" });
    }

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if product already exists
    const existingItem = user.cart.find(item => item.productId === product.productId);

    if (existingItem) {
      existingItem.quantity += product.quantity || 1; // increment quantity
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

// 🧾 Get user's cart
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

// 🗑️ Remove item from cart
app.post("/api/cart/remove", async (req, res) => {
  try {
    const { phone, productId } = req.body;

    if (!phone || !productId) {
      return res.status(400).json({ message: "Phone and productId are required" });
    }

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = user.cart.filter(item => item.productId !== productId);
    await user.save();

    res.json({ message: "Item removed", cart: user.cart });
  } catch (err) {
    console.error("❌ Remove from cart error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 🔢 Update quantity
app.post("/api/cart/update", async (req, res) => {
  try {
    const { phone, productId, quantity } = req.body;

    if (!phone || !productId || quantity == null) {
      return res.status(400).json({ message: "Phone, productId and quantity are required" });
    }

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    const item = user.cart.find(i => i.productId === productId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (quantity <= 0) {
      user.cart = user.cart.filter(i => i.productId !== productId);
    } else {
      item.quantity = quantity;
    }

    await user.save();
    res.json({ message: "Quantity updated", cart: user.cart });
  } catch (err) {
    console.error("❌ Update cart error:", err);
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
