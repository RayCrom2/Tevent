// src/pages/ManageEvents.jsx
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "../styles/UserProfile.css";

const getStoredEvents = () => {
  const stored = localStorage.getItem("myEvents");
  return stored ? JSON.parse(stored) : [];
};

const categorizeEvents = (events) => {
  const now = new Date();
  return {
    past: events.filter((e) => new Date(e.date) < now),
    present: events.filter((e) => {
      const eventDate = new Date(e.date);
      return (
        eventDate.toDateString() === now.toDateString()
      );
    }),
    future: events.filter((e) => new Date(e.date) > now),
  };
};

const ManageEvents = () => {
  const [categorized, setCategorized] = useState({ past: [], present: [], future: [] });

  useEffect(() => {
    const allEvents = getStoredEvents();
    setCategorized(categorizeEvents(allEvents));
  }, []);

  const renderEventCard = (event) => (
    <div key={event.id} className="profile-card" style={{ marginBottom: "1rem" }}>
      <h4>{event.title}</h4>
      <p>{new Date(event.date).toLocaleString()}</p>
      <p>{event.location}</p>
    </div>
  );

  return (
    <div className="profile-wrapper">
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>My Event Manager</h2>

      <div className="profile-card">
        <h3>Upcoming Events</h3>
        {categorized.future.length ? categorized.future.map(renderEventCard) : <p>No upcoming events yet we are still working on this.</p>}
      </div>

      <div className="profile-card">
        <h3>Today's Events</h3>
        {categorized.present.length ? categorized.present.map(renderEventCard) : <p>No events today yet we are still working on this.</p>}
      </div>

      <div className="profile-card">
        <h3>Past Events</h3>
        {categorized.past.length ? categorized.past.map(renderEventCard) : <p>No past events yet we are still working on this.</p>}
      </div>
    </div>
  );
};

export default ManageEvents;