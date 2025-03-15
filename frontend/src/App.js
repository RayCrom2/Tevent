import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // import Bootstrap CSS
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Events from './pages/Events';
import About from './pages/About';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token); // Converts token existence to boolean
    }, []);

    const handleLogin = () => {
        localStorage.setItem("token", "dummyToken"); // Ensure token is stored
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Login onLogin={handleLogin} />} />
                {/* <Route path="/menu" element={isAuthenticated ? <Menu onLogout={handleLogout} /> : <Navigate to="/" />} /> */}
                <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/" />} />
                <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/profile" />} />
                <Route path="/events" element={isAuthenticated ? <Events /> : <Navigate to="/events" />} />
                <Route path="/about" element={isAuthenticated ? <About /> : <Navigate to="/about" />} />
            </Routes>
        </Router>
    );
};

export default App;