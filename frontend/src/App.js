// Import necessary React modules and hooks
import React, { useState, useEffect } from 'react';

// Import React Router components for routing
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Import application components
import Login from './components/Login'; // Login component
import Menu from './components/Menu'; // Menu component
import Home from './pages/Home'; // Home page component
import Profile from './pages/Profile'; // Profile page component
import Events from './pages/Events'; // Events page component


// This component manages routing and user authentication.
const App = () => {
    // State to track user authentication status
    const [isAuthenticated, setIsAuthenticated] = useState(false);

   
    // Checks if a token exists in local storage when the component mounts.
    // If a token is found, the user is considered authenticated.
    useEffect(() => {
        const token = localStorage.getItem("token"); // Retrieve token from local storage
        setIsAuthenticated(!!token); // Convert token existence to a boolean (true if exists, false otherwise)
    }, []);

    
    // handleLogin function
    // Simulates user login by setting a dummy token in local storage and updating authentication state.
    const handleLogin = () => {
        // Store a dummy authentication token
        localStorage.setItem("token", "dummyToken"); 
        setIsAuthenticated(true); // Update authentication state to true
    };

    // handleLogout function
    // Logs the user out by removing the token from local storage and updating authentication state.
    const handleLogout = () => {
        localStorage.removeItem("token"); // Remove the authentication token
        setIsAuthenticated(false); // Update authentication state to false
    };

    return (
        // Define the application router using BrowserRouter
        <Router>
            <Routes>

                {/* Route for the root path ("/") */}
                {/* Redirects authenticated users to "/menu", otherwise displays the Login component */}
                <Route path="/" element={isAuthenticated ? <Navigate to="/menu" /> : <Login onLogin={handleLogin} />} />

                {/* Route for the menu page */}
                {/* Only accessible if authenticated, otherwise redirects to the login page */}
                <Route path="/menu" element={isAuthenticated ? <Menu onLogout={handleLogout} /> : <Navigate to="/" />} />

                {/* Route for the home page */}
                {/* Only accessible if authenticated, otherwise redirects to the login page */}
                <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/" />} />

                {/* Route for the profile page */}
                {/* Only accessible if authenticated, otherwise redirects to the login page */}
                <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/" />} />

                {/* Route for the events page */}
                {/* Only accessible if authenticated, otherwise redirects to the login page */}
                <Route path="/events" element={isAuthenticated ? <Events /> : <Navigate to="/" />} />
                
            </Routes>
        </Router>
    );
};

// Export the App component to be used in other parts of the application
export default App;
