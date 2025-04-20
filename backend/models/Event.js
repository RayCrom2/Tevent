const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  start: { type: String, required: true },
  end: { type: String, required: true },
  description: { type: String },
  location: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
