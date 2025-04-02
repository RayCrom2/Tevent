// src/components/UserProfile.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import UserLocationMap from "./UserLocationMap";
import "../styles/UserProfile.css";

const UserProfile = () => {
  const { username } = useParams();
  const { user, isAuthenticated } = useAuth0();

  if (!isAuthenticated || !user) {
    return <p className="auth-warning">Please log in to view your profile.</p>;
  }

  return (
    <div className="linkedin-profile-wrapper">
      {/* Banner */}
      <div className="linkedin-banner">
        <div className="linkedin-avatar-wrapper">
          <img
            className="linkedin-avatar"
            src={user.picture || "/default-avatar.png"}
            alt={`Avatar of ${user.name}`}
          />
        </div>
      </div>

      {/* Profile Card */}
      <div className="linkedin-card">
        <h2>{user.name}</h2>
        <p className="linkedin-username">@{username}</p>
        <p className="linkedin-email">📧 {user.email}</p>
      </div>

      {/* Location Map */}
      <div className="location-section">
        <h3>Live Location Tracking</h3>
        <UserLocationMap />
      </div>
    </div>
  );
};

export default UserProfile;