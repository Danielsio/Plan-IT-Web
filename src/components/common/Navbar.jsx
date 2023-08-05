import {Navbar, Nav, Button} from "react-bootstrap";
import {FaHouseUser} from "react-icons/fa";
import {AiOutlineInfoCircle} from "react-icons/ai";
import {CgProfile} from "react-icons/cg";
import {BsCalendar2Range} from "react-icons/bs";
import {useContext, useEffect} from "react";
import {UserContext} from "../../context/UserContext.jsx";
import {useNavigate} from "react-router-dom";
import {MdAdminPanelSettings} from "react-icons/md";

function AppNavbar() {
    const {
        isAuthenticated,
        isAdmin,
        handleLogin,
        handleLogout,
        isAuthLoading,
        isCompletedFirstSetup,
    } = useContext(UserContext);

    const navigate = useNavigate();

    useEffect(() => {
        console.log(
            "isAuthenticated: " +
            isAuthenticated +
            " and isAuthLoading:" +
            isAuthLoading +
            " and isCompletedFirstSetup: " +
            isCompletedFirstSetup
        );
        if (!isAuthLoading && isAuthenticated && !isCompletedFirstSetup) {
            navigate("/first-setup");
        }
    }, [isAuthLoading, isCompletedFirstSetup, isAuthenticated]);

    return (
        <Navbar expand="md" className="navbar-bg-color" variant="dark">
            <Navbar.Brand href="/">
                <img
                    alt="PlanIT-logo"
                    src="/PlanIT-%20with%20logo%20white.png"
                    width="156"
                    height="50"
                    className="d-inline-block align-top navbar-logo"
                />{" "}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto"></Nav>
                <Nav className="ml-auto">
                    <Nav.Link href="/">
                        <FaHouseUser className="mb-1 mr-1"/>
                        Home
                    </Nav.Link>
                    {isAuthenticated && (
                        <Nav.Link href="/profile">
                            <CgProfile className="mb-1 mr-1"/>
                            Profile
                        </Nav.Link>
                    )}
                    {isAuthenticated && (
                        <Nav.Link href="/generate-calendar">
                            <BsCalendar2Range className="mb-1 mr-2"/>
                            Create Your Study Calendar
                        </Nav.Link>
                    )}
                    {isAdmin && (
                        <Nav.Link href="/admin">
                            <MdAdminPanelSettings className="mb-1 mr-1"/>
                            Admin Dashboard
                        </Nav.Link>
                    )}
                    <Nav.Link className="mr-2" href="/about">
                        <AiOutlineInfoCircle className="mb-1 mr-1"/>
                        About
                    </Nav.Link>

                    {isAuthenticated ? (
                        <Button variant="outline-light" onClick={handleLogout}>
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
