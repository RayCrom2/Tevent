const express = require("express");
const Event = require("../models/Event");
const User = require("../models/User");
const { getOrCreateUser } = require("../utils/auth");


const router = express.Router();

/**
 * @route   POST /api/events
 * @desc    Create a new event
 */
router.post("/events", async (req, res) => {
  try {
    console.log("Incoming request body:", req.body); // 👈 ADD THIS
    const {
      title,
      description,
      location,
      audience,
      category,
      lat,
      lng,
      date,
      startTime,
      endTime,
    } = req.body;

    if (!title || !location || !date) {
      return res.status(400).json({ error: "Title, location, and date are required." });
    }

    const newEvent = new Event({
      title,
      description,
      location,
      date: new Date(date),
      audience,
      category,
      lat,
      lng,
      startTime,
      endTime,
    });

    const savedEvent = await newEvent.save();
    console.log("Saved to DB:", savedEvent); // 👈 ADD THIS
    res.status(201).json(savedEvent);
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ error: "Server error creating event." });
  }
});

/**
 * @route   POST /api/events/:id/attend
 * @desc    Mark a user as attending an event
 */
router.post("/events/:id/attend", async (req, res) => {
  try {
    const { userId } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (!event.attendees.includes(userId)) {
      event.attendees.push(userId);
      await event.save();

      await User.findByIdAndUpdate(userId, {
        $addToSet: { eventsGoing: event._id },
      });
    }

    res.json({ message: "Marked as going", event });
  } catch (err) {
    console.error("Error marking as attending:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   GET /api/events
 * @desc    Fetch all events
 */
router.get("/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: err.message });
  }
});


// Toggle favorite status for an event
router.post("/events/:id/favorite", async (req, res) => {
  const { userId } = req.body; // user.sub from frontend
  try {
    const user = await getOrCreateUser({ sub: userId });

    const eventId = req.params.id;
    const alreadyFavorited = user.favorites.includes(eventId);

    if (alreadyFavorited) {
      user.favorites.pull(eventId);
    } else {
      user.favorites.push(eventId);
    }

    await user.save();
    res.json({ success: true, favorited: !alreadyFavorited });

  } catch (err) {
    console.error("Error syncing Auth0 user:", err);
    res.status(500).json({ error: "Server error" });
  }
});


const getOrCreateUser = async (auth0User) => {
  const auth0Id = auth0User.sub;

  let user = await User.findOne({ auth0Id });
  if (!user) {
    user = await User.create({
      auth0Id,
      name: auth0User.name || "",
      email: auth0User.email || ""
    });
    console.log("🆕 New user created in MongoDB:", user);
  }

  return user;
};

module.exports = { getOrCreateUser };

module.exports = router;
