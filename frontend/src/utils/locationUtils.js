// utils/locationUtils.js
import axios from "axios";

export const fetchCoordinates = async (location) => {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: location,
          key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        },
      }
    );

    if (response.data.results.length > 0) {
      return response.data.results[0].geometry.location;
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
  }
  return null;
};
