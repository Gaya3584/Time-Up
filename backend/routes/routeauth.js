const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // ✅ Fix added
const User = require("../models/User");
require("dotenv").config();

console.log("User model loaded:", User);

// POST /register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    console.log("Checking for existing user:", existingUser);

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // ✅ If token doesn't exist, generate and save one
    if (!user.token) {
      user.token = crypto.randomBytes(32).toString("hex");
      await user.save();
    }

    // Send back same token each time
    res.json({
      message: "Login successful",
      token: user.token,
      username: user.username,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
