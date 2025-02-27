

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Menu from './components/Menu';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Events from './pages/Events';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (username, password) => {
        const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
        const user = storedUsers.find(user => user.username === username && user.password === password);

        if (user) {
            localStorage.setItem("token", "authenticated");
            setIsAuthenticated(true);
        } else {
            alert("Invalid username or password! Please register first.");
        }
    };

    const handleRegister = (username, password) => {
        const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

        if (existingUsers.some(user => user.username === username)) {
            alert("Username already exists!");
            return;
        }

        const newUsers = [...existingUsers, { username, password }];
        localStorage.setItem("users", JSON.stringify(newUsers));

        alert("Registration successful! Please log in.");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={!isAuthenticated ? <Login onLogin={handleLogin} onRegister={handleRegister} /> : <Navigate to="/menu" />} />
                <Route path="/menu" element={isAuthenticated ? <Menu onLogout={handleLogout} /> : <Navigate to="/" />} />
                <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/" />} />
                <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/" />} />
                <Route path="/events" element={isAuthenticated ? <Events /> : <Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;