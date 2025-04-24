import React, { useState, useEffect, useRef } from 'react';
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { createViewWeek, createViewMonthGrid } from "@schedule-x/calendar";
import { toast } from 'react-toastify';
import AutocompleteInput from "./AutocompleteInput"; 

import fakeEvents from '../Fakedata/fakeEvents';
import useUserProfile from "../hooks/useUserProfile";

import "@schedule-x/theme-default/dist/calendar.css";

function EventCalendar({ isLoaded }) {
    const { isAuthenticated } = useUserProfile();
    const [showAddEvent, setShowAddEvent] = useState(false);
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [audience, setAudience] = useState('');
    const [category, setCategory] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [title, setTitle] = useState('');
    const [start, setStart] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [end, setEnd] = useState('');
    const [events, setEvents] = useState([]);
    const currentDate = new Date().toISOString().split('T')[0];

    const defaultStartTimeF = '09:00';
    const defaultEndTimeF = '17:00';

    const formatDate = (date) => {
        // Handles both strings and Date objects safely
        return new Date(date).toISOString().split("T")[0];
      };
      
      const calendarEvents = events.map(event => ({
        id: event._id,
        title: event.title,
        start: `${formatDate(event.date)}T${event.startTime || "09:00"}:00`,
        end: `${formatDate(event.date)}T${event.endTime || "17:00"}:00`,
        metadata: {
          description: event.description
        }
      }));
    console.log("📆 Formatted calendarEvents for ScheduleX:", calendarEvents);

    const calendar = useCalendarApp({
        views: [createViewWeek(), createViewMonthGrid()],
        selectedDate: currentDate,
        eventTooltipRenderer: ({ event }) => {
          return `<div style="padding: 6px; max-width: 200px;">
                    <strong>${event.title}</strong><br/>
                    <span>${event.metadata?.description || 'No description'}</span>
                  </div>`;
        }
      });
      
  
    const calendarRef = useRef(null);
    const [calendarInitialized, setCalendarInitialized] = useState(false);      
    useEffect(() => {
        const fetchEvents = async () => {
          try {
            console.log("🌐 Fetching events from:", `${process.env.REACT_APP_BACKEND_URL}/api/events`);
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/events`);
            if (!response.ok) throw new Error("Failed to fetch events");
      
            const data = await response.json();
            console.log("✅ Raw events from backend:", data);
            setEvents(data);
      
            const formattedEvents = data.map(event => ({
              id: event._id,
              title: event.title,
              start: `${formatDate(event.date)}T${event.startTime || "09:00"}:00`,
              end: `${formatDate(event.date)}T${event.endTime || "17:00"}:00`,
              metadata: {
                description: event.description
              }
            }));
      
            console.log("📆 Setting formatted events:", formattedEvents);
            calendar.events.set(formattedEvents); // ✅ THIS MAKES IT WORK
      
          } catch (err) {
            console.error("Error loading events:", err);
            toast.error("Failed to load calendar events.");
          }
        };
      
        fetchEvents();
      }, [calendar]);
      

  
  const handleButtonClick = () => {
    setShowAddEvent(true);
  };

  const handleAddEvent = async () => {
    if (!title || !start || !end || !location || !lat || !lng) {
      return alert("Please fill out all required fields including location.");
    }
  
    const newEvent = {
      title,
      description,
      location,
      audience,
      category,
      lat,
      lng,
      date: start, // base date field used in your model
      startTime,
      endTime,
    };
  
    console.log("Submitting new event:", newEvent); // ✅ Add this


    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/events`, {
        method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEvent)
        });
  
      if (!response.ok) throw new Error("Failed to save event");
  
      const savedEvent = await response.json();
  
      // Add the event to the calendar view
      calendar.events.add({
        id: savedEvent._id, // from MongoDB
        title: savedEvent.title,
        start: `${savedEvent.date}T${savedEvent.startTime || '09:00'}`,
        end: `${savedEvent.date}T${savedEvent.endTime || '17:00'}`,
        metadata: {
          description: savedEvent.description
        }
      });
  
      toast.success("Event successfully added!");
  
      // Reset form
      setTitle('');
      setStart('');
      setEnd('');
      setStartTime('');
      setEndTime('');
      setLocation('');
      setLat('');
      setLng('');
      setAudience('');
      setCategory('');
      setDescription('');
      setShowAddEvent(false);
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Failed to save event. Try again.");
    }
  };
  

  return (
    <div>
      <h1>Events Calendar</h1>

      {isAuthenticated && (
        <button className="add-event-btn" onClick={handleButtonClick}>➕ Add Event</button>
      )}

      {showAddEvent && (
        <div className="event-form-container">
          <h3>Add New Event</h3>

          <div className="form-group">
            <input
              type="text"
              placeholder="Event Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

            <AutocompleteInput
            className="form-group"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter address"
            onPlaceSelected={(place) => {
                if (!place.geometry) return;

                setLocation(place.formatted_address);
                setLat(place.geometry.location.lat());
                setLng(place.geometry.location.lng());
            }}
            />

          <div className="form-group-row">
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <div className="form-group-row">
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>

          <div className="form-group-row">
            <input
              type="text"
              placeholder="Audience (e.g. 18+)"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            />
            <input
              type="text"
              placeholder="Category (e.g. Music)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="form-group">
            <textarea
              className="event-description-input"
              placeholder="Event Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="button-row">
            <button className="add-event-btn" onClick={handleAddEvent}> Submit Event</button>
            <button className="cancel-event-btn" onClick={() => setShowAddEvent(false)}>Cancel</button>
          </div>
        </div>
      )}

      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
}

export default EventCalendar;
