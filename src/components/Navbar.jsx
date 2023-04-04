import { Navbar, Nav, Button } from "react-bootstrap";
import { FaHouseUser } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { BsCalendar2Range } from "react-icons/bs";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function AppNavbar() {
  const { isAuthenticated, handleLogin, handleLogout } =
    useContext(UserContext);

  return (
    <Navbar expand="md" className="navbar-bg-color" variant="dark">
      <Navbar.Brand href="/">
        <img
          alt="PlanIT-logo"
          src="https://img.favpng.com/2/14/8/clip-art-portable-network-graphics-computer-icons-transparency-scalable-vector-graphics-png-favpng-B5WtdC7Pn8GwRxZavbJgGngCN.jpg"
          width="30"
          height="30"
          className="d-inline-block align-top navbar-logo"
        />{" "}
        Plan<span className="navbar-it-span">IT</span>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto"></Nav>
        <Nav className="ml-auto">
          <Nav.Link href="/">
            <FaHouseUser className="mb-1 mr-1" />
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
          <Nav.Link className="mr-2" href="/about">
            <AiOutlineInfoCircle className="mb-1 mr-1" />
            About
          </Nav.Link>

          {isAuthenticated ? (
            <Button variant="outline-secondary" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button variant="light" onClick={handleLogin}>
              Login
            </Button>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AppNavbar;
