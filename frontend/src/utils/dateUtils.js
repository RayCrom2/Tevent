// utils/dateUtils.js

export const filterByDate = (events, filter) => {
  if (!filter) return events; // If no filter, return all

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday

  const startOfNextWeek = new Date(startOfWeek);
  startOfNextWeek.setDate(startOfWeek.getDate() + 7);
  const endOfNextWeek = new Date(startOfNextWeek);
  endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);

  return events.filter((event) => {
    const eventDate = new Date(event.date); // direct Date object from MongoDB

    switch (filter.toLowerCase()) {
      case 'today':
        return eventDate.toDateString() === today.toDateString();
      case 'tomorrow':
        return eventDate.toDateString() === tomorrow.toDateString();
      case 'this week':
        return eventDate >= startOfWeek && eventDate <= endOfWeek;
      case 'this weekend':
        return eventDate.getDay() === 6 || eventDate.getDay() === 0; // Saturday or Sunday
      case 'next week':
        return eventDate >= startOfNextWeek && eventDate <= endOfNextWeek;
      default:
        return true;
    }
  });
};
