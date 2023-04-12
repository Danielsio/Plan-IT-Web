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
import ProfileCard from "../components/ProfileCard";
import { animated, useSpring } from "react-spring";

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

  const { isAuthenticated, subjectID, isAuthLoading } = useContext(UserContext);
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

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthLoading, isAuthenticated]);

  if (isAuthLoading) {
    return (
      <Container>
        <ClipLoader />
      </Container>
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
        <Col>
          <ProfileCard
            name={userData.profile.name}
            email={userData.profile.email}
            pictureUrl={userData.profile.pictureUrl}
            userStudyStartTime={
              convertUserStudyTimeToHours(
                userData.userPreferences.userStudyStartTime
              ).toString() +
              ":" +
              convertUserStudyTimeToMinute(
                userData.userPreferences.userStudyStartTime
              ).toString()
            }
            userStudyEndTime={
              convertUserStudyTimeToHours(
                userData.userPreferences.userStudyEndTime
              ).toString() +
              ":" +
              convertUserStudyTimeToMinute(
                userData.userPreferences.userStudyEndTime
              ).toString()
            }
            userBreakTime={userData.userPreferences.userBreakTime}
            studySessionTime={userData.userPreferences.studySessionTime}
            studyOnHolidays={userData.userPreferences.studyOnHolidays}
            studyOnWeekends={userData.userPreferences.studyOnWeekends}
            onClick={handleEditPreferences}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
