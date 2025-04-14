import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Events from "./pages/Events";
import About from "./pages/About";
import Register from "./components/Register";
import Calendar from "./pages/Calendar";
import './styles/styles.css';
import "./styles/App.css"
import UserProfile from "./components/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute"; // <--- import it here

const App = () => {
  const { isAuthenticated, user } = useAuth0();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  // Sync user code omitted for brevity
  // ...

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Wrap UserProfile with ProtectedRoute */}
          <Route
            path="/profile/:username"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/events"
            element={
              <Events searchQuery={searchQuery} locationQuery={locationQuery} />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
