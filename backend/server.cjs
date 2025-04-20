require("dotenv").config({ path: ".env" }); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const eventRoutes = require('./routes/events');
const checkJwt = require('./middleware/checkJwt'); // Auth0 JWT verification middleware

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cors());

// Root route
app.get('/', (req, res) => {
  res.send(`Server running on port ${PORT}`);
});

// Protected API route (requires Auth0 access token)
app.use("/api/events", eventRoutes);

// Connect to MongoDB
mongoose.set('strictQuery', true); // Optional: clean up warning
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
