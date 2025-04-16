import React from "react";
import EventSearch from "../components/EventSearch";

const Events = ({ isLoaded, searchQuery, locationQuery }) => {
  return <EventSearch isLoaded={isLoaded} searchQuery={searchQuery} locationQuery={locationQuery} />;
};

export default Events;

