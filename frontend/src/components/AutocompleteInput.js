// src/components/AutocompleteInput.js
import React, { useRef, useEffect } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const libraries = ['places'];

const AutocompleteInput = ({ value, onChange, placeholder, onPlaceSelected, onKeyDown }) => {
  const inputRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (isLoaded && window.google && inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        // Use "geocode" instead of "(cities)" for broader support (cities, zip, full address)
        types: ["geocode"], 
        componentRestrictions: { country: "us" }, // Limit to US
      });

      //Specify the fields you want returned (saves bandwidth and prevents bugs)
      autocomplete.setFields(["geometry", "formatted_address", "address_components"]);

      //Event handler for selection
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();

        if (!place.geometry) {
          console.warn("Place has no geometry — user may have entered a partial address.");
          return;
        }

        // Pass full place object if needed later
        if (onPlaceSelected) {
          onPlaceSelected(place);
        }
      });

      //Cleanup listener on unmount to prevent memory leaks
      return () => {
        window.google.maps.event.clearInstanceListeners(autocomplete);
      };
    }
  }, [isLoaded, onPlaceSelected]);

  if (!isLoaded) {
    return (
      <input
        type="text"
        className="form-control me-2"
        placeholder="Loading location..."
        disabled
      />
    );
  }

  return (
    <input
      type="text"
      className="form-control me-2"
      placeholder={placeholder}
      ref={inputRef}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      autoComplete="off"
    />
  );
};

export default AutocompleteInput;