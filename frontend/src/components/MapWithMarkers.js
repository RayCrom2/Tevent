import React, { useRef, useEffect, useState } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '127%',
  height: '700px',
};

function MapWithMarkers({ center = { lat: 38.4404, lng: -122.7141 }, events = [], isLoaded }) {
  const mapRef = useRef(null);
  const [activeMarker, setActiveMarker] = useState(null);

  const handleOnLoad = (map) => {
    mapRef.current = map;
  };

  // Pan and optionally fit markers into view
  useEffect(() => {
    if (mapRef.current && center) {
      const bounds = new window.google.maps.LatLngBounds();

      if (events.length > 0) {
        events.forEach(event => bounds.extend({ lat: event.lat, lng: event.lng }));
        bounds.extend(center); // include search center
        mapRef.current.fitBounds(bounds); // Fit all markers
      } else {
        mapRef.current.panTo(center); // No markers? Just pan
        mapRef.current.setZoom(12);   // Slight zoom in
      }
    }
  }, [center, events]);

  if (!isLoaded) return <p>Loading map...</p>;

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
      {events.map((event) => (
        <Marker
          key={event.id}
          position={{ lat: event.lat, lng: event.lng }}
          onClick={() => setActiveMarker(event.id)}
        />
      ))}

      {activeMarker && (
        <InfoWindow
          position={{
            lat: events.find(e => e.id === activeMarker).lat,
            lng: events.find(e => e.id === activeMarker).lng
          }}
          onCloseClick={() => setActiveMarker(null)}
        >
          <div style={{ maxWidth: '200px' }}>
            <h6>{events.find(e => e.id === activeMarker).title}</h6>
            <p>{events.find(e => e.id === activeMarker).location}</p>
            <small>{events.find(e => e.id === activeMarker).date}</small>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

export default React.memo(MapWithMarkers);