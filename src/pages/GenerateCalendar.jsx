import React, { useState, useContext, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api/axiosBackendConfig";
import { UserContext } from "../context/UserContext";
import { Form, Row, Button, Col, Modal, Card } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import "../styles/GenerateCalendar.css";
import { FaCalendar } from "react-icons/fa";
import FullDayEventItem from "../components/FullDayEventItem";

const GenerateCalendar = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [fullDayEvents, setFullDayEvents] = useState([]);
  const [decisions, setDecisions] = useState([]);

  // prevState == [false, false, false]
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
        <Card
          className="mx-auto mt-5 p-4"
          style={{
            width: "50%",
            border: "1px solid #dcdcdc",
            boxShadow: "0px 0px 10px #dcdcdc",
          }}
        >
          <Card.Body>
            <Card.Title>PlanIT</Card.Title>
            <Card.Text>
              A company that creates personalized curricula for students is one
              that recognizes the unique learning needs and styles of each
              individual student.
            </Card.Text>
            <Card.Text>
              Rather than adhering to a one-size-fits-all approach, this company
              takes into account a student's interests, strengths, and
              weaknesses to craft a curriculum that maximizes their potential.
            </Card.Text>
            <Card.Text>
              With personalized curricula, students can learn at their own pace,
              focus on areas where they need more support, and explore topics
              that excite them.
            </Card.Text>
            <Card.Text>
              This approach can lead to improved academic performance, greater
              engagement and motivation, and a more fulfilling learning
              experience overall.
            </Card.Text>
            <Card.Text>
              A company that specializes in personalized curricula demonstrates
              a commitment to student success and can make a significant impact
              on the lives of the students they serve.
            </Card.Text>
            <Card.Text>Version 1.0.0</Card.Text>
          </Card.Body>
        </Card>
      </div>

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
