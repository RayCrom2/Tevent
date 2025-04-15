import React, { useState, useEffect } from 'react';
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { createViewWeek, createViewMonthGrid } from "@schedule-x/calendar";
import { toast } from 'react-toastify';

import fakeEvents from '../Fakedata/fakeEvents';
import useUserProfile from "../hooks/useUserProfile";

import "@schedule-x/theme-default/dist/calendar.css";

function EventCalendar() {
    const { isAuthenticated } = useUserProfile();

    const currentDate = new Date().toISOString().split('T')[0];
    const defaultStartTimeF = '09:00';  // Default to 9 AM if empty
    const defaultEndTimeF = '10:00'; 
    const calendarEvents = fakeEvents.map(event => ({
        
        id: event.id,
        title: event.title,
        start: `${event.date} ${defaultStartTimeF}`,
        end: `${event.date} ${defaultEndTimeF}`,
        metadata:{
        description: event.description}
      }));

    // Initial events
    const [events, setEvents] = useState([
        {
            id: 1,
            title: "test event",
            start: "2025-03-28 02:00",
            end: "2025-03-30 16:00"
        }
    ]);

    const calendar = useCalendarApp({

        views: [
            createViewWeek(),
            createViewMonthGrid()
        ],
        events: [
            {

                id: 1,
                title: "test event",
                start: "2025-03-28",
                end: "2025-03-30"
            }
        ],
        selectedDate: currentDate
    });

    return (
        <div>
            <h1>Events Calendar</h1>
            
            {isAuthenticated ?(
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
             <button className="add-event-btn" onClick={handleAddEvent}>➕ Add Event</button>
         </div>):(
<h1></h1>
            )}

            <ScheduleXCalendar calendarApp={calendar} />
        </div>
    );
}

export default EventCalendar;
