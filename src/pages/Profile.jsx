import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import "../styles/profile.css";
import { Container, Row, Col, Image, ListGroup } from "react-bootstrap";
import api from "../api/axiosBackendConfig";

function Profile() {
  const { isAuthenticated, subjectID } = useContext(UserContext);

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /* get user from backend DB */
    const getUserData = async () => {
      try {
        const response = await api.get("/profile", {
          params: { sub: subjectID },
        });
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    if (isAuthenticated) {
      getUserData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="message-container">
        <h1>Please Login Or Register to view Your Profile</h1>
      </div>
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Row>
        <Col>
          <h1>{userData.name}</h1>
          <Image src={userData.pictureUrl} alt={userData.name} fluid />
          <p>Email: {userData.email}</p>
        </Col>
        <Col>
          <h2>Preferences:</h2>
          <ListGroup>
            <ListGroup.Item>
              Study Start Time: {userData.userPreferences.userStudyStartTime}
            </ListGroup.Item>
            <ListGroup.Item>
              Study End Time: {userData.userPreferences.userStudyEndTime}
            </ListGroup.Item>
            <ListGroup.Item>
              Break Time Size: {userData.userPreferences.userBreakTime} Minutes
            </ListGroup.Item>
            <ListGroup.Item>
              Study Session Size: {userData.userPreferences.studySessionTime}{" "}
              Minutes
            </ListGroup.Item>
            <ListGroup.Item>
              Study On Holidays: {userData.userPreferences.isStudyOnHolyDays}
            </ListGroup.Item>
            <ListGroup.Item>
              Study On Weekends: {userData.userPreferences.isStudyOnWeekends}
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
