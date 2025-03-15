// Layout.js
import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // import Bootstrap CSS


function Layout({ children }) {
  return (
    <div>
      {/* Header (Navbar) */}
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">Tevent</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/profile">Profile</Nav.Link>
              <Nav.Link href="/events">Events</Nav.Link>
              <Nav.Link href="/about">About</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container className="my-4">
        {children}
      </Container>

      {/* Footer */}
      <footer className="bg-light py-3 mt-auto">
        <Container className="text-center">
          <span>© 2025 Los Postulates de Euclid</span>
        </Container>
      </footer>
    </div>
  );
}

export default Layout;
