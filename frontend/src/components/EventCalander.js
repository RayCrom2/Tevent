// import React from 'react';
// import{ScheduleXCalendar,useCalendarApp} from "@schedule-x/react";
// import {createViewWeek,createViewMonthGrid} from '@schedule-x/calendar'
// import '@schedule-x/theme-default/dist/calendar.css'

// function EventCalander(){
//     const calendar = useCalendarApp( {
//         views: [
//             createViewWeek(),
//             createViewMonthGrid()
//         ],
//         events: [
//             {
//                 id:1,
//                 title: 'Outside Lands',
//                 start: '2025-07-30',
//                 end: '2025-07-30'
//             }
//             {
//                 id:1,
//                 title: 'Monteray Jazz Fesitval',
//                 start: '2025-03-26',
//                 end: '2025-03-26'
//             }
//         ],
//         selectedDate: '2025-01-01'
//     }) 
//     return(
//     <>
//          <div>
//         <ScheduleXCalendar calendarApp={calendar} />
//          </div>
//      </>
//     )
// }
// export default EventCalander;