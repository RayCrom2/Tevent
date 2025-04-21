const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  start: String,
  end: String,
  lat: Number,
  lng: Number,
  location: String
});


module.exports = mongoose.model('Event', EventSchema);
