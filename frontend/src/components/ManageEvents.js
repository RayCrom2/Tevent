import React, { useEffect, useState } from "react";
import "../styles/UserProfile.css";

const getStoredEvents = () => {
  const stored = localStorage.getItem("myEvents");
  return stored ? JSON.parse(stored) : [];
};

const categorizeEvents = (events) => {
  const now = new Date();

  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

    return {
      //past: events.filter((e) => new Date(e.date) < now && !isSameDay(new Date(e.date), now)),
      past: events.filter((e) => { const date = new Date(e.date);
        return date < now && !isSameDay(date, now);
      }),
      present: events.filter((e) => isSameDay(new Date(e.date), now)),
      future: events.filter((e) => new Date(e.date) > now),
    };
};

const ManageEvents = () => {
  const [categorized, setCategorized] = useState({
    past: [],
    present: [],
    future: [],
  });

  //Load once when component mounts
  useEffect(() => {
    const allEvents = getStoredEvents();
    setCategorized(categorizeEvents(allEvents));
  }, []);

  //Re-check every 60 seconds so today's events become past
  useEffect(() => {
    const interval = setInterval(() => {
      const allEvents = getStoredEvents();
      setCategorized(categorizeEvents(allEvents));
    }, 60 * 1000); // every 60 seconds

    return () => clearInterval(interval);
  }, []);

  //Allow users to remove events
  const handleRemoveEvent = (id) => {
    const allEvents = getStoredEvents();
    const updatedEvents = allEvents.filter((e) => e.id !== id);
    localStorage.setItem("myEvents", JSON.stringify(updatedEvents));
    setCategorized(categorizeEvents(updatedEvents));
  };

  const renderEventCard = (event) => {
    const now = new Date();
    const eventDate = new Date(event.date);

    const isSameDay =
      eventDate.getFullYear() === now.getFullYear() &&
      eventDate.getMonth() === now.getMonth() &&
      eventDate.getDate() === now.getDate();

    const isPast = eventDate < now && !isSameDay;

    return (
      <div key={event.id} className="profile-card" style={{ marginBottom: "1rem" }}>
        <h4>{event.title}</h4>
        <p>{eventDate.toLocaleString()}</p>
        <p>{event.location}</p>
        <button
          onClick={() => handleRemoveEvent(event.id)}
          className="btn btn-sm btn-danger mt-2"
        >
          Remove
        </button>
        {event.attending && (
          <button className="btn btn-sm btn-success mt-2 ms-2" disabled>
            {isPast ? "Attended" : "Attending"}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <h3>Upcoming Events</h3>
        {categorized.future.length
          ? categorized.future.map(renderEventCard)
          : <p>No upcoming events yet.</p>}
      </div>

      <div className="profile-card">
        <h3>Today's Events</h3>
        {categorized.present.length
          ? categorized.present.map(renderEventCard)
          : <p>No events today.</p>}
      </div>

      <div className="profile-card">
        <h3>Past Events</h3>
        {categorized.past.length
          ? categorized.past.map(renderEventCard)
          : <p>No past events yet.</p>}
      </div>
    </div>
  );
};

export default ManageEvents;