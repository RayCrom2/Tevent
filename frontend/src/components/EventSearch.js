import React, { useState, useEffect } from "react";
// import GoogleMapReact from "google-map-react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import fakeEvents from "../Fakedata/fakeEvents";

// const EventMarker = ({ lat, lng, text }) => (
//   <div style={{ color: "red", fontWeight: "bold", fontSize: "12px" }}>
//     🔴 {text}
//   </div>
// );

// const LocationMarker = ({ lat, lng }) => (
//   <div style={{ color: "blue", fontWeight: "bold", fontSize: "12px" }}>
//     📍
//   </div>
// );

const Modal = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div className="modal" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ backgroundColor: 'white', padding: 20, borderRadius: 5, minWidth: '50%' }}>
        <h2>{event.title}</h2>
        <p><strong>Date:</strong> {event.date}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p>{event.description}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const EventSearch = () => {
  const [coordinates, setCoordinates] = useState({ lat: 38.4404, lng: -122.7141 });
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [category, setCategory] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [distanceFilter, setDistanceFilter] = useState("");
  const [locationMarker, setLocationMarker] = useState(null);
  const [eventMarkers, setEventMarkers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [activeEvent, setActiveEvent] = useState(null);

  //   const fetchCoordinates = async (location) => {
  //   try {
  //     const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
  //       params: { address: location, key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY },
  //     });
  //     if (response.data.results.length > 0) {
  //       return response.data.results[0].geometry.location;
  //     }
  //   } catch (error) {
  //     console.error("Error fetching coordinates:", error);
  //   }
  //   return null;
  // };

  const filterByDate = (events, filter) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

// Extract the year, month, and day
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed, add 1 to match the conventional month number
    const day = today.getDate().toString().padStart(2, '0');

// Format the date in 'YYYY-MM-DD' format
    const formattedDate = `${year}-${month}-${day}`;
    console.log(formattedDate);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    // console.log(today);

    switch (filter) {
      case "today":
        console.log('Today: ',today.toDateString());
        return events.filter(event => console.log('new Date: ', new Date(event.date).toDateString()))// === today.toDateString());
      case "tomorrow":
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return events.filter(event => new Date(event.date).toDateString() === tomorrow.toDateString());
      case "this week":
        return events.filter(event => new Date(event.date) >= startOfWeek && new Date(event.date) <= endOfWeek);
      case "this weekend":
        const weekendStart = new Date(startOfWeek);
        weekendStart.setDate(startOfWeek.getDate() + 5);
        const weekendEnd = new Date(startOfWeek);
        weekendEnd.setDate(startOfWeek.getDate() + 6);
        return events.filter(event => new Date(event.date) >= weekendStart && new Date(event.date) <= weekendEnd);
      case "next week":
        const nextWeekStart = new Date(startOfWeek);
        nextWeekStart.setDate(startOfWeek.getDate() + 7);
        const nextWeekEnd = new Date(nextWeekStart);
        nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
        return events.filter(event => new Date(event.date) >= nextWeekStart && new Date(event.date) <= nextWeekEnd);
      default:
        return events;
    }
  };

const handleSearch = async () => {
  let filtered = fakeEvents;

  if (searchInput) {
    filtered = filtered.filter(event =>
      event.title.toLowerCase().includes(searchInput.toLowerCase())
    );
  }

  if (category) {
    filtered = filtered.filter(event => event.category.toLowerCase() === category.toLowerCase());
  }

  if (dateFilter) {
    filtered = filterByDate(filtered, dateFilter);
  }

  if (distanceFilter) {
    filtered = filtered.filter(event => event.distance <= parseInt(distanceFilter));
  }

  setFilteredEvents(filtered);
  // setEventMarkers(filtered.map(event => ({ lat: event.lat, lng: event.lng, title: event.title })));

  if (filtered.length > 0) {
    setCoordinates({ lat: filtered[0].lat, lng: filtered[0].lng });
    setLocationMarker(null);
  } else if (locationInput) {
    const coords = await fetchCoordinates(locationInput);
    if (coords) {
      setCoordinates(coords);
      setLocationMarker(coords);
      setEventMarkers([]);
    }
  } else {
    setCoordinates({ lat: 38.4404, lng: -122.7141 });
    setLocationMarker(null);
    setEventMarkers([]);
  }
};

  useEffect(() => {
    handleSearch(); // Automatically filter when filters change
  }, [category, dateFilter, distanceFilter]);

  return (
    <div className="container mt-4">
       <div className="row">
         {/* LEFT SIDE - Filters & Events */}
         <div className="col-md-8">
           <h2>Upcoming Events</h2>

           {/* Search Bar */}
           <div className="d-flex align-items-center mb-3 search-bar-container">
             <input
              type="text"
              className="form-control me-2"
              placeholder="Search events..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <input
              type="text"
              className="form-control me-2"
              placeholder="Enter city or location..."
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
            />
            <button
              className="btn btn-danger"
              style={{ height: "35px", padding: "6px 10px", fontSize: "14px" }}
              onClick={handleSearch}
            >
              <FaSearch style={{ fontSize: "12px" }} />
            </button>
          </div>

          {/* Filters */}
          <div className="d-flex mb-3 gap-3">
            <select className="form-select" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
              <option value="">Any Day</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="this week">This Week</option>
              <option value="this weekend">This Weekend</option>
              <option value="next week">Next Week</option>
            </select>

            <select className="form-select" value={distanceFilter} onChange={(e) => setDistanceFilter(e.target.value)}>
              <option value="">Any Distance</option>
              <option value="2">2 miles</option>
              <option value="5">5 miles</option>
              <option value="10">10 miles</option>
              <option value="25">25 miles</option>
              <option value="50">50 miles</option>
              <option value="100">100 miles</option>
            </select>

            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Any Category</option>
              <option value="Music">Music</option>
              <option value="Business">Business</option>
              <option value="Food & Drink">Food & Drink</option>
              <option value="Health & Fitness">Health & Fitness</option>
            </select>
          </div>

          {/* Event List */}
          <div className="row">
            {filteredEvents.map((event) => (
              <div key={event.id} className="col-md-6 mb-4" onClick={() => setActiveEvent(event)}>
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{event.title}</h5>
                    <p className="card-text"><strong>Date:</strong> {event.date}</p>
                    <p className="card-text"><strong>Location:</strong> {event.location}</p>
                    <p className="card-text">{event.description}</p>
                  </div>
                </div>
              </div>
            ))}
            {filteredEvents.length === 0 && <p>No events found.</p>}
          </div>
        </div>
        {/* RIGHT SIDE - Google Map */}
        <div className="col-md-4">
          {/* Google Map component */}
        </div>
      </div>
      <Modal event={activeEvent} onClose={() => setActiveEvent(null)} />
    </div>
  );
};

export default EventSearch;

// import React, { useState, useEffect } from "react";
// import GoogleMapReact from "google-map-react";
// import axios from "axios";
// import { FaSearch } from "react-icons/fa";
// import "bootstrap/dist/css/bootstrap.min.css";
// import fakeEvents from "../Fakedata/fakeEvents";

// const EventMarker = ({ lat, lng, text }) => (
//   <div style={{ color: "red", fontWeight: "bold", fontSize: "12px" }}>
//     🔴 {text}
//   </div>
// );

// const LocationMarker = ({ lat, lng }) => (
//   <div style={{ color: "blue", fontWeight: "bold", fontSize: "12px" }}>
//     📍
//   </div>
// );

// const EventSearch = () => {
//   const [coordinates, setCoordinates] = useState({ lat: 38.4404, lng: -122.7141 });
//   const [filteredEvents, setFilteredEvents] = useState([]);
//   const [category, setCategory] = useState("");
//   const [dateFilter, setDateFilter] = useState("");
//   const [distanceFilter, setDistanceFilter] = useState("");
//   const [locationMarker, setLocationMarker] = useState(null);
//   const [eventMarkers, setEventMarkers] = useState([]);
//   const [searchInput, setSearchInput] = useState("");
//   const [locationInput, setLocationInput] = useState("");
//   const [activeEvent, setActiveEvent] = useState(null);

//   const fetchCoordinates = async (location) => {
//     try {
//       const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
//         params: { address: location, key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY },
//       });
//       if (response.data.results.length > 0) {
//         return response.data.results[0].geometry.location;
//       }
//     } catch (error) {
//       console.error("Error fetching coordinates:", error);
//     }
//     return null;
//   };

//   const filterByDate = (events, filter) => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const startOfWeek = new Date(today);
//     startOfWeek.setDate(today.getDate() - today.getDay());
//     const endOfWeek = new Date(startOfWeek);
//     endOfWeek.setDate(startOfWeek.getDate() + 6);

//     switch (filter) {
//       case "today":
//         return events.filter(event => new Date(event.date).toDateString() === today.toDateString());
//       case "tomorrow":
//         const tomorrow = new Date(today);
//         tomorrow.setDate(today.getDate() + 1);
//         return events.filter(event => new Date(event.date).toDateString() === tomorrow.toDateString());
//       case "this week":
//         return events.filter(event => new Date(event.date) >= startOfWeek && new Date(event.date) <= endOfWeek);
//       case "this weekend":
//         const weekendStart = new Date(startOfWeek);
//         weekendStart.setDate(startOfWeek.getDate() + 5);
//         const weekendEnd = new Date(startOfWeek);
//         weekendEnd.setDate(startOfWeek.getDate() + 6);
//         return events.filter(event => new Date(event.date) >= weekendStart && new Date(event.date) <= weekendEnd);
//       case "next week":
//         const nextWeekStart = new Date(startOfWeek);
//         nextWeekStart.setDate(startOfWeek.getDate() + 7);
//         const nextWeekEnd = new Date(nextWeekStart);
//         nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
//         return events.filter(event => new Date(event.date) >= nextWeekStart && new Date(event.date) <= nextWeekEnd);
//       default:
//         return events;
//     }
//   };

//   const handleSearch = async () => {
//     let filtered = fakeEvents;

//     if (searchInput) {
//       filtered = filtered.filter(event =>
//         event.title.toLowerCase().includes(searchInput.toLowerCase())
//       );
//     }

//     if (category) {
//       filtered = filtered.filter(event => event.category.toLowerCase() === category.toLowerCase());
//     }

//     if (dateFilter) {
//       filtered = filterByDate(filtered, dateFilter);
//     }

//     if (distanceFilter) {
//       filtered = filtered.filter(event => event.distance <= parseInt(distanceFilter));
//     }

//     setFilteredEvents(filtered);
//     setEventMarkers(filtered.map(event => ({ lat: event.lat, lng: event.lng, title: event.title })));

//     if (filtered.length > 0) {
//       setCoordinates({ lat: filtered[0].lat, lng: filtered[0].lng });
//       setLocationMarker(null);
//     } else if (locationInput) {
//       const coords = await fetchCoordinates(locationInput);
//       if (coords) {
//         setCoordinates(coords);
//         setLocationMarker(coords);
//         setEventMarkers([]);
//       }
//     } else {
//       setCoordinates({ lat: 38.4404, lng: -122.7141 });
//       setLocationMarker(null);
//       setEventMarkers([]);
//     }
//   };

//   useEffect(() => {
//     handleSearch(); // Automatically filter when filters change
//   }, [category, dateFilter, distanceFilter]);

//   return (
//     <div className="container mt-4">
//       <div className="row">
//         {/* LEFT SIDE - Filters & Events */}
//         <div className="col-md-8">
//           <h2>Upcoming Events</h2>

//           {/* Search Bar */}
//           <div className="d-flex align-items-center mb-3 search-bar-container">
//             <input
//               type="text"
//               className="form-control me-2"
//               placeholder="Search events..."
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//             />
//             <input
//               type="text"
//               className="form-control me-2"
//               placeholder="Enter city or location..."
//               value={locationInput}
//               onChange={(e) => setLocationInput(e.target.value)}
//             />
//             <button
//               className="btn btn-danger"
//               style={{ height: "35px", padding: "6px 10px", fontSize: "14px" }}
//               onClick={handleSearch}
//             >
//               <FaSearch style={{ fontSize: "12px" }} />
//             </button>
//           </div>

//           {/* Filters */}
//           <div className="d-flex mb-3 gap-3">
//             <select className="form-select" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
//               <option value="">Any Day</option>
//               <option value="today">Today</option>
//               <option value="tomorrow">Tomorrow</option>
//               <option value="this week">This Week</option>
//               <option value="this weekend">This Weekend</option>
//               <option value="next week">Next Week</option>
//             </select>

//             <select className="form-select" value={distanceFilter} onChange={(e) => setDistanceFilter(e.target.value)}>
//               <option value="">Any Distance</option>
//               <option value="2">2 miles</option>
//               <option value="5">5 miles</option>
//               <option value="10">10 miles</option>
//               <option value="25">25 miles</option>
//               <option value="50">50 miles</option>
//               <option value="100">100 miles</option>
//             </select>

//             <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
//               <option value="">Any Category</option>
//               <option value="Music">Music</option>
//               <option value="Business">Business</option>
//               <option value="Food & Drink">Food & Drink</option>
//               <option value="Health & Fitness">Health & Fitness</option>
//             </select>
//           </div>

//           {/* Event List */}
//           <div className="row">
//             {filteredEvents.map((event) => (
//               <div key={event.id} className="col-md-6 mb-4" onClick={() => setActiveEvent(event)}>
//                 <div className="card shadow-sm">
//                   <div className="card-body">
//                     <h5 className="card-title">{event.title}</h5>
//                     <p className="card-text"><strong>Date:</strong> {event.date}</p>
//                     <p className="card-text"><strong>Location:</strong> {event.location}</p>
//                     <p className="card-text">{event.description}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//             {filteredEvents.length === 0 && <p>No events found.</p>}
//           </div>
//         </div>

//         {/* RIGHT SIDE - Google Map */}
//         <div className="col-md-4">
//           <div style={{ position: "sticky", top: "80px", height: "500px" }}>
//             <GoogleMapReact
//               bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
//               center={coordinates}
//               defaultZoom={12}
//             >
//               {eventMarkers.map((event, index) => (
//                 <EventMarker key={index} lat={event.lat} lng={event.lng} text={event.title} />
//               ))}
//               {locationMarker && <LocationMarker lat={locationMarker.lat} lng={locationMarker.lng} />}
//             </GoogleMapReact>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };




// export default EventSearch;