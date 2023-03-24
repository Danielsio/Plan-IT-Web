import { FaBars, FaTimes } from "react-icons/fa";
import { useRef, useContext } from "react";
import { UserContext } from "../context/UserContext";

function Navbar() {
  const navRef = useRef();
  const { isAuthenticated, handleLogout, handleLogin, handleRegister } =
    useContext(UserContext);

  const showNavbar = () => {
    navRef.current.classList.toggle("responsive_nav");
  };

  return (
    <header>
      <h1>PlanIt</h1>
      <nav ref={navRef}>
        <a href="/">Home</a>
        {isAuthenticated && <a href="/profile">Profile</a>}
        {isAuthenticated && (
          <a href="/generate-calendar">Create Your Study Calendar</a>
        )}
        <a href="/about">About</a>
        {isAuthenticated ? (
          <button className="nav-btn-auth" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <button className="nav-btn-auth" onClick={handleLogin}>
              Login
            </button>
            <button className="nav-btn-auth-register" onClick={handleRegister}>
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
