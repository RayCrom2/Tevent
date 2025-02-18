require("dotenv").config({ path: "backend.env" });
console.log("✅ Loaded JWT_SECRET:", process.env.JWT_SECRET); // Debugging line
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Import routes
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");

app.use(authRoutes);
app.use(eventRoutes);

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
