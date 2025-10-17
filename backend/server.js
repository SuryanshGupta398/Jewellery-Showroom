// ===== IMPORTS =====
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

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

app.use(express.json()); // Parse incoming JSON requests

// ===== MONGODB CONNECTION =====
const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/jewelleryDB";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
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
      image: String,
    },
  ],
});

const User = mongoose.model("grahak", userSchema);

// ===== ROUTES =====

// 🧩 REGISTER USER
app.post("/api/register", async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    if (!name || !phone || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "Phone already registered" });
    }

    const newUser = new User({ name, phone, address });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 🔍 LOGIN CHECK (by phone)
app.get("/api/login", async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) return res.status(400).json({ error: "Phone is required" });

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ name: user.name, phone: user.phone });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 👥 GET ALL USERS (admin/test)
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error("❌ Fetch users error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🛍️ ADD TO CART
app.post("/api/cart/add", async (req, res) => {
  try {
    const { phone, product } = req.body;
    if (!phone || !product) {
      return res.status(400).json({ message: "Phone and product are required" });
    }

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

// 🧾 GET CART
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

// 🗑️ REMOVE FROM CART
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

// 🔢 UPDATE CART QUANTITY
app.post("/api/cart/update", async (req, res) => {
  try {
    const { phone, productId, quantity } = req.body;
    if (!phone || !productId || quantity == null) {
      return res.status(400).json({ message: "Phone, productId, and quantity are required" });
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

// 🧠 TEST ROUTE
app.get("/", (req, res) => {
  res.send("✅ Jewellery Backend running successfully");
});

// ===== SERVER START =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
