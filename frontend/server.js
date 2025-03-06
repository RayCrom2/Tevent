// Load environment variables from a .env file into process.env
//require('dotenv').config();
require("dotenv").config({ path: "backend.env" });

// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Initialize the Express app
const app = express();

// Define the server port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;

// Define the JWT secret key from environment variables or use a default value
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";


// Middleware to parse JSON request bodies
app.use(express.json()); 

// Middleware to enable Cross-Origin Resource Sharing (CORS)
app.use(cors()); 

// Establish connection to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    // Log success message when connected
    .then(() => console.log("MongoDB Connected")) 

    // Log error message if connection fails
    .catch(err => console.log(err)); 

// Define the schema for User collection in MongoDB
const UserSchema = new mongoose.Schema({
    username: String, // Field to store the username
    password: String // Field to store the hashed password
});

// Create a User model based on the defined schema
const User = mongoose.model('User', UserSchema);


/**
 * Register a new user
 * Endpoint: POST /register
 * Description: This endpoint allows new users to create an account.
 * It checks if the username is already taken, hashes the password,
 * and stores the user in the database.
 */
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: "Username already exists!" });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({ username, password: hashedPassword });

    // Save the user to the database
    await newUser.save();

    res.json({ message: "User registered successfully!" });
});

/**
 * Authenticate a user and issue a JWT token
 * Endpoint: POST /login
 * Description: This endpoint allows users to log in by verifying their credentials.
 * If authentication is successful, a JWT token is issued for future requests.
 */
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find the user by username in the database
    const user = await User.findOne({ username });

    // Check if user exists and the password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: "Invalid credentials!" });
    }

    // Generate a JWT token for authentication
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token }); // Send the token as response
});

/**
 * Start the Express server
 * Description: This function starts the server and listens on the defined port.
 * It logs a message indicating the server is running.
 */
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));