import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import useUserProfile from "../hooks/useUserProfile";
import UserLocationMap from "../components/UserLocationMap";
import "../styles/UserProfile.css";
import { Link } from "react-router-dom";

// UserProfile component displays and allows editing of user info like avatar, banner, name, username, bio, and contact info.
const UserProfile = () => {
  const { profileData, loading, isAuthenticated } = useUserProfile();

  // State variables to manage editable user information
  const [profilePic, setProfilePic] = useState("");
  const [bannerPic, setBannerPic] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editableName, setEditableName] = useState("");
  const [editableUsername, setEditableUsername] = useState("");
  const [bio, setBio] = useState("");
  const [contact, setContact] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [photoGallery, setPhotoGallery] = useState([]);

  // Load saved data from localStorage or fallback to profileData
  useEffect(() => {
    if (profileData) {
      const savedBanner = localStorage.getItem("bannerPic");
      const savedProfile = localStorage.getItem("profilePic");
      const savedBio = localStorage.getItem("bio");
      const savedContact = localStorage.getItem("contact");
      const savedName = localStorage.getItem("name");
      const savedUsername = localStorage.getItem("username");

      setBannerPic(savedBanner || profileData.bannerPic);
      setProfilePic(savedProfile || profileData.profilePic);
      setBio(savedBio || profileData.bio);
      setContact(savedContact || profileData.contact);
      setEditableName(savedName || profileData.name);
      setEditableUsername(savedUsername || profileData.username);
    }
  }, [profileData]);

  // Handle when user selects a new profile picture
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newPic = URL.createObjectURL(file);
      setProfilePic(newPic);
      localStorage.setItem("profilePic", newPic);
    }
    setShowModal(false);
  };

  // Handle when user selects a new banner image
  const handleBannerPicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newBanner = URL.createObjectURL(file);
      setBannerPic(newBanner);
      localStorage.setItem("bannerPic", newBanner);
    }
  };

  // Open profile picture modal
  const handleAvatarClick = () => setShowModal(true);

  // Close profile picture modal
  const closeModal = () => setShowModal(false);

  // Save edited bio, contact, name, and username to localStorage
  const handleSave = () => {
    localStorage.setItem("bio", bio);
    localStorage.setItem("contact", contact);
    localStorage.setItem("name", editableName);
    localStorage.setItem("username", editableUsername);
    setIsEditing(false);
  };

  // Guard clause: Don't show profile if user isn't logged in
  if (!isAuthenticated || !profileData) {
    return <p className="auth-warning">Please log in to view your profile.</p>;
  }

  // Loading state
  if (loading) return <p>Loading profile...</p>;

  return (
    <>
      {/* Banner section with avatar */}
      <Container fluid className="p-0 m-0">
        <div
          className="profile-banner"
          style={{ backgroundImage: `url(${bannerPic})` }}
        >
          <label className="upload-banner-label">
            📸 Change background
            <input type="file" accept="image/*" onChange={handleBannerPicChange} hidden />
          </label>
          <div className="profile-avatar-wrapper" onClick={handleAvatarClick}>
            <img className="profile-avatar" src={profilePic} alt={`Avatar of ${editableName}`} />
          </div>
        </div>
      </Container>

      {/* Profile Info Section */}
      <Container className="profile-wrapper">
        <div className="profile-card">
          {/* Editable name and username */}
          {isEditing ? (
            <>
              <input
                type="text"
                value={editableName}
                onChange={(e) => setEditableName(e.target.value)}
                className="form-control my-2"
                placeholder="Your full name"
              />
              <input
                type="text"
                value={editableUsername}
                onChange={(e) => setEditableUsername(e.target.value)}
                className="form-control my-2"
                placeholder="Your username"
              />
            </>
          ) : (
            <>
              <h2>{editableName}</h2>
              <p className="profile-username">@{editableUsername}</p>
            </>
          )}

          {/* Editable bio and contact info */}
          {isEditing ? (
            <>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="form-control my-2"
                placeholder="Enter your bio"
              />
              <input
                type="email"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="form-control my-2"
                placeholder="Contact email"
              />
              <button onClick={handleSave} className="modal-button my-2">💾 Save</button>
            </>
          ) : (
            <>
              <p>{bio}</p>
              <a href={`mailto:${contact}`}><span role="img" aria-label="mail">📧</span> {contact}</a>
              <br />
              <button onClick={() => setIsEditing(true)} className="modal-button my-2">✏️ Edit Profile Biography</button>
            </>
          )}
        </div>

        {/* Added New Manage Events Card */}
          <div className="profile-card">
          <h3> Manage My Events</h3>
          <p>View and edit the events you’re hosting or attending.</p>
          <Link to="/manage-events" className="modal-button">
            Go to Event Manager
          </Link>
        </div>
      </Container>

      {/* Avatar Modal with photo tools */}
      {showModal && (
        <div className="profile-modal-backdrop" onClick={closeModal}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Profile Photo</h3>
            <img className="modal-avatar" src={profilePic} alt="Current avatar" />
            <div className="profile-modal-actions">
              <label className="modal-button">
                📸 Add Photo
                <input type="file" accept="image/*" onChange={handleProfilePicChange} hidden />
              </label>
              <button className="modal-button">✨ Frames</button>
              <button className="modal-button">✏️ Edit</button>
              <button
                className="modal-button delete"
                onClick={() => {
                  setProfilePic("/default-avatar.png");
                  localStorage.removeItem("profilePic");
                  setShowModal(false);
                }}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <Container className="photo-gallery mt-5">
  <h3 className="mb-3">My Photo Gallery</h3>

  {/* Upload Button */}
  <label className="modal-button mb-3">
    ➕ Add Photo
    <input
      type="file"
      accept="image/*"
      hidden
      onChange={(e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (reader.result) {
              setPhotoGallery((prev) => [...prev, reader.result]);
            }
          };
          reader.readAsDataURL(file);
        }
      }}
    />
  </label>

  {/* Grid */}
  <div className="photo-grid">
    {photoGallery.map((photo, index) => (
      <div key={index} className="photo-grid-item">
        <img
          src={photo}
          alt={`Uploaded ${index}`}
          style={{ width: "100%", height: "auto", borderRadius: "8px" }}
        />
      </div>
    ))}
  </div>
</Container>

    </>
    
    
  );
};

export default UserProfile;