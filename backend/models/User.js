const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  auth0Id: { type: String, unique: true, sparse: true }, // e.g. 'google-oauth2|abc123'
  email: { type: String, unique: true, sparse: true },
  username: { type: String, required: true, unique: true },
  picture: { type: String },

  backgroundImage: { type: String }, // <-- added for profile background

  gallery: [{ type: String }], // <-- added for array of gallery photo URLs

  // Optional if using Auth0
  password: { type: String, default: "auth0" }, // for legacy/fallback only

  dateOfBirth: { type: Date }, // optional — you can update this later via form

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

  lastEventCreatedAt: { type: Date },

  eventsGoing: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
  pastEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

// Safe export for dev environments
module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
