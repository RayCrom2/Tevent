// Import necessary dependencies from React
import React, { useState, useEffect } from 'react';
import Login from './components/Login'; // Import the Login component

const App = () => {
    // State to track if a user is authenticated
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // State to store registered users
    const [users, setUsers] = useState([]);

    // useEffect hook to load users from local storage when the component mounts
    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem("users")); // Retrieve stored users from local storage
        if (storedUsers) setUsers(storedUsers); // Set users state if users exist in storage
    }, []); // Runs only once when the component mounts

    // Function to handle user login
    const handleLogin = (username, password) => {
        // Retrieve the list of registered users from local storage
        const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

        // Check if the entered credentials match any user in storedUsers
        const user = storedUsers.find(user => user.username === username && user.password === password);

        if (user) {
            setIsAuthenticated(true); // Set authentication to true if credentials are valid
        } else {
            alert("Invalid username or password!"); // Show an error if credentials are incorrect
        }
    };

    // Function to handle new user registration
    const handleRegister = (username, password) => {
        // Retrieve the list of registered users from local storage
        const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

        // Check if the username already exists
        if (existingUsers.some(user => user.username === username)) {
            alert("Username already exists!"); // Alert user if the username is taken
            return;
        }

        // Add the new user to the users array
        const newUsers = [...existingUsers, { username, password }];

        // Store the updated users list in local storage
        localStorage.setItem("users", JSON.stringify(newUsers));

        // Update the state with the new users list
        setUsers(newUsers);

        alert("Registration successful! Please login."); // Notify user of successful registration
    };

    return (
        <div>
            {/* If the user is authenticated, show a welcome message */}
            {isAuthenticated ? (
                <h1>Welcome to the App!</h1>
            ) : (
                // Otherwise, show the Login component and pass down login & register functions as props
                <Login onLogin={handleLogin} onRegister={handleRegister} />
            )}
        </div>
    );
};

// Export the App component so it can be used in index.js
export default App;