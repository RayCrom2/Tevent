require("dotenv").config({ path: ".env" }); 
const authRoutes = require("./routes/auth");
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const eventRoutes = require('./routes/events');


const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

app.get('/', (req, res) => {
    res.send(`Server running on port ${PORT}`);
  });

// Middleware
app.use(express.json());
app.use(cors());
app.use("/auth", authRoutes);
app.use("/api", eventRoutes); 

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


app.listen(PORT, () => console.log(`Server running on port ${"https://tevent-1.onrender.com"}`));