// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import { useAuth0 } from "@auth0/auth0-react";
// import Login from "./components/Login";
// import Home from "./pages/Home";
// import Profile from "./pages/Profile";
// import Events from "./pages/Events";
// import About from "./pages/About";
// import Layout from "./components/Layout";
// import { Nav } from "react-bootstrap";

// const App = () => {
//   const { isAuthenticated, isLoading } = useAuth0();

// //   if (isLoading) return <h2>Loading...</h2>; // ✅ Show loading screen while Auth0 initializes

//   return (
//     <Router>
//         <Routes>
//           {/* ✅ Allow access to all pages without forcing login */}
//           <Route path="/" element={<Home />} />
//           <Route path="/profile" element={isAuthenticated ? <Profile /> : <Layout> <h2> Please log in to see this page. </h2> </Layout>} />
//           <Route path="/events" element={<Events />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/login" element={<Login />} />

//           {/* Catch-All Route */}
//           <Route path="*" element={
//             <h2>Page Not Found</h2>} />
//         </Routes>
//     </Router>
//   );
// };

// export default App;

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
import './styles/styles.css';
import { useEffect } from "react";
import Calander from "./pages/Calander";

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
        await fetch("http://localhost:5001/auth/sync-user", {
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
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <h2>Please log in to see this page.</h2>} />
          <Route path="/events" element={<Events searchQuery={searchQuery} locationQuery={locationQuery} />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} /> {/* ✅ new route for Register */}
          <Route path="/calander" element={<Calander /> }/>/* ✅ new route for Register */}
          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
