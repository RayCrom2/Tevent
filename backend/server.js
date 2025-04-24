
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
app.use("/api/routes", eventRoutes); // this means all /events routes are prefixed with /api


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


// **Register API**
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
        return res.status(400).json({ message: "Username already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });

    await newUser.save();
    res.json({ message: "User registered successfully!" });
});

// **Login API**
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));