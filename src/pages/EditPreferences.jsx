import React, { useState, useContext, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import api from "../api/axiosBackendConfig";
import { UserContext } from "../context/UserContext";

function EditPreferences() {

  const { subjectID } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  let oldUserPreferences = JSON.parse(
    new URLSearchParams(location.search).get("oldUserPreferences")
  );

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
    console.log("cpyUserPreferences: ");
    console.log(cpyUserPreferences);
    return cpyUserPreferences;
  };
  oldUserPreferences =
    convertOldUserPreferencesFromBackendValuesToFormControlsValues(
      oldUserPreferences
    );

  const [userPreferences, setUserPreferences] = useState({
    userStudyStartTime: oldUserPreferences.userStudyStartTime,
    userStudyEndTime: oldUserPreferences.userStudyEndTime,
    userBreakTime: oldUserPreferences.userBreakTime,
    studySessionTime: oldUserPreferences.studySessionTime,
    studyOnHolidays: oldUserPreferences.studyOnHolidays,
    studyOnWeekends: oldUserPreferences.studyOnWeekends
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
    setLoading(true);
    console.log("pref before convert: ");
    console.log( userPreferences );
    convertUserPreferencesToBackendValues(userPreferences);
    console.log("pref after convert: ");
    console.log(userPreferences);
    api
      .post("/profile", userPreferences, { params: { sub: subjectID } })
      .then((response) => {
        setLoading(false);
        // navigate back to profile page
        navigate("/profile");
      })
      .catch((error) => {
        console.log(error);
      });
    // Save the changes to the backend and redirect back to the profile page
  };

  const handleCancel = (event) => {
    navigate("/profile");
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

    console.log(userPreferences);
  };

  if (!isAuthenticated) {
    navigate("/");
  }

  return (
    <Container className="mx-auto w-50 p-5">
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
            name="studyOnHolidays"
            checked={userPreferences.studyOnHolidays}
            onChange={handleChange}
            label="Study On Holidays"
          />
        </Form.Group>
        <Form.Group>
          <Form.Check
            type="checkbox"
            name="studyOnWeekends"
            checked={userPreferences.studyOnWeekends}
            onChange={handleChange}
            label="Study On Weekends"
          />
        </Form.Group>
        <Button
          className="mt-2 mr-2"
          variant="secondary"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button className="mt-2" variant="primary" type="submit">
          Save Changes
        </Button>
      </Form>
      {loading && (
        <ClipLoader
          className="spinner"
          color="#29335c"
          loading={loading}
          size={50}
        />
      )}
    </Container>
  );
}

export default EditPreferences;
