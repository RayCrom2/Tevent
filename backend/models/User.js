const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Will store hashed passwords
    dateOfBirth: { type: Date },
    eventsGoing: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }], // Events the user is attending
    pastEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }], // Events the user attended
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // Friends list
});

module.exports = mongoose.model("User", UserSchema);

