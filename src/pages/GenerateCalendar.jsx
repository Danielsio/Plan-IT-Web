import React, { useState, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api/axiosBackendConfig";
import { UserContext } from "../context/UserContext";
import { Form, Row, Button, Col } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import "../styles/GenerateCalendar.css";
import { FaCalendar } from "react-icons/fa";

const GenerateCalendar = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const { subjectID, isAuthenticated } = useContext(UserContext);

  const validateDatesPicked = () => {
    if (startDate >= endDate) {
      console.error("Error: Start date must be before end date.");
      return false;
    } else {
      return true;
    }
  };

  const handleGenerate = () => {
    if (validateDatesPicked()) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 0);

      console.log(
        "sending parameters to server - start: " +
          start.toISOString() +
          ", end: " +
          end.toISOString()
      );
      setLoading(true);
      api
        .post(
          "/scan",
          {},
          {
            params: {
              sub: subjectID,
              start: start.toISOString(),
              end: end.toISOString(),
            },
          }
        )
        .then((response) => {
          setLoading(false);
          if (response.status === 201) {
            console.log(response.data);
          } else if (response.status === 409) {
            console.log(response.data);
          } else {
            console.error(
              `Error: Unexpected response status code: ${response.status}`
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleOpenCalendar = () => {
    window.open("https://calendar.google.com/", "_blank");
  };

  if (!isAuthenticated) {
    return (
      <div className="message-container">
        <h1>Please Login Or Register to generate your calendar</h1>
      </div>
    );
  }

  return (
    <div className="generate-calendar-container">
      <h1 className="generate-calendar-title mt-3 ml-4">Your Study Plan:</h1>
      <hr className="generate-calendar-hr" />
      <div className="button-container">
        <Button
          className="mt-3 ml-3 p-2"
          variant="secondary"
          onClick={handleOpenCalendar}
        >
          <FaCalendar className="mb-1 mr-1" />
          Open Google Calendar
        </Button>
      </div>
      <div className="date-picker-container">
        <div className="date-picker mt-5">
          <center>
            <h2>Select the start and end of your study period.</h2>
            <div className="mb-3">
              <label htmlFor="start-date-picker">Start Date:</label>
              <DatePicker
                id="start-date-picker"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="end-date-picker">End Date:</label>
              <DatePicker
                id="end-date-picker"
                selected={endDate}
                onChange={(date) => setEndDate(date)}
              />
            </div>
            <Button
              className="mt-3 p-2"
              variant="primary"
              onClick={handleGenerate}
            >
              Generate Calendar
            </Button>
          </center>
          {loading && (
            <ClipLoader
              className="ml-10"
              color="#29335c"
              loading={loading}
              size={50}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateCalendar;
