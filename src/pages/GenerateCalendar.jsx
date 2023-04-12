import React, { useState, useContext, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api/axiosBackendConfig";
import { UserContext } from "../context/UserContext";
import {
  Form,
  Row,
  Button,
  Col,
  Modal,
  Card,
  Container,
} from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import "../styles/generateCalendar.css";
import { FaCalendar } from "react-icons/fa";
import FullDayEventItem from "../components/FullDayEventItem";
import Exam from "../components/Exam";
import { useNavigate } from "react-router-dom";

const GenerateCalendar = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [fullDayEvents, setFullDayEvents] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [studyPlan, setStudyPlan] = useState(null);

  const { subjectID, isAuthenticated, isAuthLoading } = useContext(UserContext);

  const navigate = useNavigate();

  const handleDecision = (date) => {
    setDecisions((prevState) => {
      return { ...prevState, [date]: !prevState[date] };
    });
  };

  useEffect(() => {
    console.log(decisions);
  }, [decisions]);

  // get latestStudyPlan from backend
  useEffect(() => {
    const fetchStudyPlan = async () => {
      try {
        const response = await api.get("/study-plan", {
          params: {
            sub: subjectID,
          },
        });
        console.log(response.data);

        setStudyPlan(response.data.studyPlan);
      } catch (error) {
        console.error(error);
        setStudyPlan(null);
      }
    };

    if (isAuthenticated) {
      fetchStudyPlan();
    }
  }, [isAuthenticated]);

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
            setStudyPlan(response.data.studyPlan);
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
    // we can use "/u/0/r/week/2023/4/17" to open calendar in a specific date
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
          setStudyPlan(response.data.studyPlan);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

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

  return (
    <Container>
      <h1 className="generate-calendar-title mt-4 ">Your Study Plan:</h1>
      <hr className="generate-calendar-hr" />

      <Row>
        <Col className="col-lg-6" sm={6}>
          {/*left*/}
          <Card className="card-container generate-plan-card">
            {" "}
            <Card.Body>
              <Card.Title>Generated Study Plan:</Card.Title>

              {studyPlan ? (
                <>
                  <div className="title-in-preferences">
                    Scanned Exams:{" "}
                    <ul>
                      {studyPlan.scannedExams.map((exam) => {
                        return (
                          <li key={exam.courseName}>
                            <Exam
                              courseName={exam.courseName}
                              dateTimeISO={exam.dateTimeISO}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <Row className="mb-2 row-preferences">
                    <Col xs={6}>
                      <h6 className="mb-0 title-in-preferences">
                        Start Date Time of Plan:
                      </h6>
                    </Col>
                    <Col xs={6}>
                      <h6 className="mb-0">
                        {new Date(
                          studyPlan.startDateTimeOfPlan
                        ).toLocaleDateString()}
                      </h6>
                    </Col>
                  </Row>
                  <Row className="mb-2 row-preferences">
                    <Col xs={6}>
                      <h6 className="mb-0 title-in-preferences">
                        End Date Time of Plan:
                      </h6>
                    </Col>
                    <Col xs={6}>
                      <h6 className="mb-0">
                        {new Date(
                          studyPlan.endDateTimeOfPlan
                        ).toLocaleDateString()}
                      </h6>
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs={6}>
                      <h6 className="mb-0 title-in-preferences">
                        Total Number of Study Sessions:
                      </h6>
                    </Col>
                    <Col xs={6}>
                      <h6 className="mb-0">
                        {studyPlan.totalNumberOfStudySessions}
                      </h6>
                    </Col>
                  </Row>
                </>
              ) : (
                <div>No study plan found.</div>
              )}
            </Card.Body>
          </Card>

          <Card className="card-container generate-plan-card">
            <Card.Body>
              <Card.Title>Upcoming Study Session:</Card.Title>
              <Card.Text></Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col className="col-lg-6" sm={6}>
          {/* right */}

          <Card className="card-container generate-plan-card">
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
            <Button variant="primary" size="lg" onClick={handleGenerate}>
              Generate Calendar
            </Button>

            {loading && (
              <div className="row mt-3">
                <div className="col-12 text-center">
                  <ClipLoader color="#29335c" loading={loading} size={50} />
                </div>
              </div>
            )}
          </Card>

          <Button
            className="google-calendar-btn col-lg-3 mt-3"
            variant="secondary"
            size="lg"
            onClick={handleOpenCalendar}
          >
            <img
              className="mr-2 google-calendar-icon-btn"
              src="/Google_Calendar_icon.svg.png"
              alt=""
            />
            Open Google Calendar
          </Button>
        </Col>

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
      </Row>
    </Container>
  );
};

export default GenerateCalendar;
