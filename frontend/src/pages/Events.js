import React from "react";
import EventSearch from "../components/EventSearch";

const Events = ({ searchQuery, locationQuery }) => {
  return (
    <div>
      <h1>Events Page</h1>
      <p>Browse and manage events here.</p>
      
      <EventSearch searchQuery={searchQuery} locationQuery={locationQuery} />
      
    </div>
  );
};

export default Events;