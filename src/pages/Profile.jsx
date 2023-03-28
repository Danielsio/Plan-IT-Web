import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import "../styles/profile.css";
import {
  Container,
  Button,
  Row,
  Col,
  Image,
  ListGroup,
  Card,
} from "react-bootstrap";
import api from "../api/axiosBackendConfig";
import { ClipLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const convertUserStudyTimeToHours = (userStudyTime) => {
    const hour = Math.floor(userStudyTime / 100);
    if (hour < 10) {
      return "0" + hour.toString();
    } else {
      return hour.toString();
    }
  };

  const convertUserStudyTimeToMinute = (userStudyTime) => {
    const minute = userStudyTime % 100;
    if (minute < 10) {
      return "0" + minute.toString();
    } else {
      return minute.toString();
    }
  };

  const { isAuthenticated, subjectID } = useContext(UserContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleEditPreferences = () => {
    const oldUserPreferences = userData.userPreferences;
    navigate(
      `/edit-preferences?oldUserPreferences=${JSON.stringify(
        oldUserPreferences
      )}`
    );
  };

  useEffect(() => {
    /* get user from backend DB */
    const getUserData = async () => {
      try {
        const response = await api.get("/profile", {
          params: { sub: subjectID },
        });
        console.log(response.data);
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

  return loading ? (
    <ClipLoader
      className="spinner"
      color="#29335c"
      loading={loading}
      size={100}
    />
  ) : (
    <Container className="mt-5">
      <Row>
        <Col className="mr-5">
          <Card>
            <Image src={userData.pictureUrl} alt={userData.name} fluid />
            <h1>Name: {userData.name}</h1>
            <p>Email: {userData.email}</p>
          </Card>
        </Col>
        <Col>
          <Card>
            <h2>Preferences:</h2>
            <ListGroup>
              <ListGroup.Item>
                Study Start Time:{" "}
                {convertUserStudyTimeToHours(
                  userData.userPreferences.userStudyStartTime
                )}
                :
                {convertUserStudyTimeToMinute(
                  userData.userPreferences.userStudyStartTime
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                Study End Time:{" "}
                {convertUserStudyTimeToHours(
                  userData.userPreferences.userStudyEndTime
                )}
                :
                {convertUserStudyTimeToMinute(
                  userData.userPreferences.userStudyEndTime
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                Break Time Size: {userData.userPreferences.userBreakTime}{" "}
                Minutes
              </ListGroup.Item>
              <ListGroup.Item>
                Study Session Size: {userData.userPreferences.studySessionTime}{" "}
                Minutes
              </ListGroup.Item>
              <ListGroup.Item>
                Study On Holidays:{" "}
                {userData.userPreferences.isStudyOnHolyDays ? "Yes" : "No"}
              </ListGroup.Item>
              <ListGroup.Item>
                Study On Weekends:{" "}
                {userData.userPreferences.isStudyOnWeekends ? "Yes" : "No"}
              </ListGroup.Item>
            </ListGroup>
          </Card>
          <Button
            className="mt-3"
            variant="primary"
            size="sm"
            onClick={handleEditPreferences}
          >
            Edit Preferences
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
