
require("dotenv").config({ path: ".env" });
console.log("✅ Loaded JWT_SECRET:", process.env.JWT_SECRET); // Debugging line
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register a user
router.post("/register", async (req, res) => {
    try {
        console.log("📩 /auth/register hit!");

        const { username, password, dateOfBirth } = req.body;

        // Check if username exists
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "Username already taken" });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new User({ username, password: hashedPassword, dateOfBirth });
        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
        console.log("Register route hit!");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login a user
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log("🔍 JWT_SECRET from backend.env:", process.env.JWT_SECRET); // Debugging step

        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post("/sync-user", async (req, res) => {
    try {
      console.log("🛬 /sync-user hit");
      console.log("📦 Request body:", req.body);
  
      const { username, email, picture, sub } = req.body;
  
      if (!sub || !email || !username) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      let user = await User.findOne({ auth0Id: sub });
  
      if (!user) {
        user = new User({
          auth0Id: sub,
          email,
          username,
          picture,
          password: "auth0",
          role: "user",
          CreateEventPermission: false,
          eventLimit: 5,
          eventsGoing: [],
          pastEvents: [],
          friends: [],
        });
  
        await user.save();
        console.log("✅ New user saved:", user.username);
      } else {
        console.log("ℹ️ User already exists:", user.username);
      }
  
      res.json({ message: "User synced" });
    } catch (err) {
      console.error("❌ Sync error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });
  
  

// Delete a user
router.delete("/users/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
