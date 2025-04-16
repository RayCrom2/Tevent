import React, { useState, useEffect } from "react";
import AutocompleteInput from "../components/AutocompleteInput";
import axios from "axios";
import { FaSearch, FaHeart, FaRegHeart } from "react-icons/fa";
import fakeEvents from "../Fakedata/fakeEvents";
import { getDistanceFromLatLng } from "../utils/distanceUtils";
import { fetchCoordinates } from "../utils/locationUtils";
import { filterEventsByDate } from "../utils/dateUtils";
import Modal from "../components/Modal";
import MapWithMarkers from "../components/MapWithMarkers";
import Fuse from "fuse.js";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from 'react-toastify';
import "bootstrap/dist/css/bootstrap.min.css";
import { filterByDate } from "../utils/dateUtils";



const EventSearch = ({ isLoaded, searchQuery, locationQuery }) => {
  const { isAuthenticated } = useAuth0();
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
  const [favorites, setFavorites] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [mapTriggeredByLocationSearch, setMapTriggeredByLocationSearch] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);


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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };


  const handleSearch = async () => {
    let filtered = fakeEvents;

    if (searchInput) {
      const fuse = new Fuse(fakeEvents, {
        keys: ["title", "location"],
        threshold: 0.3,
      });
      const results = fuse.search(searchInput);
      filtered = results.map(result => result.item);
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

    if (locationInput) {
      const coords = await fetchCoordinates(locationInput);
      if (coords) {
        setCoordinates(coords);
  
        // Filter by distance (default to 100 if not selected)
        const maxDistance = distanceFilter ? parseInt(distanceFilter) : 100;
  
        filtered = filtered.filter(event => {
          const distance = getDistanceFromLatLng(coords.lat, coords.lng, event.lat, event.lng);
          return distance <= maxDistance;
        });
      } else {
        // fallback if geocode fails: text match
        filtered = filtered.filter(event =>
          event.location.toLowerCase().includes(locationInput.toLowerCase())
        );
      }
    }

    setFilteredEvents(filtered);
    // Show map only when there's a location input (i.e. location search happened)
    setMapTriggeredByLocationSearch(!!locationInput.trim());
    setHasSearched(true);
  };

  useEffect(() => {
    handleSearch();
  }, [category, dateFilter, distanceFilter]);

  // This is the list to show, depending on the favorites toggle
  const eventsToDisplay = showOnlyFavorites
    ? filteredEvents.filter(event => favorites.includes(event.id))
    : filteredEvents;

    if (!isLoaded) return <p>Loading Google Maps...</p>;


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
              onKeyDown={handleKeyDown}
            />
            <AutocompleteInput
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Enter city or location..."
              onPlaceSelected={(place) => {
                const coords = {
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                };
                setCoordinates(coords);
                setLocationInput(place.formatted_address);
                //handleSearch();
              }}
              onKeyDown={handleKeyDown}
            />
            <button className="btn btn-danger" onClick={handleSearch}>
              <FaSearch />
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
          {eventsToDisplay.map((event) => ( <div key={event.id} className="col-md-6 mb-4" onClick={() => setActiveEvent(event)}>
                <div className="card shadow-sm">
                  <div className="card-body">
                  {/* <h5 className="card-title">{event.title}</h5> */}
                    <div className="d-flex justify-content-between align-items-start">
                      <h5 className="card-title" onClick={() => setActiveEvent(event)} style={{ cursor: "pointer" }}>
                        {event.title}
                      </h5>
                      <button
                       className="btn btn-link text-danger"
                        onClick={(e) => {
                        e.stopPropagation(); //prevents the click from bubbling up
                       toggleFavorite(event.id);
                     }}
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
        {mapTriggeredByLocationSearch && (
         <div className="map-wrapper">
          <MapWithMarkers center={coordinates} events={filteredEvents} isLoaded={isLoaded} />
          </div>
        )}
        </div>
      </div>

      <Modal event={activeEvent} onClose={() => setActiveEvent(null)} />
    </div>
  );
};

export default EventSearch;
 