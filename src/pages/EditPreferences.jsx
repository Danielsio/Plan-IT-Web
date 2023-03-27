import React, { useState, useContext } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosBackendConfig";
import { UserContext } from "../context/UserContext";

function EditPreferences() {
  const { subjectID } = useContext(UserContext);
  /**
   * converts the edited prefereces object to the correct format
   * @param prefereces represents the edited user preferences
   * @returns a new preferences object in the correct format
   */
  const convertUserPreferencesToBackendValues = (preferences) => {
    const startTimeStr = preferences.userStudyStartTime;

    preferences.userStudyStartTime = parseInt(
      preferences.userStudyStartTime.replace(":", "")
    );

    preferences.userStudyEndTime = parseInt(
      preferences.userStudyEndTime.replace(":", "")
    );

    preferences.userBreakTime = parseInt(preferences.userBreakTime);
    preferences.studySessionTime = parseInt(preferences.studySessionTime);
  };

  const [userPreferences, setUserPreferences] = useState({
    userStudyStartTime: "",
    userStudyEndTime: "",
    userBreakTime: "",
    studySessionTime: "",
    isStudyOnHolyDays: false,
    isStudyOnWeekends: false,
  });
  const navigate = useNavigate();

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
