const express = require("express");
const Event = require("../models/Event");
const User = require("../models/User");

const router = express.Router();
const checkJwt = require("../middleware/checkJwt");

// Create an event
router.post("/", checkJwt, async (req, res) => {
  try {
    const { title, start, end, description, location } = req.body;

    console.log("🟡 Incoming event data:", req.body);

    const newEvent = new Event({ title, start, end, description, location });
    const saved = await newEvent.save();

    console.log("🟢 Event saved to DB:", saved);
    res.status(201).json(saved);
  } catch (err) {
    console.error("🔴 Failed to save event:", err);
    res.status(400).json({ error: "Failed to create event" });
  }
});


// Mark user as going
router.post("/:id/attend", checkJwt, async (req, res) => {
  try {
    const { userId } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (!event.attendees.includes(userId)) {
      event.attendees.push(userId);
      await event.save();

      await User.findByIdAndUpdate(userId, { $push: { eventsGoing: event._id } });
    }

    res.json({ message: "Marked as going", event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all events (public)
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Export the router
module.exports = router;
