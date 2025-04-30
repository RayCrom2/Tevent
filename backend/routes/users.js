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

router.get('/favorites', (req, res) => {
    res.send('GET favorites route is working!');
  });

  
  router.put('/updateProfile', async (req, res) => {
    const { auth0Id, picture, backgroundImage, gallery, bio, contact, name, username } = req.body;
  
    try {
      const user = await User.findOne({ auth0Id });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      if (picture) user.picture = picture;
      if (backgroundImage) user.backgroundImage = backgroundImage;
      if (gallery) user.gallery = gallery;
      if (bio) user.bio = bio;
      if (contact) user.contact = contact;
      if (name) user.name = name;
      if (username) user.username = username;
  
      await user.save();
      res.json({ message: "Profile updated successfully!", user });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

module.exports = router;
