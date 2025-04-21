import React, { useState, useEffect } from "react";
import { FaSearch, FaHeart, FaRegHeart } from "react-icons/fa";
import { getDistanceFromLatLng } from "../utils/distanceUtils";
import { fetchCoordinates } from "../utils/locationUtils";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from 'react-toastify';
import { filterByDate } from "../utils/dateUtils";
import Fuse from "fuse.js";
import "bootstrap/dist/css/bootstrap.min.css";

import AutocompleteInput from "../components/AutocompleteInput";
import Modal from "../components/Modal";
import MapWithMarkers from "../components/MapWithMarkers";
import { filterByAudience } from "../utils/audienceUtils";
import fakeEvents from "../Fakedata/fakeEvents";

const EventSearch = ({ isLoaded }) => {
  const { isAuthenticated } = useAuth0();

  const [coordinates, setCoordinates] = useState({ lat: 38.4404, lng: -122.7141 });
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [category, setCategory] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [distanceFilter, setDistanceFilter] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [activeEvent, setActiveEvent] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
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
  

  const [searchInput, setSearchInput] = useState("");
  const [audienceFilter, setAudienceFilter] = useState("");

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = async (eventId) => {
    if (!isAuthenticated) {
      toast.error("Must be signed in to favorite events");
      return;
    }
  
    const isAlreadyFavorite = favorites.includes(eventId);
  
    try {
      const method = isAlreadyFavorite ? "DELETE" : "POST";
      const response = await fetch(`http://localhost:5001/api/users/favorites`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId }),
      });
  
      if (!response.ok) throw new Error("Failed to update favorites");
  
      // Optimistically update local state
      setFavorites((prev) =>
        isAlreadyFavorite
          ? prev.filter((id) => id !== eventId)
          : [...prev, eventId]
      );
    } catch (error) {
      toast.error("Could not update favorites.");
      console.error(error);
    }
  };
  

  const handleUseMyLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          handleSearch({
            newCoordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        },
        (error) => {
          console.error(error);
          toast.error("Unable to retrieve your location.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = async ({ newCoordinates } = {}) => {
    let filtered = allEvents; // ✅ Use live data
  
    // Title/Location text search:
    if (searchInput) {
      const fuse = new Fuse(allEvents, {
        keys: ["title", "location"],
        threshold: 0.3,
      });
      const results = fuse.search(searchInput);
      filtered = results.map(result => result.item);
    }
  
    // (rest of your filters remain unchanged)
  
    // Category filter
    if (category) {
      filtered = filtered.filter(event => event.category.toLowerCase() === category.toLowerCase());
    }

    // Date filter
    if (dateFilter) {
      filtered = filterByDate(filtered, dateFilter);
    }

    // Distance filter
    const userCoords = newCoordinates || coordinates;
    const maxDistance = distanceFilter ? parseInt(distanceFilter) : null;

    if (locationInput.trim().length) {
      const coords = await fetchCoordinates(locationInput);
      if (coords) {
        userCoords.lat = coords.lat;
        userCoords.lng = coords.lng;
        setCoordinates(coords);
      } else {
        filtered = filtered.filter(event =>
          event.location.toLowerCase().includes(locationInput.toLowerCase())
        );
      }
    }

    if (maxDistance) {
      filtered = filtered.filter((event) => {
        const distance = getDistanceFromLatLng(
          userCoords.lat,
          userCoords.lng,
          event.lat,
          event.lng
        );
        return distance <= maxDistance;
      });
    }

    if (audienceFilter) {
      filtered = filtered.filter((event) => {
        // Make sure your events have something like event.audience = "Everyone" or "18+" or "21+"
        return event.audience === audienceFilter;
      });
      
    }
    filtered = filterByAudience(filtered, audienceFilter);
    setFilteredEvents(filtered);
    setHasSearched(true);
  };

  useEffect(() => {
    // Re-run search if category/date/distance/audience changes
    handleSearch();
  }, [category, dateFilter, distanceFilter, audienceFilter]);

  const eventsToDisplay = showOnlyFavorites
    ? filteredEvents.filter(event => favorites.includes(event.id))
    : filteredEvents;

  if (!isLoaded) return <p>Loading Google Maps...</p>;

  return (
    <div className="container mt-4">
      <div className="row">
        {/* LEFT SIDE */}
        <div className="col-md-8">
          <h1>Upcoming Events</h1>

          {/* SEARCH BAR */}
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
              placeholder="Enter city or zip code..."
              onPlaceSelected={(place) => {
                const coords = {
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                };
                setCoordinates(coords);
                setLocationInput(place.formatted_address);
              }}
              onKeyDown={handleKeyDown}
            />

            <button className="btn btn-danger" onClick={() => handleSearch()}>
              <FaSearch />
            </button>

            <button className="btn btn-secondary ms-2" onClick={handleUseMyLocation}>
              Use My Location
            </button>
          </div>

          {/* FILTERS */}
          <div className="d-flex mb-4 gap-3">
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

            {/* Audience Filter */}
           <select className="form-select" value={audienceFilter} onChange={(e) => setAudienceFilter(e.target.value)}>
              <option value="">Any Audience</option>
              <option value="Everyone">Everyone</option>
              <option value="18+">18+</option>
              <option value="21+">21+</option>
          </select>
          </div>

          {/* Favorites toggle */}
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

          {/* EVENT LIST */}
          <div className="row">
            {eventsToDisplay.map((event) => (
              <div key={event.id} className="col-md-6 mb-4" onClick={() => setActiveEvent(event)}>
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <h5
                        className="card-title"
                        onClick={() => setActiveEvent(event)}
                        style={{ cursor: "pointer" }}
                      >
                        {event.title}
                      </h5>
                      <button
                        className="btn btn-link text-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(event.id);
                        }}
                        title={
                          favorites.includes(event.id)
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                      >
                        {favorites.includes(event.id) ? <FaHeart /> : <FaRegHeart />}
                      </button>
                    </div>
                    <p className="card-text">
                    <strong>When:</strong>{" "}
                    <strong>When:</strong>{" "}
                        {event.start && event.end ? (
                          <>
                            {new Date(event.start).toLocaleDateString()}
                            <br />
                            {new Date(event.start).toLocaleTimeString()} - {new Date(event.end).toLocaleTimeString()}
                          </>
                        ) : (
                          "Old events with old database model, need to delete and re add"
                        )}
                    </p>
                    <p className="card-text">
                      <strong>Location:</strong> {event.location}
                    </p>
                    <p className="card-text">
                      <strong>Audience:</strong> {event.audience || "Everyone"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {eventsToDisplay.length === 0 && <p>No events found.</p>}
          </div>
        </div>

        {/* RIGHT SIDE - Map */}
        <div className="col-md-4">
          <div className="map-wrapper">
          <MapWithMarkers
            center={coordinates}
            events={filteredEvents.filter(event =>
              typeof event.lat === "number" &&
              typeof event.lng === "number" &&
              !isNaN(event.lat) &&
              !isNaN(event.lng)
            )}
            isLoaded={isLoaded}
          />
          </div>
        </div>
      </div>

      <Modal event={activeEvent} onClose={() => setActiveEvent(null)} />
    </div>
  );
};

export default EventSearch;
