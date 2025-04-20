import React, { useState, useEffect } from "react";
import { FaSearch, FaHeart, FaRegHeart } from "react-icons/fa";
import fakeEvents from "../Fakedata/fakeEvents";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from 'react-toastify';
import "bootstrap/dist/css/bootstrap.min.css";



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
  const { isAuthenticated } = useAuth0();
  const [coordinates, setCoordinates] = useState({ lat: 38.4404, lng: -122.7141 });
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [category, setCategory] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [distanceFilter, setDistanceFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [activeEvent, setActiveEvent] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [allEvents, setAllEvents] = useState([]);

  //Fecthes Events from the Database 
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/events");
        const data = await response.json();
        setAllEvents(data);
        setFilteredEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };
    fetchEvents();
  }, []);
  


  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (eventId) => {
    if (!isAuthenticated){
      toast.error("Must be signed in to favorite events");
    }
    else{
    setFavorites((prev) =>
      prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
    );
  }
  };

  const filterByDate = (events, filter) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    switch (filter) {
      case "today":
        return events.filter(event => new Date(event.date).toDateString() === today.toDateString());
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

  const handleSearch = () => {
    let filtered = allEvents;

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
  };

  useEffect(() => {
    handleSearch();
  }, [category, dateFilter, distanceFilter]);

  // This is the list to show, depending on the favorites toggle
  const eventsToDisplay = showOnlyFavorites
    ? filteredEvents.filter(event => favorites.includes(event.id))
    : filteredEvents;

  return (
    <div className="container mt-4">
      <div className="row">
        {/* LEFT SIDE - Filters & Events */}
        <div className="col-md-8">
          <h1>Upcoming Events</h1>

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

          {/* Favorites Filter */}
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="favoriteToggle"
              checked={showOnlyFavorites}
              onChange={(e) => setShowOnlyFavorites(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="favoriteToggle">
              Show only favorites
            </label>
          </div>

          {/* Event List */}
          <div className="row">
            {eventsToDisplay.map((event) => (
              <div key={event.id} className="col-md-6 mb-4">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <h5 className="card-title" onClick={() => setActiveEvent(event)} style={{ cursor: "pointer" }}>
                        {event.title}
                      </h5>
                      <button
                        className="btn btn-link text-danger"
                        onClick={() => toggleFavorite(event.id)}
                        title={favorites.includes(event.id) ? "Remove from favorites" : "Add to favorites"}
                      >
                        {favorites.includes(event.id) ? <FaHeart /> : <FaRegHeart />}
                      </button>
                    </div>
                    <p className="card-text"><strong>Date:</strong> {event.date}</p>
                    <p className="card-text"><strong>Location:</strong> {event.location}</p>
                    <p className="card-text">{event.description}</p>
                  </div>
                </div>
              </div>
            ))}
            {eventsToDisplay.length === 0 && <p>No events found.</p>}
          </div>
        </div>

        {/* RIGHT SIDE - Google Map */}
        <div className="col-md-4">
          {/* Google Map Placeholder */}
        </div>
      </div>

      <Modal event={activeEvent} onClose={() => setActiveEvent(null)} />
    </div>
  );
};

export default EventSearch;
 