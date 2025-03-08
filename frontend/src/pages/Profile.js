// import React from 'react';

// const Profile = () => {
//     return (
//         <div>
//             <h1>Profile Page</h1>
//             <p>Welcome to your profile!</p>
//         </div>
//     );
// };

// export default Profile;
import React, { useState } from 'react';
import '../App.css'
const Profile = () => {
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  // Handle profile picture change
  const handlePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // You can add functionality to save bio and interests, for example, sending to an API.
    alert('Profile Updated!');
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile</h1>
        <form id="profile-form" onSubmit={handleSubmit}>
          <label htmlFor="bio">Bio:</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell users about yourself!"
          />
          
          <label htmlFor="interests">Interests:</label>
          <input
            type="text"
            id="interests"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="Add your interests, e.g., coding, hiking, etc."
          />
          
          <label htmlFor="profile-picture">Profile Picture:</label>
          <input
            type="file"
            id="profile-picture"
            accept="image/*"
            onChange={handlePictureChange}
          />
          
          <button type="submit">Update Profile</button>
        </form>
      </div>

      <div className="profile-display">
        <img
          id="display-picture"
          src={profilePicture || 'default-avatar.jpg'}
          alt="Profile"
        />
        <p id="bio-display">{bio || "Your bio will appear here..."}</p>
        <p id="interests-display">{interests || "Your interests will appear here..."}</p>
      </div>
    </div>
  );
};

export default Profile;
