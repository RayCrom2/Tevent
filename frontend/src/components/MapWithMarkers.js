import React, { useRef, useEffect, useState } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import "../styles/MapWithMarkers.css"

const containerStyle = {
  width: '127%',
  height: '700px',
};

function MapWithMarkers({
  center = { lat: 38.4404, lng: -122.7141 },
  events = [],
  isLoaded
}) {
  const mapRef = useRef(null);
  const [hoveredMarkerId, setHoveredMarkerId] = useState(null);

  const handleOnLoad = map => {
    mapRef.current = map;
  };

  // Pan / fit bounds when center or events change
  useEffect(() => {
    if (!mapRef.current) return;
    const bounds = new window.google.maps.LatLngBounds();

    if (events.length) {
      events.forEach(evt => bounds.extend({ lat: evt.lat, lng: evt.lng }));
      bounds.extend(center);
      mapRef.current.fitBounds(bounds);
    } else {
      mapRef.current.panTo(center);
      mapRef.current.setZoom(12);
    }
  }, [center, events]);

  if (!isLoaded) return <p>Loading map...</p>;

  // Find the hovered event object
  const hoveredEvent = events.find(e => e.id === hoveredMarkerId);
console.log("Hovering:", hoveredEvent);

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={handleOnLoad}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        clickableIcons: false,
      }}
    >
      {events.map(evt => (
        <Marker
          key={evt.id}
          position={{ lat: evt.lat, lng: evt.lng }}
          onMouseOver={() => setHoveredMarkerId(evt.id)}
          onMouseOut={() => setHoveredMarkerId(null)}
        />
      ))}

{hoveredEvent && (
  <InfoWindow
    position={{ lat: hoveredEvent.lat, lng: hoveredEvent.lng }}
    onCloseClick={() => setHoveredMarkerId(null)}
    options={{
      pixelOffset: new window.google.maps.Size(0, -30),
      closeBoxURL: ''
    }}
  >
    <div
      className="info-window-content"
      style={{
        maxWidth: 200,
        color: "#000",
        whiteSpace: "normal"
      }}
    >
      <h6>{hoveredEvent.title.replace(/\+/g, " ")}</h6>
     <p>{hoveredEvent.location.replace(/\+/g, " ")}</p>

     <p style={{ margin: "4px 0" }}>
       <strong>Starts:</strong>{" "}
       {new Date(hoveredEvent.date).toLocaleDateString(undefined, {
         weekday: "long",
         month: "long",
         day: "numeric",
       })}{" "}
       at {hoveredEvent.startTime}
     </p>

     <p style={{ margin: "4px 0" }}>
       <strong>Ends:</strong>{" "}
       {new Date(
         hoveredEvent.endDate || hoveredEvent.date
       ).toLocaleDateString(undefined, {
         weekday: "long",
         month: "long",
         day: "numeric",
       })}{" "}
       at {hoveredEvent.endTime}
     </p>

     {/* If you still want the single-date fallback: */}
     {/* <small>{new Date(hoveredEvent.date).toLocaleDateString()}</small> */}
    </div>
  </InfoWindow>
)}
    </GoogleMap>
  );
}



export default React.memo(MapWithMarkers);
