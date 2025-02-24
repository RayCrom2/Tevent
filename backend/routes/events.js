const express = require("express");
const Event = require("../models/Event");
const User = require("../models/User");

const router = express.Router();

// Create an event
router.post("/events", async (req, res) => {
    try {
        const { title, description, location, date } = req.body;
        const newEvent = new Event({ title, description, location, date });
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mark a user as "Going" to an event
router.post("/events/:id/attend", async (req, res) => {
    try {
        const { userId } = req.body;
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        event.attendees.push(userId);
        await event.save();

        await User.findByIdAndUpdate(userId, { $push: { eventsGoing: event._id } });

        res.json({ message: "Marked as going", event });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all events
router.get("/events", async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
