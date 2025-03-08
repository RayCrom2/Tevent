require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Load environment variables
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key"; // Fallback if JWT_SECRET is missing

// Check if required environment variables are set
if (!MONGO_URI) {
    console.error("❌ ERROR: MONGO_URI is not set in the .env file.");
    process.exit(1); // Exit the process
}
if (!process.env.JWT_SECRET) {
    console.warn("⚠️ Warning: JWT_SECRET is not set! Using a default secret. This is NOT safe for production.");
}

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Suppress Mongoose deprecation warnings
mongoose.set("strictQuery", false);

// Test route
app.get("/", (req, res) => {
    res.send("✅ Backend is running.");
});

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Exit if DB connection fails
});

// Import routes
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");

// Use Routes
app.use("/auth", authRoutes);
app.use("/events", eventRoutes);

// Start server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));