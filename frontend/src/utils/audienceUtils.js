// utils/audienceUtils.js

/* Filters an array of events by the given audience value.
 * @param {Array} events - Array of event objects.
 * @param {string} audienceValue - The audience value to filter by (e.g., "", "18+", "21+").
 * @return {Array} - Filtered array of events.
 */
export const filterByAudience = (events, audienceValue) => {
    // If no audience value is provided, return the original events array
    if (!audienceValue) {
      return events;
    }
  
    // Otherwise, only return events that match the audience value
    return events.filter((event) => event.audience === audienceValue);
  };
  