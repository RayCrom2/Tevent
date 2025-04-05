import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Register from "./components/Register"; 
import Calendar from "./pages/Calendar";
import './styles/styles.css';
import { useEffect } from "react";
import "./App.css"
import UserProfile from "./components/UserProfile";


const App = () => {
  const { isAuthenticated, user } = useAuth0();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  const handleSearch = (search, location) => {
    setSearchQuery(search);
    setLocationQuery(location);
  };


  useEffect(() => {
    if (!isAuthenticated || !user) return;
  
    console.log("🔥 Syncing user:", user);
  
    const syncUser = async () => {
      try {

          await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/sync-user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: user.nickname || user.email,
            email: user.email,
            picture: user.picture,
            sub: user.sub,
          }),
        });
      } catch (err) {
        console.error("❌ Failed to sync user:", err.message);
      }
    };
  
    syncUser();
  }, [isAuthenticated, user]);
  

  return (
    <Router>
      <Layout onSearch={handleSearch}>
        <Routes>
          <Route path="/" element={<Home />} />
         {/* <Route path="/profile" element={isAuthenticated ? <Profile /> : <h2>Please log in to see this page.</h2>} />*/}
          <Route path="/profile/:username" element={isAuthenticated ? <UserProfile /> : <h2>Please log in to see this page.</h2>} />
          <Route path="/events" element={<Events searchQuery={searchQuery} locationQuery={locationQuery} />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} /> {/* ✅ new route for Register */}
          <Route path="/calendar" element={<Calendar /> }/> {/* ✅ new route for Register */}
          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
