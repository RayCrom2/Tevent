import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScriptNext, Marker, Circle } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const circleOptions = {
  strokeColor: "#FF0000", // Red outline
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#FF0000", // Light red fill
  fillOpacity: 0.3,
  radius: 1000, // Radius in meters (1 km)
};

const UserLocationMap = () => {
  const [location, setLocation] = useState({ lat: null, lng: null, error: null });
  const mapRef = useRef(null); // Reference for Google Map
  const watchIdRef = useRef(null); // Store geolocation watcher ID

  useEffect(() => {
    // Load saved location from sessionStorage
    const savedLocation = sessionStorage.getItem("userLocation");
    if (savedLocation) {
      setLocation(JSON.parse(savedLocation));
    }

    if ("geolocation" in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            error: null,
          };

          setLocation(newLocation);
          sessionStorage.setItem("userLocation", JSON.stringify(newLocation)); // ✅ Save location

          if (mapRef.current) {
            mapRef.current.panTo(newLocation);
          }
        },
        (error) => {
          setLocation({ error: error.message });
        },
        { enableHighAccuracy: true, maximumAge: 1000 }
      );
    } else {
      setLocation({ error: "Geolocation is not supported by this browser." });
    }

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Function to recenter the map
  const recenterMap = () => {
    if (mapRef.current && location.lat && location.lng) {
      mapRef.current.panTo({ lat: location.lat, lng: location.lng });
      mapRef.current.setZoom(15); // Optional: Reset zoom level
    }
  };

  return (
    <div>
     {/* <h2>Live Location Tracking</h2>*/}
      {location.error ? (
        <p>Error: {location.error}</p>
      ) : location.lat && location.lng ? (
        <LoadScriptNext
          googleMapsApiKey = {process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={location.lat && location.lng ? { lat: location.lat, lng: location.lng } : { lat: 37.7749, lng: -122.4194 }} // Default to San Francisco
            zoom={15}
            onLoad={(map) => {
              mapRef.current = map;
              if (location.lat && location.lng) {
                map.panTo({ lat: location.lat, lng: location.lng });
              }
            }}
          >


            <Marker position={{ lat: location.lat, lng: location.lng }} />
            <Circle center={{ lat: location.lat, lng: location.lng }} options={circleOptions} />

          </GoogleMap>
        </LoadScriptNext>
      ) : (
        <p>Fetching live location...</p>
      )}
      {/* Button to recenter map */}
      <button
        onClick={recenterMap}
        style={{
          marginTop: "10px",
          padding: "8px 12px",
          fontSize: "16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Return to My Location
      </button>
    </div>
  );
};

export default UserLocationMap;