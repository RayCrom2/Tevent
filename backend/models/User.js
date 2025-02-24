const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dateOfBirth: { type: Date },
    role: {
      type: String,
      enum: ['user', 'moderator', 'admin'],
      default: 'user'
    },
    CreateEventPermission: {
      type: Boolean,
      default: false,
      required: true
    },
    isBanned: {
      type: Boolean,
      default: false
    },
    eventLimit: {
      type: Number,
      default: 5
    },
    lastEventCreatedAt: {
      type: Date
    },
    eventsGoing: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    pastEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  });
  module.exports = mongoose.model("User", UserSchema);
