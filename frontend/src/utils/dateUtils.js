// utils/dateUtils.js

export const filterByDate = (events, filter) => {
  if (!filter) return events;

  const now   = new Date();
  // normalize to midnight
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // helper dates
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const dayOfWeek = today.getDay(); // 0=Sun,1=Mon…6=Sat

  // current calendar week (Sunday → Saturday)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  // next calendar week
  const startOfNextWeek = new Date(startOfWeek);
  startOfNextWeek.setDate(startOfWeek.getDate() + 7);
  const endOfNextWeek = new Date(startOfNextWeek);
  endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);

  return events.filter((event) => {
    const evDate = new Date(event.date);

    switch (filter.toLowerCase()) {
      case "today":
        return evDate.toDateString() === today.toDateString();

      case "tomorrow":
        return evDate.toDateString() === tomorrow.toDateString();

      case "this week":
        return evDate >= startOfWeek && evDate <= endOfWeek;

      case "this weekend": {
        // compute the upcoming Saturday and Sunday
        const daysToSat = (6 - dayOfWeek + 7) % 7;
        const daysToSun = (7 - dayOfWeek) % 7;

        const saturday = new Date(today);
        saturday.setDate(today.getDate() + daysToSat);

        const sunday = new Date(today);
        sunday.setDate(today.getDate() + daysToSun);

        return (
          evDate.toDateString() === saturday.toDateString() ||
          evDate.toDateString() === sunday.toDateString()
        );
      }

      case "next week":
        return evDate >= startOfNextWeek && evDate <= endOfNextWeek;

      default:
        return true;
    }
  });
};
