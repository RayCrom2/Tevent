import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { createViewWeek, createViewMonthGrid } from "@schedule-x/calendar";
import { toast } from 'react-toastify';

import useUserProfile from "../hooks/useUserProfile";

import "@schedule-x/theme-default/dist/calendar.css";


const formatDateTime = (dateStr) => {
  const date = new Date(dateStr);
  date.setHours(9, 0, 0, 0); // Default to 9:00 AM
  return date.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
};

const addOneHour = (dateStr) => {
  const date = new Date(dateStr);
  date.setHours(date.getHours() + 1);
  return date.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
};


function EventCalendar() {
  const { isAuthenticated } = useUserProfile();
  const { getAccessTokenSilently } = useAuth0();
  const [events, setEvents] = useState([]); // ✅ state to store fetched events

  const currentDate = new Date().toISOString().split('T')[0];



  useEffect(() => {
    if (calendar?.events?.set && events.length > 0) {
      console.log("Final formatted events:", events);
      calendar.events.set(events);
    }
  }, [calendar, events]);
  

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: "openid profile email"
          }
        });

        const res = await fetch("http://localhost:5001/api/events", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();

        // ✅ map and store events
        const mapped = data
        .filter(event => event.date || (event.start && event.end)) // skip fully broken ones
        .map(event => {
          console.log("Mapping event:", event);
          
          const isOldFormat = event.date && !event.start;
      
          try {
            if (isOldFormat) {
              const formattedStart = formatDateTime(event.date);
              const formattedEnd = addOneHour(event.date);
      
              return {
                id: event._id,
                title: event.title,
                start: formattedStart,
                end: formattedEnd,
                metadata: {
                  category: event.category || "Uncategorized",
                  location: `Lat: ${event.latitude}, Lng: ${event.longitude}`
                }
              };
            } else {
              return {
                id: event._id,
                title: event.title,
                start: event.start.slice(0, 16),
                end: event.end.slice(0, 16),
                metadata: {
                  description: event.description || "",
                  location: event.location || ""
                }
              };
            }
          } catch (err) {
            console.error("Failed to map event:", event, err);
            return null;
          }
        })
        .filter(Boolean); // remove nulls from failed mappings
      

        setEvents(mapped); // ✅ save to state
      } catch (err) {
        console.error("Error fetching events:", err);
        toast.error("Failed to load events");
      }
    };

    fetchEvents(); // ✅ call it
  }, []);

  const calendar = useCalendarApp({
    views: [createViewWeek(), createViewMonthGrid()],
    events: events, // ✅ use state
    selectedDate: currentDate,
    eventTooltipRenderer: ({ event }) => {
      return `<div style="padding: 6px; max-width: 200px;">
                <strong>${event.title}</strong><br/>
                <span>${event.metadata?.description || 'No description'}</span>
              </div>`;
    }
  });

  // Form state and handlers
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [end, setEnd] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');


  const handleAddEvent = async () => {
    if (!title || !start || !end) {
      toast.error("Please fill in all fields.");
      return;
    }
  
    const newEvent = {
      title,
      start: `${start}T${startTime || "09:00"}`,
      end: `${end}T${endTime || "10:00"}`,
      description,
      location
    };
  
    try {
      const token = await getAccessTokenSilently();
  
      const res = await fetch("http://localhost:5001/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newEvent)
      });
  
      if (!res.ok) throw new Error("Failed to save");
  
      const savedEvent = await res.json();
  
      const formattedNewEvent = {
        id: savedEvent._id || savedEvent.id,
        title: savedEvent.title,
        start: savedEvent.start,
        end: savedEvent.end,
        metadata: {
          description: savedEvent.description || "",
          location: savedEvent.location || ""
        }
      };
  
      setEvents(prev => [...prev, formattedNewEvent]);
      toast.success("Event added!");
      console.log("Event added:", formattedNewEvent);
  
      // Reset form
      setTitle("");
      setStart("");
      setStartTime("09:00");
      setEnd("");
      setEndTime("10:00");
      setDescription("");
      setLocation("");
    } catch (err) {
      toast.error("Failed to create event");
      console.error(err);
    }
  };
  

  useEffect(() => {
    if (!isAuthenticated) {
      toast.info("Log in to add your own Events to the Calendar");
    }
  }, [isAuthenticated]);

  return (
    <div>
      <h1>Events Calendar</h1>

      {isAuthenticated ? (
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
          <div className="form-group">
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button className="add-event-btn" onClick={handleAddEvent}>
            ➕ Add Event
          </button>
        </div>
      ) : (
        <h1></h1>
      )}

      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
}

export default EventCalendar;

