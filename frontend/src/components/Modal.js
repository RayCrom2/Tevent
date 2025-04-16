// components/Modal.js
import React from "react";

const Modal = ({ event, onClose }) => {
    if (!event) return null;
  
    return (
      <div className="modal" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ backgroundColor: 'white', padding: 20, borderRadius: 5, minWidth: '50%' }}>
          <h2>{event.title}</h2>
          <p><strong>Date:</strong> {event.date}</p>
          <p><strong>Location:</strong> {event.location}</p>
          <p>{event.description}</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };

export default Modal;