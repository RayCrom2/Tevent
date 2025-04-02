// import React, { useState } from "react";
// import { useParams } from "react-router-dom";
// import { useAuth0 } from "@auth0/auth0-react";
// import UserLocationMap from "./UserLocationMap";
// import "../styles/UserProfile.css";

// const UserProfile = () => {
//   const { username } = useParams();
//   const { user, isAuthenticated } = useAuth0();

//   const [profilePic, setProfilePic] = useState(user?.picture || "/default-avatar.png");
//   const [bannerPic, setBannerPic] = useState("https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80");
//   const [showModal, setShowModal] = useState(false);

//   const handleProfilePicChange = (e) => {
//     const file = e.target.files[0];
//     if (file) setProfilePic(URL.createObjectURL(file));
//     setShowModal(false);
//   };

//   const handleBannerPicChange = (e) => {
//     const file = e.target.files[0];
//     if (file) setBannerPic(URL.createObjectURL(file));
//   };

//   const handleAvatarClick = () => {
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//   };

//   if (!isAuthenticated || !user) {
//     return <p className="auth-warning">Please log in to view your profile.</p>;
//   }

//   return (
//     <div className="linkedin-profile-wrapper">
//       {/* Banner */}
//       <div
//         className="linkedin-banner"
//         style={{ backgroundImage: `url(${bannerPic})` }}
//       >
//         <label className="upload-banner-label">
//           📸 Change background
//           <input type="file" accept="image/*" onChange={handleBannerPicChange} hidden />
//         </label>

//         {/* Avatar */}
//         <div className="linkedin-avatar-wrapper" onClick={handleAvatarClick}>
//           <img
//             className="linkedin-avatar"
//             src={profilePic}
//             alt={`Avatar of ${user.name}`}
//           />
//         </div>
//       </div>

//       {/* Profile Card */}
//       <div className="linkedin-card">
//         <h2>{user.name}</h2>
//         <p className="linkedin-username">@{username}</p>
//         {/*<p className="linkedin-email">📧 {user.email}</p>*/}
//       </div>

//       {/* Location Map */}
//       <div className="location-section">
//         <h3>Live Location Tracking</h3>
//         <UserLocationMap />
//       </div>

//       {/* Profile Image Modal */}
//       {showModal && (
//         <div className="profile-modal-backdrop" onClick={closeModal}>
//           <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
//             <h3>Profile Photo</h3>
//             <img className="modal-avatar" src={profilePic} alt="Current avatar" />

//             <div className="profile-modal-actions">
//               <label className="modal-button">
//                 📸 Add Photo
//                 <input type="file" accept="image/*" onChange={handleProfilePicChange} hidden />
//               </label>
//               <button className="modal-button">✨ Frames</button>
//               <button className="modal-button">✏️ Edit</button>
//               <button
//                 className="modal-button delete"
//                 onClick={() => {
//                   setProfilePic("/default-avatar.png");
//                   setShowModal(false);
//                 }}
//               >
//                 🗑️ Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserProfile;


// Import necessary React hooks and modules
import React, { useState } from "react";
import { useParams } from "react-router-dom"; // Used to extract dynamic route params (e.g., /profile/:username)
import { useAuth0 } from "@auth0/auth0-react"; // Provides authentication context via Auth0
import UserLocationMap from "./UserLocationMap"; // Custom component to show user location
import "../styles/UserProfile.css"; // Import associated CSS styles

// Define the UserProfile functional component
const UserProfile = () => {
  // Extract username from the URL (/profile/:username)
  const { username } = useParams();

  // Destructure user info and auth state from Auth0
  const { user, isAuthenticated } = useAuth0();

  // State to manage the displayed profile picture (defaults to user's Auth0 picture or a default image)
  const [profilePic, setProfilePic] = useState(user?.picture || "/default-avatar.png");

  // State to manage the banner background image
  const [bannerPic, setBannerPic] = useState(
    "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80"
  );

  // State to toggle the visibility of the profile picture options modal
  const [showModal, setShowModal] = useState(false);

  // When user selects a new profile picture
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a temporary URL for the selected image and set it as the new profile picture
      setProfilePic(URL.createObjectURL(file));
    }
    // Close the modal after uploading
    setShowModal(false);
  };

  // When user selects a new background/banner image
  const handleBannerPicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Set the background to the selected image
      setBannerPic(URL.createObjectURL(file));
    }
  };

  // Open the modal when the avatar is clicked
  const handleAvatarClick = () => {
    setShowModal(true);
  };

  // Close the modal when clicking outside it
  const closeModal = () => {
    setShowModal(false);
  };

  // If the user is not authenticated, show a warning message
  if (!isAuthenticated || !user) {
    return <p className="auth-warning">Please log in to view your profile.</p>;
  }

  // JSX to render the user profile page
  return (
    <div className="linkedin-profile-wrapper">
      {/* Top banner section with upload button */}
      <div
        className="linkedin-banner"
        style={{ backgroundImage: `url(${bannerPic})` }}
      >
        {/* Upload new background image */}
        <label className="upload-banner-label">
          📸 Change background
          <input type="file" accept="image/*" onChange={handleBannerPicChange} hidden />
        </label>

        {/* Avatar (clickable to open modal) */}
        <div className="linkedin-avatar-wrapper" onClick={handleAvatarClick}>
          <img
            className="linkedin-avatar"
            src={profilePic}
            alt={`Avatar of ${user.name}`}
          />
        </div>
      </div>

      {/* User info card */}
      <div className="linkedin-card">
        <h2>{user.name}</h2>
        <p className="linkedin-username">@{username}</p>
        {/* Optional email field (commented out) */}
        {/*<p className="linkedin-email">📧 {user.email}</p>*/}
      </div>

      {/* Live location tracking using a custom map component */}
      <div className="location-section">
        <h3>Live Location Tracking</h3>
        <UserLocationMap />
      </div>

      {/* Modal that appears when clicking on the avatar */}
      {showModal && (
        <div className="profile-modal-backdrop" onClick={closeModal}>
          {/* Prevent modal from closing when clicking inside the modal */}
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Profile Photo</h3>
            {/* Display the current profile picture inside the modal */}
            <img className="modal-avatar" src={profilePic} alt="Current avatar" />

            {/* Modal buttons for profile photo actions */}
            <div className="profile-modal-actions">
              {/* Upload a new photo */}
              <label className="modal-button">
                📸 Add Photo
                <input type="file" accept="image/*" onChange={handleProfilePicChange} hidden />
              </label>

              {/* Placeholder for future features (Frames and Edit) */}
              <button className="modal-button">✨ Frames</button>
              <button className="modal-button">✏️ Edit</button>

              {/* Delete photo and reset to default */}
              <button
                className="modal-button delete"
                onClick={() => {
                  setProfilePic("/default-avatar.png");
                  setShowModal(false);
                }}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;