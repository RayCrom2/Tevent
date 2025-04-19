// utils/dateUtils.js

// Helper to parse a "YYYY-MM-DD" string as a local date ignoring time zone
function parseLocalDate(dateString) {
  if (!dateString) return null;
  // Expect dateString like "2025-04-20"
  const [year, month, day] = dateString.split("-");
  // Create a date at local 00:00 of that day (month is zero-indexed)
  return new Date(Number(year), Number(month) - 1, Number(day));
}

// Helper to create a date at local 00:00:00
function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Helper to create a date at local 23:59:59
function endOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
}

// Helper to add days in local time and return a new Date object
function addDays(date, daysToAdd) {
  const result = new Date(date); // clone
  result.setDate(result.getDate() + daysToAdd);
  return result;
}

export const filterByDate = (events, filter) => {
  if (!filter) return events; // If no filter, return all

  // 1. Determine today's local date as YYYY-MM-DD
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const localTodayStr = `${yyyy}-${mm}-${dd}`;

  // 2. Parse it into a local date object
  const localToday = parseLocalDate(localTodayStr);

  // 3. Start/end of today
  const startToday = startOfDay(localToday);
  const endToday = endOfDay(localToday);

  // 4. Start/end of tomorrow
  const tomorrowDate = addDays(localToday, 1);
  const startTomorrow = startOfDay(tomorrowDate);
  const endTomorrow = endOfDay(tomorrowDate);

  // 5. This week (Sunday-Saturday)
  //    - find local "week start" (Sunday) for *today*
  const thisWeekStart = new Date(startToday); 
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay()); 
  // (If your "week start" is Monday, you'd do: .getDay() === 0 ? 6 : getDay() - 1, etc.)

  const startOfThisWeek = startOfDay(thisWeekStart);
  const endOfThisWeek = endOfDay(new Date(startOfThisWeek));
  endOfThisWeek.setDate(endOfThisWeek.getDate() + 6); // through Saturday

  // 6. This weekend (Sat-Sun, or Fri-Sun if you prefer)
  //    We'll assume Sat-Sun for this example.
  const weekendStart = startOfDay(new Date(thisWeekStart));
  weekendStart.setDate(weekendStart.getDate() + 6); // Saturday
  const weekendEnd = endOfDay(new Date(thisWeekStart));
  weekendEnd.setDate(weekendEnd.getDate() + 7); // Sunday

  // 7. Next week (the next Sunday-Saturday after "this week")
  const nextWeekStart = addDays(startOfThisWeek, 7); // next Sunday
  const nextWeekEnd = endOfDay(new Date(nextWeekStart));
  nextWeekEnd.setDate(nextWeekEnd.getDate() + 6); // next Saturday

  switch (filter) {
    case "today":
      return events.filter((event) => {
        const eventDate = parseLocalDate(event.date);
        return (
          eventDate &&
          eventDate >= startToday &&
          eventDate <= endToday
        );
      });

    case "tomorrow":
      return events.filter((event) => {
        const eventDate = parseLocalDate(event.date);
        return (
          eventDate &&
          eventDate >= startTomorrow &&
          eventDate <= endTomorrow
        );
      });

    case "this week":
      return events.filter((event) => {
        const eventDate = parseLocalDate(event.date);
        return (
          eventDate &&
          eventDate >= startOfThisWeek &&
          eventDate <= endOfThisWeek
        );
      });

    case "this weekend":
      return events.filter((event) => {
        const eventDate = parseLocalDate(event.date);
        return (
          eventDate &&
          eventDate >= weekendStart &&
          eventDate <= weekendEnd
        );
      });

    case "next week":
      return events.filter((event) => {
        const eventDate = parseLocalDate(event.date);
        return (
          eventDate &&
          eventDate >= nextWeekStart &&
          eventDate <= nextWeekEnd
        );
      });

    default:
      return events;
  }
};
