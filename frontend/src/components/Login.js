import React, { useState } from 'react';
import NavBar from './NavBar';

const Login = ({ onLogin, onRegister }) => {
    // State variables for username, password, and form toggle
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false); // Toggle between login & signup

    // Function to handle form submission (Login or Register)
    const handleSubmit = (e) => {
        e.preventDefault();
        
        
        if (isRegistering) {
            onRegister(username, password); // Call register function
        } else {
            onLogin(username, password); // Call login function
        }
    };

    return (

        
        <div style={styles.container}>
            <NavBar></NavBar>
            <h2>{isRegistering ? "Sign Up" : "Login"}</h2> {/* Dynamic title based on form mode */}
            
            <form onSubmit={handleSubmit} style={styles.form}>
                {/* Username Input */}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={styles.input}
                />

                {/* Password Input */}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                />

                {/* Submit Button */}
                <button type="submit" style={styles.button}>
                    {isRegistering ? "Sign Up" : "Login"}
                </button>
            </form>

            {/* Toggle between Login & Register */}
            <p style={styles.toggleText}>
                {isRegistering ? "Already have an account?" : "Don't have an account?"} 
                <button onClick={() => setIsRegistering(!isRegistering)} style={styles.toggleButton}>
                    {isRegistering ? "Login here" : "Sign up here"}
                </button>
            </p>
        </div>
    );
};

// Styles for the component
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#d3d3d3' // Gray background
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '300px',
        padding: '20px',
        backgroundColor: '#fff', // White background for the form
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow for modern look
        borderRadius: '8px', // Rounded corners
    },
    input: {
        margin: '10px 0',
        padding: '10px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    button: {
        marginTop: '10px',
        padding: '10px',
        backgroundColor: '#007BFF',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        borderRadius: '4px',
        transition: 'background 0.3s',
    },
    toggleText: {
        marginTop: '10px',
        fontSize: '14px',
    },
    toggleButton: {
        border: 'none',
        background: 'none',
        color: '#007BFF',
        cursor: 'pointer',
        fontSize: '14px',
        textDecoration: 'underline',
        marginLeft: '5px'
    }
};

export default Login;