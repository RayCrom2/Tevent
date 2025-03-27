const fakeEvents = [
    //Music Events
    { id: 1, title: "Outside Lands Music Festival", date: "2025-03-26", location: "San Francisco, CA", description: "A major music festival featuring top artists.", category: "Music", lat: 37.7694, lng: -122.4862, distance: 5 },
    { id: 2, title: "Monterey Jazz Festival", date: "2025-03-27", location: "Monterey, CA", description: "A world-class jazz festival.", category: "Music", lat: 36.6002, lng: -121.8947, distance: 50 },
    { id: 3, title: "BottleRock Napa Valley", date: "2025-03-28", location: "Napa, CA", description: "A music, wine, and culinary festival.", category: "Music", lat: 38.2975, lng: -122.2869, distance: 25 },
    { id: 14, title: "Latin Dance Night", date: "2025-06-30", location: "San Francisco, CA", description: "A vibrant Latin dance night featuring salsa, bachata, and merengue.", category: "Music", lat: 37.7749, lng: -122.4194, distance: 5 },
  
    //Music Event for Today
    { id: 15, title: "Live Jazz Evening", date: "2025-03-29", location: "Santa Rosa, CA", description: "A relaxing jazz night with local artists.", category: "Music", lat: 38.4404, lng: -122.7141, distance: 5 },
  
    //Added Business Event for Tomorrow
    { id: 16, title: "Startup Networking Mixer", date: "2025-03-30", location: "San Jose, CA", description: "Meet fellow entrepreneurs and investors.", category: "Business", lat: 37.3382, lng: -121.8863, distance: 10 },
  
    //Added Food & Drink Event for This Week
    { id: 17, title: "Wine & Cheese Tasting", date: "2025-04-01", location: "Sonoma, CA", description: "Explore local wineries with a curated tasting experience.", category: "Food & Drink", lat: 38.2919, lng: -122.4580, distance: 10 },
  
    //Added Health Event for This Weekend
    { id: 18, title: "Yoga in the Park", date: "2025-04-5", location: "Golden Gate Park, CA", description: "An outdoor yoga session for all skill levels.", category: "Health & Fitness", lat: 37.7694, lng: -122.4862, distance: 5 },
  
    //Business Events
    { id: 4, title: "San Jose Tech Innovation Summit", date: "2025-11-08", location: "San Jose, CA", description: "A premier tech event featuring startups, investors, and speakers.", category: "Business", lat: 37.3382, lng: -121.8863, distance: 10 },
    { id: 5, title: "Silicon Valley AI Conference", date: "2025-10-05", location: "Palo Alto, CA", description: "A gathering for AI researchers and developers.", category: "Business", lat: 37.4419, lng: -122.1430, distance: 10 },
  
    //Food & Drink Events
    { id: 6, title: "Gilroy Garlic Festival", date: "2025-07-26", location: "Gilroy, CA", description: "Celebrating garlic in all forms.", category: "Food & Drink", lat: 37.0058, lng: -121.5683, distance: 25 },
    { id: 7, title: "Sonoma Wine Tasting Tour", date: "2025-06-05", location: "Sonoma, CA", description: "Experience the best wines in Northern California.", category: "Food & Drink", lat: 38.2919, lng: -122.4580, distance: 50 },
  
    //Health & Fitness Events
    { id: 8, title: "California State Fair", date: "2025-07-12", location: "Sacramento, CA", description: "A family-friendly fair featuring carnival rides, food, and concerts.", category: "Health & Fitness", lat: 38.5809, lng: -121.4997, distance: 100 },
    { id: 9, title: "Lake Tahoe Winter Festival", date: "2025-12-10", location: "South Lake Tahoe, CA", description: "A winter festival with skiing and snowboarding.", category: "Health & Fitness", lat: 38.9399, lng: -119.9772, distance: 100 },
  
    //Family Events
    { id: 10, title: "Santa Cruz Beach Festival", date: "2025-07-15", location: "Santa Cruz, CA", description: "A fun beach festival for families.", category: "Health & Fitness", lat: 36.9741, lng: -122.0308, distance: 50 },
  
    //Sonoma State University Events
    { id: 11, title: "SSU Career Fair", date: "2025-04-20", location: "Sonoma State University, CA", description: "Connect with top employers at the annual career fair.", category: "Business", lat: 38.3409, lng: -122.6746, distance: 2 },
    { id: 12, title: "Seawolf Fest", date: "2025-09-15", location: "Sonoma State University, CA", description: "A welcome-back festival for students featuring live music and activities.", category: "Music", lat: 38.3409, lng: -122.6746, distance: 2 },
    { id: 13, title: "SSU Research Symposium", date: "2025-11-10", location: "Sonoma State University, CA", description: "A showcase of student research and innovation.", category: "Business", lat: 38.3409, lng: -122.6746, distance: 2 },
  ];
  
  export default fakeEvents;
  