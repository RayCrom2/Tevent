import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Link, useLocation } from "react-router-dom";
<<<<<<< HEAD

import { useAuth0 } from "@auth0/auth0-react"; // ✅ Import Auth0 hook
import 'bootstrap/dist/css/bootstrap.min.css'; // import Bootstrap CSS
import ToggleThemeButton from './ToggleThemeButton'; // ✅ correct for default export

=======
import { useAuth0 } from "@auth0/auth0-react";
import 'bootstrap/dist/css/bootstrap.min.css';
>>>>>>> origin/main

function Layout({ children }) {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const location = useLocation();
  const isProfilePage = location.pathname.startsWith("/profile/");

  return (
    // 1. Use Bootstrap flex utilities: d-flex flex-column min-vh-100
    <div className="d-flex flex-column min-vh-100">

      <Navbar style={{ backgroundColor: "#35e8ca" }} expand="lg">
        <Container fluid>
          <Navbar.Brand style={{ color: "#000000" }} as={Link} to="/">
            Tevent
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to={`/profile/${user?.nickname || "me"}`}>
                Profile
              </Nav.Link>
              <Nav.Link as={Link} to="/events">Events</Nav.Link>
              <Nav.Link as={Link} to="/calendar">Calendar</Nav.Link>
              {isAuthenticated ? (
                <Nav.Link
                  onClick={() =>
                    logout({ logoutParams: { returnTo: window.location.origin }})
                  }
                >
                  Logout
                </Nav.Link>
              ) : (
                <Nav.Link onClick={() => loginWithRedirect()}>Login</Nav.Link>
              )}
              <ToggleThemeButton />

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 2. Wrap your main content in a flex-grow-1 container 
          so it expands as needed, pushing the footer down */}
      <div className="flex-grow-1">
        {isProfilePage && isAuthenticated ? (
          <div className="profile-page-wrapper">{children}</div>
        ) : (
          <Container className="my-4">{children}</Container>
        )}
      </div>

      {/* 3. The footer will naturally sit at the bottom because of mt-auto */}
      <footer style={{ backgroundColor: "#000000" }} className="py-2 mt-auto">
        <Container className="text-center">
          <span style={{ color: "#FFFFFF" }}>
            © 2025 Los Postulates de Euclid
          </span>
        </Container>
      </footer>
    </div>
  );
}

export default Layout;
