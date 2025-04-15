import React from "react";
import EventSearch from "../components/EventSearch";

const Events = ({ searchQuery, locationQuery }) => {
  return (
    <div>
      <EventSearch searchQuery={searchQuery} locationQuery={locationQuery} />
    </div>
  );
};

export default Events;

