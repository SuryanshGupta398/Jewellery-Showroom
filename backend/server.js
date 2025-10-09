const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ===== MIDDLEWARE =====
app.use(cors({ origin: "*" })); // allow all origins (you can restrict to your domain later)
app.use(express.json()); // parse JSON body

// ===== MONGODB CONNECTION =====
const mongoURI = "mongodb+srv://user_01:bala@cluster0.qgcatm6.mongodb.net/fake_new_app?retryWrites=true&w=majority";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===== USER MODEL =====
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  address: { type: String, required: true },
});

const User = mongoose.model("grahak", userSchema);

// ===== ROUTES =====

// 🧩 Register new user
app.post("/api/register", async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    if (!name || !phone || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "Phone already registered" });
    }

    const newUser = new User({ name, phone, address });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
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

// 🔧 Test route
app.get("/", (req, res) => {
  res.send("✅ Backend running successfully");
});

// ===== SERVER LISTEN =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
