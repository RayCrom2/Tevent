import React from 'react';
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { createViewWeek, createViewMonthGrid } from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/calendar.css";

function EventCalendar() {
    const currentDate = new Date().toISOString().split('T')[0];
    
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
            <ScheduleXCalendar calendarApp={calendar} />
        </div>
    );
}

export default EventCalendar;

