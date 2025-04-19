// 1) Build currentDate in local time (NO toISOString)
const now = new Date();
const yyyy = now.getFullYear();
const mm = String(now.getMonth() + 1).padStart(2, "0");
const dd = String(now.getDate()).padStart(2, "0");
const currentDate = `${yyyy}-${mm}-${dd}`;

// 2) Parse a 'YYYY-MM-DD' string in local time
function parseLocalDate(dateStr) {
  const [year, month, day] = dateStr.split("-");
  // Creates a date at local 00:00 of that day (month is zero-indexed)
  return new Date(+year, +month - 1, +day);
}

// 3) Add days in local time
function addDaysToDate(dateStr, daysToAdd) {
  const date = parseLocalDate(dateStr);
  date.setDate(date.getDate() + daysToAdd);

  // Format back to 'YYYY-MM-DD'
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

console.log("Local currentDate:", currentDate);

const fakeEvents = [
  // Music Events
  {
    id: 1,
    title: "Outside Lands Music Festival",
    date: addDaysToDate(currentDate, 0),
    audience: "18+",
    location: "San Francisco, CA",
    description: "A major music festival featuring top artists.",
    category: "Music",
    lat: 37.7694,
    lng: -122.4862,
    distance: 5
  },
  {
    id: 2,
    title: "Monterey Jazz Festival",
    date: addDaysToDate(currentDate, 1),
    audience: "Everyone",
    location: "Monterey, CA",
    description: "A world-class jazz festival.",
    category: "Music",
    lat: 36.6002,
    lng: -121.8947,
    distance: 50
  },
  {
    id: 3,
    title: "BottleRock Napa Valley",
    date: addDaysToDate(currentDate, 2),
    audience: "21+",
    location: "Napa, CA",
    description: "A music, wine, and culinary festival.",
    category: "Music",
    lat: 38.2975,
    lng: -122.2869,
    distance: 25
  },
  {
    id: 14,
    title: "Latin Dance Night",
    date: addDaysToDate(currentDate, 3),
    audience: "18+",
    location: "San Francisco, CA",
    description: "A vibrant Latin dance night featuring salsa, bachata, and merengue.",
    category: "Music",
    lat: 37.7749,
    lng: -122.4194,
    distance: 5
  },

  {
    id: 15,
    title: "Live Jazz Evening",
    date: addDaysToDate(currentDate, 4),
    audience: "21+",
    location: "Santa Rosa, CA",
    description: "A relaxing jazz night with local artists.",
    category: "Music",
    lat: 38.4404,
    lng: -122.7141,
    distance: 5
  },

  // Business Event
  {
    id: 16,
    title: "Startup Networking Mixer",
    date: addDaysToDate(currentDate, 5),
    audience: "18+",
    location: "San Jose, CA",
    description: "Meet fellow entrepreneurs and investors.",
    category: "Business",
    lat: 37.3382,
    lng: -121.8863,
    distance: 10
  },

  // Food & Drink Event
  {
    id: 17,
    title: "Wine & Cheese Tasting",
    date: addDaysToDate(currentDate, 6),
    audience: "21+",
    location: "Sonoma, CA",
    description: "Explore local wineries with a curated tasting experience.",
    category: "Food & Drink",
    lat: 38.2919,
    lng: -122.4580,
    distance: 10
  },

  // Health Event
  {
    id: 18,
    title: "Yoga in the Park",
    date: addDaysToDate(currentDate, 7),
    audience: "Everyone",
    location: "Golden Gate Park, CA",
    description: "An outdoor yoga session for all skill levels.",
    category: "Health & Fitness",
    lat: 37.7694,
    lng: -122.4862,
    distance: 5
  },

  // More events...
  {
    id: 4,
    title: "San Jose Tech Innovation Summit",
    date: addDaysToDate(currentDate, 8),
    audience: "18+",
    location: "San Jose, CA",
    description: "A premier tech event featuring startups, investors, and speakers.",
    category: "Business",
    lat: 37.3382,
    lng: -121.8863,
    distance: 10
  },
  {
    id: 5,
    title: "Silicon Valley AI Conference",
    date: addDaysToDate(currentDate, 9),
    audience: "18+",
    location: "Palo Alto, CA",
    description: "A gathering for AI researchers and developers.",
    category: "Business",
    lat: 37.4419,
    lng: -122.1430,
    distance: 10
  },
  {
    id: 6,
    title: "Gilroy Garlic Festival",
    date: addDaysToDate(currentDate, 0),
    audience: "Everyone",
    location: "Gilroy, CA",
    description: "Celebrating garlic in all forms.",
    category: "Food & Drink",
    lat: 37.0058,
    lng: -121.5683,
    distance: 25
  },
  {
    id: 7,
    title: "Sonoma Wine Tasting Tour",
    date: addDaysToDate(currentDate, 1),
    audience: "21+",
    location: "Sonoma, CA",
    description: "Experience the best wines in Northern California.",
    category: "Food & Drink",
    lat: 38.2919,
    lng: -122.4580,
    distance: 50
  },
  {
    id: 8,
    title: "California State Fair",
    date: addDaysToDate(currentDate, 16),
    audience: "Everyone",
    location: "Sacramento, CA",
    description: "A family-friendly fair featuring carnival rides, food, and concerts.",
    category: "Health & Fitness",
    lat: 38.5809,
    lng: -121.4997,
    distance: 100
  },
  {
    id: 9,
    title: "Lake Tahoe Winter Festival",
    date: addDaysToDate(currentDate, 1),
    audience: "18+",
    location: "South Lake Tahoe, CA",
    description: "A winter festival with skiing and snowboarding.",
    category: "Health & Fitness",
    lat: 38.9399,
    lng: -119.9772,
    distance: 100
  },
  {
    id: 10,
    title: "Santa Cruz Beach Festival",
    date: addDaysToDate(currentDate, 11),
    audience: "18+",
    location: "Santa Cruz, CA",
    description: "A fun beach festival for families.",
    category: "Health & Fitness",
    lat: 36.9741,
    lng: -122.0308,
    distance: 50
  },
  {
    id: 11,
    title: "SSU Career Fair",
    date: addDaysToDate(currentDate, 14),
    audience: "Everyone",
    location: "Sonoma State University, CA",
    description: "Connect with top employers at the annual career fair.",
    category: "Business",
    lat: 38.3409,
    lng: -122.6746,
    distance: 2
  },
  {
    id: 12,
    title: "Seawolf Fest",
    date: addDaysToDate(currentDate, 13),
    audience: "Everyone",
    location: "Sonoma State University, CA",
    description: "A welcome-back festival for students featuring live music and activities.",
    category: "Music",
    lat: 38.3409,
    lng: -122.6746,
    distance: 2
  },
  {
    id: 13,
    title: "SSU Research Symposium",
    date: addDaysToDate(currentDate, 1),
    audience: "Everyone",
    location: "Sonoma State University, CA",
    description: "A showcase of student research and innovation.",
    category: "Business",
    lat: 38.3409,
    lng: -122.6746,
    distance: 2
  }
];

export default fakeEvents;
