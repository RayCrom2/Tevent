import React, { useState, useEffect, useRef } from 'react';
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { createViewWeek, createViewMonthGrid } from "@schedule-x/calendar";
import { toast } from 'react-toastify';
import AutocompleteInput from "./AutocompleteInput"; 

//mport fakeEvents from '../Fakedata/fakeEvents';
import useUserProfile from "../hooks/useUserProfile";

import "@schedule-x/theme-default/dist/calendar.css";
import { useTheme } from '../context/ThemeContext'; // ✅ adjust path as needed


function EventCalendar({ isLoaded }) {
    const { isAuthenticated } = useUserProfile();
    const { theme } = useTheme(); // will be 'light' or 'dark'
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
    const currentDate = new Date().toLocaleDateString('en-CA');
    const defaultStartTimeF = '09:00';
    const defaultEndTimeF = '17:00';
  
    const formatForScheduleX = (dateStr, timeStr = '09:00') => {
        const datePart = new Date(dateStr).toLocaleDateString('en-CA');
        return `${datePart} ${timeStr}`; 
      };
      
      const formatToYMD = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-CA'); 
      };

    const fetchEvents = async () => {
    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/events`);
        if (!response.ok) throw new Error("Failed to fetch events");

        const data = await response.json();
        console.log("✅ Raw events from backend:", data);
        const formattedEvents = data.map(event => {
            console.log("📅 Formatting event:", event);
            return {
              id: event._id,
              title: event.title,
              start: formatForScheduleX(event.date, event.startTime || defaultStartTimeF),
              end: formatForScheduleX(event.date, event.endTime || defaultEndTimeF),
              metadata: {
                description: event.description
              }
            };
          });

        calendar.events.set(formattedEvents);
    } catch (err) {
        console.error("❌ Error loading or formatting events:", err);
        toast.error("Failed to load calendar events.");
    }
    };
      
      const calendar = useCalendarApp({
        views: [createViewWeek(), createViewMonthGrid()],
        events: events,
        selectedDate: currentDate,
        eventTooltipRenderer: ({ events }) => {
          return `<div style="padding: 6px; max-width: 200px;">
                    <strong>${events.title}</strong><br/>
                    <span>${events.metadata?.description || 'No description'}</span>
                  </div>`;
        }
      });



    // ✅ React to theme changes and set the calendar theme dynamically
  useEffect(() => {
    if (calendar?.setTheme) {
      calendar.setTheme(theme); // 👈 this is the key
      console.log("🌓 ScheduleX theme set to:", theme);
    }
  }, [theme, calendar]);
           

      useEffect(() => {
        if (!calendar?.events?.set) return;
      
        console.log("📅 Fetching events on mount...");
        fetchEvents();
      }, [calendar]);
    
  return (
    <div>
      <h1>Events Calendar</h1>
        <ScheduleXCalendar
        calendarApp={calendar}    

        />
    </div>
  );
}

export default EventCalendar;