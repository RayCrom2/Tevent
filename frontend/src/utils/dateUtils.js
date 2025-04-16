// utils/dateUtils.js
export const filterByDate = (events, filter) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
  
    switch (filter) {
      case "today":
        return events.filter(
          (event) => new Date(event.date).toDateString() === today.toDateString()
        );
      case "tomorrow":
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return events.filter(
          (event) => new Date(event.date).toDateString() === tomorrow.toDateString()
        );
      case "this week":
        return events.filter(
          (event) =>
            new Date(event.date) >= startOfWeek &&
            new Date(event.date) <= endOfWeek
        );
      case "this weekend":
        const weekendStart = new Date(startOfWeek);
        weekendStart.setDate(startOfWeek.getDate() + 5);
        const weekendEnd = new Date(startOfWeek);
        weekendEnd.setDate(startOfWeek.getDate() + 6);
        return events.filter(
          (event) =>
            new Date(event.date) >= weekendStart &&
            new Date(event.date) <= weekendEnd
        );
      case "next week":
        const nextWeekStart = new Date(startOfWeek);
        nextWeekStart.setDate(startOfWeek.getDate() + 7);
        const nextWeekEnd = new Date(nextWeekStart);
        nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
        return events.filter(
          (event) =>
            new Date(event.date) >= nextWeekStart &&
            new Date(event.date) <= nextWeekEnd
        );
      default:
        return events;
    }
  };