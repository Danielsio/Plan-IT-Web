import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import { FaBars, FaTimes, FaGoogle, FaHouseUser } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { BsCalendar2Range } from "react-icons/bs";
import GoogleButton from "react-google-button";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function AppNavbar() {
  const { isAuthenticated, handleLogin, handleLogout} = useContext(UserContext);

  return (
    <Navbar expand="md" className="navbar-bg-color" variant="dark">
      <Navbar.Brand href="/">
        Plan<span className="navbar-it-span">IT</span>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto"></Nav>
        <Nav className="ml-auto">
          <Nav.Link href="/">
            <FaHouseUser className="mb-2 mr-1" />
            Home
          </Nav.Link>
          {isAuthenticated && (
            <Nav.Link href="/profile">
              <CgProfile className="mb-2 mr-1" />
              Profile
            </Nav.Link>
          )}
          {isAuthenticated && (
            <Nav.Link href="/generate-calendar">
              <BsCalendar2Range className="mb-2 mr-2" />
              Create Your Study Calendar
            </Nav.Link>
          )}
          <Nav.Link href="/about">
            <AiOutlineInfoCircle className="mb-2 mr-1" />
            About
          </Nav.Link>

          {isAuthenticated ? (
            <Button variant="outline-secondary" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button variant="light" onClick={handleLogin}>
              Continue With Google
            </Button>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AppNavbar;
