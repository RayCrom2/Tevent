const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // Users attending the event
});

module.exports = mongoose.model("Event", EventSchema);
