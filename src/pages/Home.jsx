import { useContext } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import GoogleButton from "react-google-button";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "../styles/home.css";

const Home = () => {
  const { handleLogin, isAuthenticated } = useContext(UserContext);

  return (
    <Container className="home-page-container">
      <Row className="justify-content-md-center">
        <Col xs={12} md={8} className="text-center">
          <div className="home-page-welcome-text">
            <h1>Welcome To PlanIt!</h1>
            <h3>
              The one and only platform that manages your exam period
              automatically.
            </h3>
            <p>
              PlanIT is dedicated to helping students succeed in their academic
              pursuits. Our platform generates personalized study plans for
              students with just one click, ensuring that they are fully
              prepared for their exams and can focus on their studies without
              worry. With PlanIT, no student has to face the stress and
              uncertainty of exam season alone.
            </p>
          </div>
          {isAuthenticated ? (
            <div>
              <p>To generate your plan for the next exams</p>
              <Link to="/generate-calendar">
                <Button variant="success" size="lg">
                  Generate My Study Plan
                </Button>
              </Link>
            </div>
          ) : (
            <GoogleButton
              type="dark"
              label="Continue With Google"
              onClick={handleLogin}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
