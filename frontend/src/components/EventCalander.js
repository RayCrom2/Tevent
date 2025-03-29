import React from 'react';
import{ScheduleXCalendar,useCalendarApp} from "@schedule-x/react";
import {createViewWeek,createViewMonthGrid} from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/calendar.css'

function EventCalander(){
    const calendar = useCalendarApp( {
        views: [
            createViewWeek(),
            createViewMonthGrid()
        ],
        events: [
            {
                id:1,
                title: 'test event',
                start: '2025-03-28',
                end: '2025-03-30'
            }
        ],
        selectedDate: '2025-01-01'
    }) 
    return(
    <>
         <div>
        <ScheduleXCalendar calendarApp={calendar} />
         </div>
     </>
    )
}
export default EventCalander;