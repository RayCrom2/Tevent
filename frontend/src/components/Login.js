
import React, { useState } from 'react';
import { registerUser, loginUser } from '../services/authService';  //Updated import
import styles from '../styles/authStyles';  // Updated import

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isRegistering) {
                await registerUser(username, password);
                alert("Registration successful! Please log in.");
                setIsRegistering(false);
            } else {
                const data = await loginUser(username, password);
                localStorage.setItem("token", data.token);
                onLogin();
            }

            setUsername('');
            setPassword('');
        } catch (error) {
            console.error("Error:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2>{isRegistering ? "Sign Up" : "Login"}</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                />
                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? "Processing..." : isRegistering ? "Sign Up" : "Login"}
                </button>
            </form>
            <p style={styles.toggleText}>
                {isRegistering ? "Already have an account?" : "Don't have an account?"}
                <button onClick={() => setIsRegistering(!isRegistering)} style={styles.toggleButton}>
                    {isRegistering ? "Login here" : "Sign up here"}
                </button>
            </p>
        </div>
    );
};

export default Login;