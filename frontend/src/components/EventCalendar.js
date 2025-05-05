import React, { useState, useEffect } from 'react';
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { createViewWeek, createViewMonthGrid } from "@schedule-x/calendar";
import { toast } from 'react-toastify';
import useUserProfile from "../hooks/useUserProfile";
import "@schedule-x/theme-default/dist/calendar.css";

function EventCalendar({ isLoaded }) {
    const { isAuthenticated } = useUserProfile();
    const [filterAudience, setFilterAudience] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [events, setEvents] = useState([]);

    const currentDate = new Date().toLocaleDateString('en-CA');
    const defaultStartTimeF = '09:00';
    const defaultEndTimeF = '17:00';

    const formatForScheduleX = (dateStr, timeStr = '09:00') => {
        const datePart = new Date(dateStr).toLocaleDateString('en-CA');
        return `${datePart} ${timeStr}`; 
    };

      // ✅ React to theme changes and set the calendar theme dynamically
  useEffect(() => {
    if (calendar?.setTheme) {
      calendar.setTheme(theme); // 👈 this is the key
      console.log("🌓 ScheduleX theme set to:", theme);
    }
  }, [theme, calendar]);
  

    const fetchEvents = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/events`);
            if (!response.ok) throw new Error("Failed to fetch events");

            const data = await response.json();
            console.log("✅ Raw events from backend:", data);

            const filtered = data.filter(event => {
                return (
                    (!filterAudience || event.audience === filterAudience) &&
                    (!filterCategory || event.category === filterCategory)
                );
            });

            const formattedEvents = filtered.map(event => {
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
          
            setEvents(formattedEvents); // Update the state with formatted events
        } catch (err) {
            console.error("❌ Error loading or formatting events:", err);
            toast.error("Failed to load calendar events.");
        }
    };
    useEffect(() => {
      console.log("📅 Fetching events on mount...");
      fetchEvents();
  }, [filterAudience, filterCategory]); // Refetch when filters change


    const calendar = useCalendarApp({
        views: [createViewWeek(), createViewMonthGrid()],
        events: events,  // Use events state
        selectedDate: currentDate,
        eventTooltipRenderer: ({ events }) => {
            return `<div style="padding: 6px; max-width: 200px;">
                        <strong>${events.title}</strong><br/>
                        <span>${events.metadata?.description || 'No description'}</span>
                    </div>`;
        }
    });
    return (
        <div>
            <h1>Events Calendar</h1>
      
            <div className="filters-container">
                <select value={filterAudience} onChange={(e) => setFilterAudience(e.target.value)}>
                    <option value="">All Audiences</option>
                    <option value="Everyone">Everyone</option>
                    <option value="18+">18+</option>
                    <option value="21+">21+</option>
                </select>
        
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    <option value="Music">Music</option>
                    <option value="Business">Business</option>
                    <option value="Food & Drink">Food & Drink</option>
                    <option value="Health & Fitness">Health & Fitness</option>
                </select>

                
            </div>
            <ScheduleXCalendar
                calendarApp={calendar}    
            />
        </div>
    );
}

export default EventCalendar;
