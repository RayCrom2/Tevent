require("dotenv").config({ path: "backend.env" });
const mongoose = require("mongoose");
const User = require("../models/User");

// ✅ Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ Connected to MongoDB Atlas");

    // 🔥 Check if dummy user already exists
    const existingUser = await User.findOne({ username: "dummyUser" });
    if (existingUser) {
      console.log("ℹ️ Dummy user already exists:", existingUser);
      mongoose.disconnect();
      return;
    }

    // 👤 Create a dummy user
    const dummyUser = new User({
      username: "dummyUser",
      password: "dummyPassword123", // ⚠️ In real apps, hash this password
      dateOfBirth: new Date("2000-01-01"),
      role: "user",
      CreateEventPermission: true,
      isBanned: false,
      eventLimit: 5,
      lastEventCreatedAt: new Date(),
      eventsGoing: [],
      pastEvents: [],
      friends: [],
    });

    await dummyUser.save();
    console.log("✅ Dummy user created successfully:", dummyUser);

    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
  });

