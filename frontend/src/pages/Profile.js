import React from 'react';
import Layout from '../components/Layout';
import UserLocationMap from '../components/UserLocationMap';
import UserProfile from '../components/UserProfile'; //Add this import


const Profile = () => {
    return (
        <div>
            <h1>Profile Page</h1>
            <p>Welcome to your profile!</p>
            <UserProfile />
            <UserLocationMap />
        </div>
    );
};

export default Profile;