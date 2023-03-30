import { FaBars, FaTimes, FaGoogle, FaHouseUser } from "react-icons/fa";
import { useRef, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { FcAbout } from "react-icons/fc";

function Navbar() {
  const navRef = useRef();
  const { isAuthenticated, handleLogout, handleLogin, handleRegister } =
    useContext(UserContext);

  const showNavbar = () => {
    navRef.current.classList.toggle("responsive_nav");
  };

  return (
    <header>
      <h1>
        Plan<span className="navbar-it-span">IT</span>
      </h1>
      <nav ref={navRef}>
        <a href="/">
          <FaHouseUser className="mb-2 mr-1" />
          Home
        </a>
        {isAuthenticated && <a href="/profile">Profile</a>}
        {isAuthenticated && (
          <a href="/generate-calendar">Create Your Study Calendar</a>
        )}
        <a href="/about">
          <FcAbout className="mb-2 mr-1" />
          About
        </a>
        {isAuthenticated ? (
          <button className="nav-btn-auth" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <button className="nav-btn-auth" onClick={handleLogin}>
              <FaGoogle className="mb-2 mr-1" />
              Login
            </button>
            <button className="nav-btn-auth-register" onClick={handleRegister}>
              <FaGoogle className="mb-2 mr-1" />
              Register
            </button>
          </>
        )}
        <button className="nav-btn nav-close-btn" onClick={showNavbar}>
          <FaTimes />
        </button>
      </nav>
      <button className="nav-btn" onClick={showNavbar}>
        <FaBars />
      </button>
    </header>
  );
}

export default Navbar;
