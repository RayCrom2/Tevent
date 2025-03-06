// Import React and the useState hook for managing component state
import React, { useState } from 'react';

// Import authentication functions for user registration and login
import { registerUser, loginUser } from '../services/authService';  

// Import styles for the authentication component
import styles from '../styles/authStyles';  


// This component provides both login and registration functionality.
// Users can toggle between login and registration modes.
const Login = ({ onLogin }) => {
    // State to store the entered username
    const [username, setUsername] = useState('');

    // State to store the entered password
    const [password, setPassword] = useState('');

    // State to determine whether the user is registering (true) or logging in (false)
    const [isRegistering, setIsRegistering] = useState(false);

    // State to track whether a request is currently being processed
    const [loading, setLoading] = useState(false);

    // Handles form submission for both login and registration.
    // Sends user credentials to the backend and processes the response.
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setLoading(true); 
    
        //const endpoint = isRegistering ? "/auth/register" : "/auth/login";
        const endpoint = isRegistering ? "/register" : "/login"; //Correct
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
    
        // Log the data before sending
        console.log("Submitting data:", { username, password });
    
        try {
            const response = await fetch(`${backendUrl}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
    
            const data = await response.json();
    
            console.log("Server Response:", data); // Log server response
    
            if (!response.ok) {
                throw new Error(data.message || "An error occurred. Please try again.");
            }
    
            if (isRegistering) {
                alert("Registration successful! Please log in.");
                setIsRegistering(false);
                setUsername('');
                setPassword('');
            } else {
                localStorage.setItem("token", data.token);
                setUsername('');
                setPassword('');
                onLogin();
            }
        } catch (error) {
            console.error("Error:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        // Container for the login/registration form, styled using imported styles
        <div style={styles.container}>
            {/* Display appropriate heading based on the current mode */}
            <h2>{isRegistering ? "Sign Up" : "Login"}</h2>

            {/* Form for user login or registration */}
            <form onSubmit={handleSubmit} style={styles.form}>
                {/* Input field for username */}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    // Update username state on change
                    onChange={(e) => setUsername(e.target.value)} 
                    // Make the input field required
                    required 
                    style={styles.input} // Apply styles
                />
                {/* Input field for password */}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    // Update password state on change
                    onChange={(e) => setPassword(e.target.value)} 
                    required // Make the input field required
                    style={styles.input} // Apply styles
                />
                {/* Submit button with dynamic text based on state */}
                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? "Processing..." : isRegistering ? "Sign Up" : "Login"}
                </button>
            </form>

            {/* Toggle button to switch between login and registration modes */}
            <p style={styles.toggleText}>
                {isRegistering ? "Already have an account?" : "Don't have an account?"}
                <button 
                // Toggle registration state
                    onClick={() => setIsRegistering(!isRegistering)} 
                    style={styles.toggleButton}
                >
                    {isRegistering ? "Login here" : "Sign up here"}
                </button>
            </p>
        </div>
    );
};

// Export the Login component so it can be used in other parts of the application
export default Login;