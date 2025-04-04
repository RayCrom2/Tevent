// src/hooks/useUserProfile.js
// Custom hook to fetch user profile data from Auth0 or fallback to mocked profile

import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";

const useUserProfile = () => {
  // Get username from route params and user info from Auth0
  const { username } = useParams();
  const { user, isAuthenticated } = useAuth0();

  // Local state to manage the profile data and loading indicator
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If user isn't authenticated or user data is not available, stop loading
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }

    // Simulate a fetched user profile (to be replaced by a real DB fetch later)
    const mockProfile = {
      username: username || user.nickname || "guest",
      name: user.name || "Anonymous User",
      email: user.email || "no-email@provided.com",
      profilePic: user.picture || "/default-avatar.png",
      bannerPic:
        "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80",
      bio: "Hi! I'm a software developer passionate about building beautiful apps with React, Node.js, and MongoDB.",
      contact: user.email || "contact@tevent.dev",
    };

    // Update the profile data and stop loading
    setProfileData(mockProfile);
    setLoading(false);
  }, [username, user, isAuthenticated]);

  // Expose profile data, loading state, and auth status
  return { profileData, loading, isAuthenticated };
};

export default useUserProfile;