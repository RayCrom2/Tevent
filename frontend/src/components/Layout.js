import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react"; // ✅ Import Auth0 hook
import 'bootstrap/dist/css/bootstrap.min.css'; // import Bootstrap CSS

function Layout({ children }) {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0(); // ✅ Get auth state

  return (
    <div>
      {/* Header (Navbar) */}
      <Navbar style={{ backgroundColor: "#35e8ca" }} expand="lg">
        <Container>
          <Navbar.Brand style={{ color: "#000000" }} as={Link} to="/">Tevent</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
              <Nav.Link as={Link} to="/events">Events</Nav.Link>
              <Nav.Link as={Link} to="/about">About</Nav.Link>
              <Nav.Link as={Link} to="/calander">Calander</Nav.Link>

              {/* ✅ Show Login or Logout dynamically */}
              {isAuthenticated ? (
                <Nav.Link onClick={() => logout({ returnTo: window.location.origin })}>
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
      <Container className="my-4">
        {children}
      </Container>

      {/* Footer */}
      <footer style={{ backgroundColor: "#000000" }} className="py-2 mt-auto">
        <Container className="text-center">
          <span style={{ color: "#FFFFFF" }}>© 2025 Los Postulates de Euclid</span>
        </Container>
      </footer>
    </div>
  );
}

export default Layout;

