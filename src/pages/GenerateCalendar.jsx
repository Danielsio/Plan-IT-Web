import React, { useState, useContext, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api/axiosBackendConfig";
import { UserContext } from "../context/UserContext";
import { Row, Button, Col, Modal, Card, Container } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import "../styles/generateCalendar.css";
import FullDayEventItem from "../components/FullDayEventItem";
import ExamItem from "../components/Exam";
import {
  NO_PROBLEM,
  ERROR_FULL_DAY_EVENTS,
  ERROR_NO_EXAMS_FOUND,
  ERROR_INVALID_GRANT,
  ERROR_COULD_NOT_CONNECT_TO_SERVER_CODE,
  COLLEGE_CALENDAR_NOT_FOUND,
} from "../utill/Constants";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const GenerateCalendar = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [fullDayEvents, setFullDayEvents] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [studyPlan, setStudyPlan] = useState(null);

  const { subjectID, isAuthenticated, isAuthLoading, clearUserState } =
    useContext(UserContext);

  const navigate = useNavigate();

  const dismissAllToastMessages = () => toast.dismiss();

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

        if (error.code === ERROR_COULD_NOT_CONNECT_TO_SERVER_CODE) {
          toast.error(
            "Service Unavailable. It looks that we have some problems right now. Please try again later."
          );
        } else {
          toast.error(
            "Service Unavailable. It looks that we have some problems right now. Please try again later."
          );
        }
      }
    };

    if (isAuthenticated) {
      fetchStudyPlan();
    }
  }, [isAuthenticated]);

  const validateDatesPicked = () => {
    if (startDate >= endDate) {
      console.error("Error: Start date must be before end date.");
      toast.warn("Invalid Parameters. Start date must be before end date.");
      return false;
    } else {
      return true;
    }
  };

  const clearStateAndRedirect = () => {
    clearUserState();
    navigate("/");
    return;
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
          dismissAllToastMessages();
          if (response.status === 201 && response.data.details === NO_PROBLEM) {
            console.log(response.data);
            setStudyPlan(response.data.studyPlan);
            toast.success(
              <div>
                <span>
                  "Success! Your Calendar Was Succefully Generated. You can view
                  your plan in Google Calendar."
                </span>
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
              </div>
            );
          } else if (
            response.status === 200 &&
            response.data.details === ERROR_FULL_DAY_EVENTS
          ) {
            console.log(response.data);
            handleShowModal(response.data.fullDayEvents);
          } else {
            toast.error(
              "Service Unavailable. It looks that we have some problems right now. Please try again later."
            );
          }
        })
        .catch((error) => {
          setLoading(false);
          dismissAllToastMessages();
          console.log(error);

          if (error.code === ERROR_COULD_NOT_CONNECT_TO_SERVER_CODE) {
            toast.error(
              "Service Unavailable. It looks that we have some problems right now. Please try again later."
            );
          } else {
            const problem = error.response.data.details;
            const status = error.response.status;
            if (status === 409 && problem === ERROR_NO_EXAMS_FOUND) {
              toast.warn(
                `No exams were found between ${start.toLocaleDateString()} and ${end.toLocaleDateString()}.`
              );
            } else if (problem === ERROR_INVALID_GRANT) {
              toast.error(
                <div>
                  <span>Session has expired, Please Sign-in</span>
                  <Button
                    className="google-calendar-btn col-lg-3 mt-3"
                    variant="secondary"
                    size="lg"
                    onClick={clearStateAndRedirect}
                  >
                    Go to Home
                  </Button>
                </div>
              );
            } else if (
              status === 406 &&
              problem === COLLEGE_CALENDAR_NOT_FOUND
            ) {
              toast.error(
                "College calendar does not found. Contact the college website to get an explanation of how to connect to their calendar with Google"
              );
            } else {
              toast.error(
                "Service Unavailable. It looks that we have some problems right now. Please try again later."
              );
            }
          }
        });

      toast.info(
        "We are creating you study plan. This might take a minute or two.",
        { autoClose: false }
      );
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
        dismissAllToastMessages();
        if (response.status === 201) {
          console.log("Calendar Has Been Created Seccessfully !! Hooray !!");
          setStudyPlan(response.data.studyPlan);
          toast.success(
            <div>
              <span>
                "Success! Your Calendar Was Succefully Generated. You can view
                your plan in Google Calendar."
              </span>
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
            </div>
          );
        } else {
          toast.error(
            "Service Unavailable. It looks that we have some problems right now. Please try again later."
          );
        }
      })
      .catch((error) => {
        setLoading(false);
        dismissAllToastMessages();
        console.log(error);

        if (error.code === ERROR_COULD_NOT_CONNECT_TO_SERVER_CODE) {
          toast.error(
            "Service Unavailable. It looks that we have some problems right now. Please try again later."
          );
        } else {
          if (error.response.data.details === ERROR_INVALID_GRANT) {
            toast.error(
              <div>
                <span>Session has expired, Please Sign-in</span>
                <Button
                  className="google-calendar-btn col-lg-3 mt-3"
                  variant="secondary"
                  size="lg"
                  onClick={clearStateAndRedirect}
                >
                  Go to Home
                </Button>
              </div>
            );
          } else {
            toast.error(
              "Service Unavailable. It looks that we have some problems right now. Please try again later."
            );
          }
        }
      });

    toast.info(
      "We are creating you study plan. This might take a minute or two.",
      { autoClose: false }
    );
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
        <Col md={7} lg={8}>
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
                            <ExamItem
                              courseName={exam.courseName}
                              dateTimeISO={exam.dateTimeISO}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <hr></hr>
                  <Row className="mb-2 row-preferences">
                    <Col xs={6}>
                      <h6 className="mb-0 title-in-preferences">
                        Start Date Time of Plan:
                      </h6>
                    </Col>
                    <Col xs={6}>
                      <h6 className="mb-0 generated-plan-value">
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
                      <h6 className="mb-0 generated-plan-value">
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
                      <h6 className="mb-0 generated-plan-value">
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

        <Col md={5} lg={4}>
          {/* right */}

          <Card className="card-container generate-plan-card select-dates-card">
            <Card.Body>
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
            </Card.Body>
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
