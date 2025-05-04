// import React, { useState, useEffect, useRef } from 'react';
// import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
// import { createViewWeek, createViewMonthGrid } from "@schedule-x/calendar";
// import { toast } from 'react-toastify';
// import AutocompleteInput from "./AutocompleteInput"; 

// //mport fakeEvents from '../Fakedata/fakeEvents';
// import useUserProfile from "../hooks/useUserProfile";

// import "@schedule-x/theme-default/dist/calendar.css";

// function EventCalendar({ isLoaded }) {
//     const { isAuthenticated } = useUserProfile();
//     const [lat, setLat] = useState('');
//     const [lng, setLng] = useState('');
//     const [filterAudience, setFilterAudience] = useState('');
//     const [filterCategory, setFilterCategory] = useState('');
//     const [events, setEvents] = useState([]);
//     const currentDate = new Date().toLocaleDateString('en-CA');
//     const defaultStartTimeF = '09:00';
//     const defaultEndTimeF = '17:00';
  
//     const formatForScheduleX = (dateStr, timeStr = '09:00') => {
//         const datePart = new Date(dateStr).toLocaleDateString('en-CA');
//         return `${datePart} ${timeStr}`; 
//       };
      
//       const formatToYMD = (dateStr) => {
//         return new Date(dateStr).toLocaleDateString('en-CA'); 
//       };

//     const fetchEvents = async () => {
//     try {
//         const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/events`);
//         if (!response.ok) throw new Error("Failed to fetch events");

//         const data = await response.json();
//         console.log("✅ Raw events from backend:", data);

//         const filtered = data.filter(event => {
//           return (
//             (!filterAudience || event.audience === filterAudience) &&
//             (!filterCategory || event.category === filterCategory)
//           );
//         });

//         const formattedEvents = filtered.map(event => {
//             console.log("📅 Formatting event:", event);
//             return {
//               id: event._id,
//               title: event.title,
//               start: formatForScheduleX(event.date, event.startTime || defaultStartTimeF),
//               end: formatForScheduleX(event.date, event.endTime || defaultEndTimeF),
//               metadata: {
//                 description: event.description
//               }
//             };
//           });

//         calendar.events.set(formattedEvents);
//     } catch (err) {
//         console.error("❌ Error loading or formatting events:", err);
//         toast.error("Failed to load calendar events.");
//     }
//     };
      
//       const calendar = useCalendarApp({
//         views: [createViewWeek(), createViewMonthGrid()],
//         events: events,
//         selectedDate: currentDate,
//         eventTooltipRenderer: ({ events }) => {
//           return `<div style="padding: 6px; max-width: 200px;">
//                     <strong>${events.title}</strong><br/>
//                     <span>${events.metadata?.description || 'No description'}</span>
//                   </div>`;
//         }
//       });
           

//       useEffect(() => {
//         if (!calendar?.events?.set) return;
      
//         console.log("📅 Fetching events on mount...");
//         fetchEvents();
//       }, [calendar, filterAudience, filterCategory]);
      






//   // const handleAddEvent = async () => {
//   //   if (!title || !start || !end || !location || !lat || !lng) {
//   //     return alert("Please fill out all required fields including location.");
//   //   }
  
//   //   const newEvent = {
//   //     title,
//   //     description,
//   //     location,
//   //     audience,
//   //     category,
//   //     lat,
//   //     lng,
//   //     date: formatToYMD(start),
//   //     startTime,
//   //     endTime,
//   //   };
  

//   //   try {
//   //       const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/events`, {
//   //       method: "POST",
//   //         headers: { "Content-Type": "application/json" },
//   //         body: JSON.stringify(newEvent)
//   //       });
  
//   //     if (!response.ok) throw new Error("Failed to save event");
  
//   //     const savedEvent = await response.json();
  
//   //     // Add the event to the calendar view
//   //     await fetchEvents(); // refresh the entire calendar
  
//   //     toast.success("Event successfully added!");
  
//   //     // Reset form
//   //     setTitle('');
//   //     setStart('');
//   //     setEnd('');
//   //     setStartTime('');
//   //     setEndTime('');
//   //     setLocation('');
//   //     setLat('');
//   //     setLng('');
//   //     setAudience('');
//   //     setCategory('');
//   //     setDescription('');
//   //     setShowAddEvent(false);
//   //   } catch (error) {
//   //     console.error("Error saving event:", error);
//   //     toast.error("Failed to save event. Try again.");
//   //   }
//   // };
  

//   // const handleButtonClick = () => {
//   //   setShowAddEvent(true);
//   // };



  
//     return (
//       <div>
//         <h1>Events Calendar</h1>
    
//         {isAuthenticated && (
//           <button className="add-event-btn" onClick={handleButtonClick}>➕ Add Event</button>
//         )}
    
//         {/* 🔍 Filter controls - moved outside the Add Event form */}
//         <div className="filters-container">
//           <select value={filterAudience} onChange={(e) => setFilterAudience(e.target.value)}>
//             <option value="">All Audiences</option>
//             <option value="Everyone">Everyone</option>
//             <option value="18+">18+</option>
//             <option value="21+">21+</option>
//           </select>
    
//           <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
//             <option value="">All Categories</option>
//             <option value="Music">Music</option>
//             <option value="Business">Business</option>
//             <option value="Food & Drink">Food & Drink</option>
//             <option value="Health & Fitness">Health & Fitness</option>
//           </select>
    
//           <button onClick={fetchEvents}>🔍 Apply Filters</button>
//         </div>
    
// <div className="filters-container">
//   <select value={filterAudience} onChange={(e) => setFilterAudience(e.target.value)}>
//     <option value="">All Audiences</option>
//     <option value="Everyone">Everyone</option>
//     <option value="18+">18+</option>
//     <option value="21+">21+</option>
//   </select>

//   <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
//     <option value="">All Categories</option>
//     <option value="Music">Music</option>
//     <option value="Business">Business</option>
//     <option value="Food & Drink">Food & Drink</option>
//     <option value="Health & Fitness">Health & Fitness</option>
//   </select>

//   <button onClick={fetchEvents}>🔍 Apply Filters</button>
// </div>


//           <div className="form-group-row">
//             <input
//               type="date"
//               value={start}
//               onChange={(e) => setStart(e.target.value)}
//             />
//             <input
//               type="time"
//               value={startTime}
//               onChange={(e) => setStartTime(e.target.value)}
//             />
//           </div>
//           <div className="form-group-row">
//             <select
//               className="form-select"
//               value={audience}
//               onChange={(e) => setAudience(e.target.value)}
//             >
//               <option value="">Any Audience</option>
//               <option value="Everyone">Everyone</option>
//               <option value="18+">18+</option>
//               <option value="21+">21+</option>
//             </select>
//           </div>

//         <div className="form-group-row">
//         <select
//               className="form-select"
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//             >
//               <option value="">Any Category</option>
//               <option value="Music">Music</option>
//               <option value="Business">Business</option>
//               <option value="Food & Drink">Food & Drink</option>
//               <option value="Health & Fitness">Health & Fitness</option>
//               <option value="N/A">N/A</option>
//             </select>
//           </div>

//         </div>
//       )}


//         <ScheduleXCalendar
//         calendarApp={calendar}    

//         />
//   );
// }

// export default EventCalendar;



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
