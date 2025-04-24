const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String, required: true },
  date: { type: Date, required: true }, // base event date
  startTime: { type: String }, // e.g., "09:00"
  endTime: { type: String },   // e.g., "17:00"
  audience: {
    type: String,
    enum: ["Everyone", "18+", "21+"], // ✅ only allowed values
    default: "Everyone"
  },
    category: { type: String },  // e.g., "Music"
  lat: { type: Number },
  lng: { type: Number },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true }); // adds createdAt & updatedAt

module.exports = mongoose.model("Event", EventSchema);
