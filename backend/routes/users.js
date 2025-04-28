const express = require("express");
const Event = require("../models/Event");
const User = require("../models/User");

const router = express.Router();

router.post('/favorites', async (req, res) => {
  const { auth0Id, eventId } = req.body;

  try {
    const user = await User.findOne({ auth0Id });

    if (!user) return res.status(404).json({ message: "User not found" });

    const alreadyFavorited = user.favorites.includes(eventId);

    if (alreadyFavorited) {
      user.favorites.pull(eventId);
    } else {
      user.favorites.push(eventId);
    }

    await user.save();

    res.json({
      updatedFavorites: user.favorites,
      message: alreadyFavorited ? "Removed from favorites!" : "Added to favorites!"
    });

  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
