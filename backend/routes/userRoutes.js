console.log("✅ userRoutes.js loaded");
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/search-users', async (req, res) => {
  try {
    const query = req.query.query?.toLowerCase() || "";

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).select('username email picture _id');

    res.json(users);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;