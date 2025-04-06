import React from 'react'; 
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Link, useLocation } from "react-router-dom";

import { useAuth0 } from "@auth0/auth0-react"; // ✅ Import Auth0 hook
import 'bootstrap/dist/css/bootstrap.min.css'; // import Bootstrap CSS

function Layout({ children }) {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const location= useLocation();
  const isProfilePage = location.pathname.startsWith("/profile/");

  return (
    <div>
      <Navbar style={{ backgroundColor: "#35e8ca" }} expand="lg">
        <Container fluid> {/* Change this to Container fluid */}
          <Navbar.Brand style={{ color: "#000000" }} as={Link} to="/">Tevent</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to={`/profile/${user?.nickname || "me"}`}>Profile</Nav.Link>
              <Nav.Link as={Link} to="/events">Events</Nav.Link>
              <Nav.Link as={Link} to="/calendar">Calendar</Nav.Link>
              {/* <Nav.Link as={Link} to="/about">About</Nav.Link> */}
              

              {isAuthenticated ? (
                <Nav.Link onClick={() => logout( { logoutParams: { returnTo: window.location.origin }})}>
                  Logout
                </Nav.Link>
              ) : (
                <Nav.Link onClick={() => loginWithRedirect()}>Login</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      {isProfilePage && isAuthenticated ? (
          <div className="profile-page-wrapper">{children}</div>
      ) : (

      <Container className="my-4">
        {children}
      </Container>
      )}

      <footer style={{ backgroundColor: "#000000" }} className="py-2 mt-auto">
        <Container className="text-center">
          <span style={{ color: "#FFFFFF" }}>© 2025 Los Postulates de Euclid</span>
        </Container>
      </footer>
    </div>
  );
}

export default Layout;


