// components/Modal.js
import React from "react";

const Modal = ({ event, onClose }) => {
  if (!event) return null;

  // Format date to YYYY-MM-DD
  function formatDate(iso) {
    return new Date(iso).toISOString().slice(0, 10);
  }

  function formatTime(timeStr) {
    if (!timeStr) return "N/A";
    const [hour, minute] = timeStr.split(':');
    const date = new Date();
    date.setHours(Number(hour));
    date.setMinutes(Number(minute));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  

  return (
    <div
      className="modal"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          maxWidth: '600px',
          width: '90%',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        }}
      >
        <h2 className="mb-3">{event.title}</h2>
        <p><strong>Date:</strong> {formatDate(event.date)}</p>
        <p><strong>Time:</strong> {formatTime(event.startTime)} – {formatTime(event.endTime)}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Audience:</strong> {event.audience || 'Everyone'}</p>
        <p><strong>Description:</strong> {event.description}</p>

        <div className="text-end mt-4">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
