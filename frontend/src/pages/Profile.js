import React from 'react';
import Layout from '../components/Layout';
import UserLocationMap from '../components/UserLocationMap';

const Profile = () => {
    return (
        <div>

            <h1>Profile Page</h1>
            <p>Welcome to your profile!</p>
            <UserLocationMap />

        </div>
    );
};

export default Profile;