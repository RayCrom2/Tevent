import React from 'react';
import Layout from '../components/Layout';
import UserLocationMap from '../components/UserLocationMap';

const Profile = () => {
    return (
        <div>
            <Layout>
            <h1>Profile Page</h1>
            <p>Welcome to your profile!</p>
            <UserLocationMap />
            </Layout>
        </div>
    );
};

export default Profile;