const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // parses JSON POST body

// MongoDB connection
mongoose.connect(
  "mongodb+srv://user_01:bala@cluster0.qgcatm6.mongodb.net/fake_new_app?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error(err));

// User model
const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
});

const User = mongoose.model("User", userSchema);

// Registration route (POST)
app.post("/api/register", async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    if (!name || !phone || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if phone already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) return res.status(400).json({ message: "Phone already registered" });

    const newUser = new User({ name, phone, address });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

app.listen(5000, () => console.log("Server started at http://localhost:5000"));
