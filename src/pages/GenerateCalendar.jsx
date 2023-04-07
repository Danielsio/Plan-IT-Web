import React, { useState, useContext, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api/axiosBackendConfig";
import { UserContext } from "../context/UserContext";
import { Form, Row, Button, Col, Modal, Card } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import "../styles/generateCalendar.css";
import { FaCalendar } from "react-icons/fa";
import FullDayEventItem from "../components/FullDayEventItem";

const GenerateCalendar = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [fullDayEvents, setFullDayEvents] = useState([]);
  const [decisions, setDecisions] = useState([]);

  const handleDecision = (date) => {
    setDecisions((prevState) => {
      return { ...prevState, [date]: !prevState[date] };
    });
  };

  useEffect(() => {
    console.log(decisions);
  }, [decisions]);

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
          } else if (
            response.status === 200 &&
            response.data.details === "Unhandled Full Days Events."
          ) {
            console.log(response.data);
            handleShowModal(response.data.fullDayEvents);
          } else {
            console.error(
              `Error: Unexpected response status code: ${response.status}`
            );
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    }
  };

  const handleOpenCalendar = () => {
    window.open("https://calendar.google.com/", "_blank");
  };

  const handleShowModal = (eventsArray) => {
    setDecisions(
      eventsArray.reduce((acc, event) => {
        acc[event.start.date.value] = false;
        return acc;
      }, {})
    );

    setFullDayEvents(eventsArray);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setLoading(true);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 0);

    console.log(typeof decisions);
    console.log(JSON.stringify(decisions));

    api
      .post("/generate", decisions, {
        params: {
          sub: subjectID,

          start: start.toISOString(),
          end: end.toISOString(),
        },
      })
      .then((response) => {
        setLoading(false);
        if (response.status === 201) {
          console.log("Calendar Has Been Created Seccessfully !! Hooray !!");
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  if (!isAuthenticated) {
    return (
      <div className="message-container">
        <h1>Please Login Or Register to generate your calendar</h1>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="generate-calendar-title mt-4">Your Study Plan:</h1>
      <hr className="generate-calendar-hr" />
      <div className="row">
        <div className="col-lg-6">
          <Card className="generate-plan-card">
            <Card.Body>
              <Card.Title>Upcoming Study Session:</Card.Title>
              <Card.Text>
                There are no upcoming study sessions yet. Generate your study
                plan.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
        <div className="col-lg-6">
          <Card className="generate-plan-card">
            <Card.Body>
              <Card.Title>Generated Study Plan:</Card.Title>
              <Card.Text>
                There is no study plan yet. Generate your study plan.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-3 mt-3">
          <Button
            variant="secondary"
            size="lg"
            block
            onClick={handleOpenCalendar}
          >
            <FaCalendar className="mb-1 mr-1" />
            Open Google Calendar
          </Button>
        </div>
        <div className="col-lg-9 mt-3">
          {showModal && (
            <Modal
              show={showModal}
              onHide={() => setShowModal(false)}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header>
                <Modal.Title>We Found Full Day Events !</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <h5>Please Choose:</h5>
                <ul>
                  {fullDayEvents.map((event) => (
                    <li className="ml-2" key={event.id}>
                      <FullDayEventItem
                        date={event.start.date.value}
                        name={event.summary}
                        handleDecision={handleDecision}
                      />
                    </li>
                  ))}
                </ul>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Continue Generate My Plan !
                </Button>
              </Modal.Footer>
            </Modal>
          )}
          <div className="date-picker-area">
            <h2>Select the start and end of your study period.</h2>
            <div className="mb-3">
              <label htmlFor="start-date-picker">Start Date:</label>
              <DatePicker
                id="start-date-picker"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="end-date-picker">End Date:</label>
              <DatePicker
                id="end-date-picker"
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                className="form-control"
              />
            </div>
            <Button variant="primary" size="lg" block onClick={handleGenerate}>
              Generate Calendar
            </Button>
          </div>
        </div>
      </div>
      {loading && (
        <div className="row mt-3">
          <div className="col-12 text-center">
            <ClipLoader color="#29335c" loading={loading} size={50} />
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateCalendar;
