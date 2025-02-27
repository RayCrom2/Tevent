import React from 'react';
import { useNavigate } from 'react-router-dom';

const Menu = ({ onLogout }) => {
    const navigate = useNavigate(); // Hook to navigate between pages

    return (
        <div>
            <h1>Welcome to the Event App</h1>
            <nav>
                <ul>
                    <li><button onClick={() => navigate("/")}>Home</button></li>
                    <li><button onClick={() => navigate("/profile")}>Profile</button></li>
                    <li><button onClick={() => navigate("/events")}>Events</button></li>
                    <li><button onClick={onLogout}>Logout</button></li>
                </ul>
            </nav>
        </div>
    );
};

export default Menu;