// src/components/EventSearch.js
import React, { useState, useEffect } from "react";
import { FaSearch, FaHeart, FaRegHeart } from "react-icons/fa";
import { getDistanceFromLatLng } from "../utils/distanceUtils";
import { fetchCoordinates } from "../utils/locationUtils";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { filterByDate } from "../utils/dateUtils";
import Fuse from "fuse.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/EventSearch.css";

import AutocompleteInput from "./AutocompleteInput";
import Modal from "./Modal";
import MapWithMarkers from "./MapWithMarkers";
import { filterByAudience } from "../utils/audienceUtils";

function formatDisplayDate(isoString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(isoString).toLocaleDateString(undefined, options);
}

function formatToYMD(dateStr) {
  const d = new Date(dateStr);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

const EventSearch = ({ isLoaded }) => {
  const { isAuthenticated, user } = useAuth0();

  // master lists & filter‐side state
  const [allEvents, setAllEvents]         = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchInput, setSearchInput]     = useState("");
  const [dateFilter, setDateFilter]       = useState("");
  const [filterCategory, setFilterCategory] = useState("");   // ← search filter
  const [audienceFilter, setAudienceFilter] = useState("");
  const [distanceFilter, setDistanceFilter] = useState(0);
  const [locationInput, setLocationInput]   = useState("");

  // favorites & active event
  const [favorites, setFavorites]     = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);

  // map center
  const [coordinates, setCoordinates] = useState({ lat: 38.4404, lng: -122.7141 });

  // add‐event form state
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [title, setTitle]               = useState("");
  const [description, setDescription]   = useState("");
  const [start, setStart]               = useState("");
  const [startTime, setStartTime]       = useState("");
  const [end, setEnd]                   = useState("");
  const [endTime, setEndTime]           = useState("");
  const [evtLocation, setEvtLocation]   = useState("");
  const [evtLat, setEvtLat]             = useState("");
  const [evtLng, setEvtLng]             = useState("");
  const [evtAudience, setEvtAudience]   = useState("");
  const [formCategory, setFormCategory] = useState("");     // ← form side

  // fetch on mount
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/events`);
        const data = await res.json();
        const normalized = data.map(e => ({ ...e, id: e._id || e.id }));
        setAllEvents(normalized);
        setFilteredEvents(normalized.filter(e => typeof e.lat === "number" && typeof e.lng === "number"));
      } catch {
        toast.error("Failed to load events");
      }
    })();
  }, []);

  // re-filter anytime any filter‐side value changes
  useEffect(() => {
    let results = allEvents;

    // text search
    if (searchInput) {
      const fuse = new Fuse(allEvents, { keys: ["title","location"], threshold: 0.3 });
      results = fuse.search(searchInput).map(r => r.item);
    }

    // date / category / audience
    if (dateFilter)           results = filterByDate(results, dateFilter);
    if (filterCategory)       results = results.filter(e =>
                                 e.category?.toLowerCase() === filterCategory.toLowerCase());
    if (audienceFilter)       results = filterByAudience(results, audienceFilter);

    // location & distance
    let userCoords = { ...coordinates };
    if (locationInput) {
      fetchCoordinates(locationInput).then(coords => {
        if (coords) {
          userCoords = coords;
          setCoordinates(coords);
        }
      });
    }
    if (distanceFilter > 0) {
      results = results.filter(e =>
        getDistanceFromLatLng(userCoords.lat, userCoords.lng, e.lat, e.lng) <= distanceFilter
      );
    }

    setFilteredEvents(results);
  }, [
    allEvents, searchInput, dateFilter,
    filterCategory, audienceFilter,
    locationInput, distanceFilter, coordinates
  ]);

  // add‐event POST
  const handleAddEvent = async () => {
    if (!title||!start||!end||!evtLocation||!evtLat||!evtLng) {
      return alert("Please fill all required fields");
    }
    const newEvt = {
      title,
      description,
      location: evtLocation,
      audience:   evtAudience,
      category:   formCategory,         // ← use formCategory here
      date:       formatToYMD(start),
      startTime,
      endTime,
      lat:        evtLat,
      lng:        evtLng
    };

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(newEvt)
      });
      if (!res.ok) throw new Error();
      // refresh
      const refreshed = await (await fetch(`${process.env.REACT_APP_BACKEND_URL}api/events`)).json();
      setAllEvents(refreshed.map(e => ({ ...e, id: e._id||e.id })));
      toast.success("Event added!");
      // reset form
      setShowAddEvent(false);
      setTitle(""); setDescription("");
      setStart(""); setStartTime("");
      setEnd(""); setEndTime("");
      setEvtLocation(""); setEvtLat(""); setEvtLng("");
      setEvtAudience(""); setFormCategory("");
    } catch {
      toast.error("Could not save event");
    }
  };

  // favorite, attend, geo… (unchanged)
  const toggleFavorite = async id => {
    if (!isAuthenticated) return toast.error("Log in to favorite");
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}api/events/${id}/favorite`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ userId: user.sub })
        }
      );
      if (!res.ok) throw new Error();
      const { favorited } = await res.json();
      setFavorites(favs =>
        favorited ? [...favs, id] : favs.filter(x => x !== id)
      );
    } catch {
      toast.error("Favorite toggle failed");
    }
  };

  const handleAttendEvent = evt => {
    const my = JSON.parse(localStorage.getItem("myEvents")||"[]");
    if (my.find(e=>e.id===evt.id)) return toast.info("Already joined");
    my.push(evt);
    localStorage.setItem("myEvents", JSON.stringify(my));
    toast.success("Added to your profile");
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return toast.error("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      ({coords}) => setCoordinates({ lat: coords.latitude, lng: coords.longitude }),
      () => toast.error("Could not get your location"),
      { timeout: 10000 }
    );
  };

  if (!isLoaded) return <p>Loading map…</p>;
  const displayList = showOnlyFavorites
    ? filteredEvents.filter(e=>favorites.includes(e.id))
    : filteredEvents;

  return (
    <>
      {/* ─ Add / Cancel Toggle ────────────────────────── */}
      <div className="container mt-4">
        {isAuthenticated && (
          <div className="mb-3">
            {!showAddEvent ? (
              <button className="add-event-btn" onClick={()=>setShowAddEvent(true)}>
                ➕ Add Event
              </button>
            ) : (
              <button className="cancel-event-btn" onClick={()=>setShowAddEvent(false)}>
                ✖ Cancel
              </button>
            )}
          </div>
        )}

        {/* ─ Add-Event Form ───────────────────────────── */}
        {showAddEvent && (
          <div className="event-form-container mb-4">
            <h3>Add New Event</h3>
            <form onSubmit={e=>{ e.preventDefault(); handleAddEvent(); }}>
              <div className="form-group mb-2">
                <input
                  className="form-control"
                  placeholder="Title"
                  value={title}
                  onChange={e=>setTitle(e.target.value)}
                />
              </div>
              <div className="form-group mb-2">
                <AutocompleteInput
                  placeholder="Enter address"
                  onPlaceSelected={place=>{
                    if (!place.geometry) return;
                    setEvtLocation(place.formatted_address);
                    setEvtLat(place.geometry.location.lat());
                    setEvtLng(place.geometry.location.lng());
                  }}
                />
              </div>
              <div className="form-group-row mb-2">
                <input
                  type="date"
                  className="form-control me-1"
                  value={start}
                  onChange={e=>setStart(e.target.value)}
                />
                <input
                  type="time"
                  className="form-control"
                  value={startTime}
                  onChange={e=>setStartTime(e.target.value)}
                />
              </div>
              <div className="form-group-row mb-2">
                <input
                  type="date"
                  className="form-control me-1"
                  value={end}
                  onChange={e=>setEnd(e.target.value)}
                />
                <input
                  type="time"
                  className="form-control"
                  value={endTime}
                  onChange={e=>setEndTime(e.target.value)}
                />
              </div>
              <div className="form-group-row mb-2">
                <select
                  className="form-select me-1"
                  value={evtAudience}
                  onChange={e=>setEvtAudience(e.target.value)}
                >
                  <option value="">Any Audience</option>
                  <option>Everyone</option>
                  <option>18+</option>
                  <option>21+</option>
                </select>
                <select
                  className="form-select"
                  value={formCategory}               // ← use formCategory
                  onChange={e=>setFormCategory(e.target.value)}
                >
                  <option value="">Any Category</option>
                  <option>Music</option>
                  <option>Business</option>
                  <option>Food & Drink</option>
                  <option>Health & Fitness</option>
                </select>
              </div>
              <div className="form-group mb-2">
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Description"
                  value={description}
                  onChange={e=>setDescription(e.target.value)}
                />
              </div>
              <button type="submit" className="add-event-btn">
                Submit Event
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ─ Search, Filters, List & Map ───────────────── */}
      <div className="container mt-4">
        <div className="row">
          {/* LEFT SIDE */}
          <div className="col-md-8">
            <h1>Upcoming Events</h1>
            <div className="d-flex align-items-center mb-3 search-bar-container">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Search events..."
                value={searchInput}
                onChange={e=>setSearchInput(e.target.value)}
              />
              <AutocompleteInput
                value={locationInput}
                onChange={e=>setLocationInput(e.target.value)}
                placeholder="Enter city or zip code..."
                onPlaceSelected={place=>{
                  if (!place.geometry) return;
                  const coords = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                  };
                  setCoordinates(coords);
                  setLocationInput(place.formatted_address);
                }}
              />
              <button className="btn btn-danger ms-2" onClick={()=>{}} aria-label="Search">
                <FaSearch />
              </button>
              <button className="btn btn-secondary ms-2" onClick={handleUseMyLocation}>
                Use My Location
              </button>
            </div>
            <div className="d-flex mb-4 gap-3">
              <select
                className="form-select"
                value={dateFilter}
                onChange={e=>setDateFilter(e.target.value)}
              >
                <option value="">Any Day</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="this week">This Week</option>
                <option value="this weekend">This Weekend</option>
                <option value="next week">Next Week</option>
              </select>
              <select
                className="form-select"
                value={filterCategory}               // ← use filterCategory here
                onChange={e=>setFilterCategory(e.target.value)}
              >
                <option value="">Any Category</option>
                <option>Music</option>
                <option>Business</option>
                <option>Food & Drink</option>
                <option>Health & Fitness</option>
              </select>
              <select
                className="form-select"
                value={audienceFilter}
                onChange={e=>setAudienceFilter(e.target.value)}
              >
                <option value="">Any Audience</option>
                <option>Everyone</option>
                <option>18+</option>
                <option>21+</option>
              </select>
            </div>
            <div className="distance-slider-wrapper mb-4">
              <label htmlFor="distanceSlider" className="form-label">
                Distance: {distanceFilter === 0 ? "Any" : `${distanceFilter} miles`}
              </label>
              <input
                id="distanceSlider"
                type="range"
                className="form-range"
                min="0"
                max="100"
                value={distanceFilter}
                onChange={e=>setDistanceFilter(+e.target.value)}
              />
            </div>
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="favoriteToggle"
                checked={showOnlyFavorites}
                onChange={e=>setShowOnlyFavorites(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="favoriteToggle">
                Show only favorites
              </label>
            </div>
            <div className="row">
              {displayList.map(evt => (
                <div
                  key={evt.id}
                  className="col-md-6 mb-4"
                  onClick={()=>setActiveEvent(evt)}
                >
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <h5 className="card-title">{evt.title}</h5>
                        <button
                          className="btn btn-link text-danger"
                          onClick={e => {
                            e.stopPropagation();
                            toggleFavorite(evt.id);
                          }}
                        >
                          {favorites.includes(evt.id) ? <FaHeart /> : <FaRegHeart />}
                        </button>
                      </div>
                      <p className="card-text"><strong>Date:</strong>{" "}
                        {evt.date ? formatDisplayDate(evt.date) : "N/A"}
                      </p>
                      <p className="card-text"><strong>Location:</strong> {evt.location}</p>
                      <p className="card-text"><strong>Audience:</strong> {evt.audience||"Everyone"}</p>
                      <p className="card-text">{evt.description}</p>
                    </div>
                  </div>
                </div>
              ))}
              {displayList.length===0 && <p>No events found.</p>}
            </div>
          </div>

          {/* RIGHT SIDE – Map */}
          <div className="col-md-4">
            <MapWithMarkers center={coordinates} isLoaded={isLoaded} events={filteredEvents} />
          </div>
        </div>
      </div>

      {/* Attend Modal */}
      <Modal
        event={activeEvent}
        onClose={()=>setActiveEvent(null)}
        onAttend={()=>activeEvent && handleAttendEvent(activeEvent)}
      />
    </>
  );
};

export default EventSearch;
