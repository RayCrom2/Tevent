// components/Modal.jsx
import React from "react";
import { toast } from "react-toastify";

// helper to format ISO→YYYY-MM-DD
function formatDate(iso) {
  if (!iso) return "N/A";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

// helper to format “HH:MM” → human time
function formatTimeHM(timeStr) {
  if (!timeStr) return "N/A";
  const [h, m] = timeStr.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m);
  return d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function Modal({ event, onClose, onAttend }) {
  if (!event) return null;

  const {
    title,
    date,
    startTime,
    endTime,
    location,
    audience = "Everyone",
    category = "N/A",
    description = "No description provided.",
  } = event;

  const handleAttend = () => {
    if (!event.id) {
      toast.error("Cannot attend an event without an ID.");
      return;
    }
    onAttend(event);
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex", justifyContent: "center", alignItems: "center",
        zIndex: 1000
      }}
    >
      <div
        className="modal-content"
        style={{
          background: "var(--bs-body-bg)",
          color: "var(--bs-body-color)",
          padding: "2rem",
          borderRadius: "8px",
          maxWidth: "600px",
          width: "90%",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "transparent",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: "inherit"
          }}
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="mb-3">{title}</h2>

        <p><strong>Date:</strong> {formatDate(date)}</p>
        <p>
          <strong>Time:</strong>{" "}
          {formatTimeHM(startTime)} – {formatTimeHM(endTime)}
        </p>
        <p><strong>Location:</strong> {location || "N/A"}</p>
        <p><strong>Audience:</strong> {audience}</p>
        <p><strong>Category:</strong> {category}</p>

        <hr />

        <p>{description}</p>

        <div
          className="d-flex justify-content-end mt-4"
          style={{ gap: "0.5rem" }}
        >
          <button
            className="btn btn-primary"
            onClick={handleAttend}
          >
            Attend
          </button>
          <button
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
