import React, { useState, useContext, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axiosBackendConfig";
import { UserContext } from "../context/UserContext";

function EditPreferences() {
  const { subjectID } = useContext(UserContext);

  const location = useLocation();
  const navigate = useNavigate();

  let oldUserPreferences = JSON.parse(
    new URLSearchParams(location.search).get("oldUserPreferences")
  );
  console.log(oldUserPreferences);

  /**
   * converts the oldUserPreferences object to the correct format from backend values to frontend controls values
   * @param oldUserPreferences represents the oldUserPreferences values
   * @returns converted oldUserPreferences object
   */
  const convertOldUserPreferencesFromBackendValuesToFormControlsValues = (
    oldUserPreferences
  ) => {
    const cpyUserPreferences = { ...oldUserPreferences };
    // Convert userStudyStartTime to time format
    const userStudyStartTime = cpyUserPreferences.userStudyStartTime
      .toString()
      .padStart(4, "0");
    cpyUserPreferences.userStudyStartTime = `${userStudyStartTime.substr(
      0,
      2
    )}:${userStudyStartTime.substr(2)}`;
    // Convert userStudyEndTime to time format
    const userStudyEndTime = cpyUserPreferences.userStudyEndTime
      .toString()
      .padStart(4, "0");
    cpyUserPreferences.userStudyEndTime = `${userStudyEndTime.substr(
      0,
      2
    )}:${userStudyEndTime.substr(2)}`;
    // Convert other fields as needed
    return cpyUserPreferences;
  };
  console.log(oldUserPreferences);
  oldUserPreferences =
    convertOldUserPreferencesFromBackendValuesToFormControlsValues(
      oldUserPreferences
    );
  console.log(oldUserPreferences);

  const [userPreferences, setUserPreferences] = useState({
    userStudyStartTime: oldUserPreferences.userStudyStartTime,
    userStudyEndTime: oldUserPreferences.userStudyEndTime,
    userBreakTime: oldUserPreferences.userBreakTime,
    studySessionTime: oldUserPreferences.studySessionTime,
    isStudyOnHolyDays: oldUserPreferences.studyOnHolyDays ? "on" : "",
    isStudyOnWeekends: oldUserPreferences.studyOnWeekends ? "on" : "",
  });

  /**
   * converts the edited prefereces object to the correct format
   * @param prefereces represents the updated user preferences
   */
  const convertUserPreferencesToBackendValues = (preferences) => {
    preferences.userStudyStartTime = parseInt(
      preferences.userStudyStartTime.replace(":", "")
    );

    preferences.userStudyEndTime = parseInt(
      preferences.userStudyEndTime.replace(":", "")
    );

    preferences.userBreakTime = parseInt(preferences.userBreakTime);
    preferences.studySessionTime = parseInt(preferences.studySessionTime);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    convertUserPreferencesToBackendValues(userPreferences);
    api
      .post("/profile", userPreferences, { params: { sub: subjectID } })
      .then((response) => {
        // navigate back to profile page
        navigate("/profile");
      })
      .catch((error) => {
        console.log(error);
      });
    // Save the changes to the backend and redirect back to the profile page
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    console.log(event.target);

    if (type === "checkbox") {
      setUserPreferences({
        ...userPreferences,
        [name]: checked,
      });
    } else {
      setUserPreferences({
        ...userPreferences,
        [name]: value,
      });
    }
  };

  return (
    <Container className="mx-auto w-50">
      <h1>Edit Preferences</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Study Start Time:</Form.Label>
          <Form.Control
            type="time"
            name="userStudyStartTime"
            value={userPreferences.userStudyStartTime}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Study End Time:</Form.Label>
          <Form.Control
            type="time"
            name="userStudyEndTime"
            value={userPreferences.userStudyEndTime}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Break Time Size (minutes):</Form.Label>
          <Form.Control
            type="number"
            name="userBreakTime"
            value={userPreferences.userBreakTime}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Study Session Size (minutes):</Form.Label>
          <Form.Control
            type="number"
            name="studySessionTime"
            value={userPreferences.studySessionTime}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Check
            type="checkbox"
            name="isStudyOnHolyDays"
            checked={userPreferences.isStudyOnHolyDays}
            onChange={handleChange}
            label="Study On Holidays"
          />
        </Form.Group>
        <Form.Group>
          <Form.Check
            type="checkbox"
            name="isStudyOnWeekends"
            checked={userPreferences.isStudyOnWeekends}
            onChange={handleChange}
            label="Study On Weekends"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </Form>
    </Container>
  );
}

export default EditPreferences;
