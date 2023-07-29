import {useContext} from "react";
import {Button, Col, Container, Row} from "react-bootstrap";
import {useSpring, animated} from "react-spring";
import GoogleButton from "react-google-button";
import {Link} from "react-router-dom";
import {UserContext} from "../context/UserContext";
import {FaCalendarAlt} from "react-icons/fa";
import "../styles/home.css";

const Home = () => {
    const {handleLogin, isAuthenticated} = useContext(UserContext);

    const welcomeTextAnimation = useSpring({
        from: {opacity: 0, transform: "translateY(30px)"},
        to: {opacity: 1, transform: "translateY(0px)"},
        delay: 300,
        config: {duration: 500},
    });

    const buttonAnimation = useSpring({
        from: {opacity: 0},
        to: {opacity: 1},
        delay: 800,
        config: {duration: 500},
    });

    return (
        <Container className="home-page-container p-3">
            <Row className="justify-content-md-center justify-content-center">
                <Col xs={12} md={8} className="text-center">
                    <animated.div style={welcomeTextAnimation}>
                        <div>
                            <img
                                alt="PlanIT-logo"
                                src="/PlanIT- logo and slogen white.png"
                                width="60%"
                                height="45%"
                                className="d-inline-block align-top navbar-logo"
                            />{" "}
                            <h3 className="font-weight-bold h4">
                                The one and only platform that manages your exam period
                                automatically.
                            </h3>
                            <p className="my-4 lead">
                                PlanIT is dedicated to helping students succeed in their
                                academic pursuits. Our platform generates personalized study
                                plans for students with just one click, ensuring that they are
                                fully prepared for their exams and can focus on their studies
                                without worry. With PlanIT, no student has to face the stress
                                and uncertainty of exam season alone.
                            </p>
                        </div>
                    </animated.div>
                    {isAuthenticated ? (
                        <animated.div style={buttonAnimation}>
                            <div>
                                <p className="lead mb-4">
                                    To generate your plan for the next exams
                                </p>
                                <Link to="/generate-calendar">
                                    <Button variant="success" size="lg" className="my-3">
                                        Generate My Study Plan <FaCalendarAlt className="ml-2"/>
                                    </Button>
                                </Link>
                            </div>
                        </animated.div>
                    ) : (
                        <animated.div style={buttonAnimation}>
                            <center>
                                <GoogleButton
                                    type="dark"
                                    label="Continue With Google"
                                    onClick={handleLogin}
                                    className="my-3"
                                />
                            </center>
                        </animated.div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default Home;
