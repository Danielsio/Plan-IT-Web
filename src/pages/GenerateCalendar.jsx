import React, { useState, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api/axiosBackendConfig";
import { UserContext } from "../context/UserContext";
import { Form, Row, Button, Col } from "react-bootstrap";
import { ClipLoader } from "react-spinners";

const GenerateCalendar = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const { subjectID } = useContext(UserContext);

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

  return (
    <div className="date-picker">
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
        <Button className="mt-3 p-2" variant="primary" onClick={handleGenerate}>
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
  );
};

export default GenerateCalendar;
