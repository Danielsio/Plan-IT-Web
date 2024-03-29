import React, {useState, useContext, useEffect} from "react";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api/axiosBackendConfig";
import {UserContext} from "../context/UserContext";
import {Row, Button, Col, Container, Card} from "react-bootstrap";
import {ClipLoader} from "react-spinners";
import "../styles/generateCalendar.css";
import {
    NO_PROBLEM,
    ERROR_FULL_DAY_EVENTS,
    ERROR_NO_EXAMS_FOUND,
    ERROR_INVALID_GRANT,
    ERROR_COULD_NOT_CONNECT_TO_SERVER_CODE,
    COLLEGE_CALENDAR_NOT_FOUND,
    ERROR_USER_NOT_FOUND,
    ERROR_NO_VALID_ACCESS_TOKEN,
} from "../utill/Constants";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {Backdrop} from "@mui/material";
import PageHeader from "../components/common/PageHeader.jsx";
import UpcomingStudySessionCard from "../components/generate/UpcomingStudySessionCard.jsx";
import StudyPlanCard from "../components/generate/StudyPlanCard.jsx";
import SelectDatesAndGenerateCard from "../components/generate/SelectDatesAndGenerateCard.jsx";
import GoogleCalendarButton from "../components/generate/GoogleCalendarButton.jsx"
import FullDayEventsModalComponent from "../components/generate/FullDayEventsModal.jsx";

const GenerateCalendar = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [fullDayEvents, setFullDayEvents] = useState([]);
    const [decisions, setDecisions] = useState([]);
    const [loadingStudyDetails, setLoadingStudyDetails] = useState(true);
    const [studyPlan, setStudyPlan] = useState(null);
    const [newGenerate, setNewGenerate] = useState(true);
    const [upComingSession, setUpComingSession] = useState(null);
    const {subjectID, isAuthenticated, isAuthLoading, clearStateAndRedirect} = useContext(UserContext);

    const navigate = useNavigate();

    const dismissAllToastMessages = () => toast.dismiss();

    const handleDecision = (date) => {
        setDecisions((prevState) => {
            return {...prevState, [date]: !prevState[date]};
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
                setUpComingSession(response.data.upComingSession);
                setLoadingStudyDetails(false);
            } catch (error) {
                console.error(error);
                setStudyPlan(null);

                if (error.code === ERROR_COULD_NOT_CONNECT_TO_SERVER_CODE) {
                    toast.error(
                        "Service Unavailable. It looks that we have some problems right now. Please try again later."
                    );
                } else {
                    const problem = error.response.data.details;
                    const status = error.response.status;
                    if (status === 400 && (problem === ERROR_USER_NOT_FOUND || problem === ERROR_INVALID_GRANT)) {
                        toast.error(
                            <div>
                                <span>Session has expired, Please Sign-in</span>
                                <Button
                                    className="google-calendar-btn col-lg-3 mt-3 btn-grey-planit"
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

    const handleGenerate = () => {
        if (validateDatesPicked()) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);

            const end = new Date(endDate);
            end.setHours(23, 59, 59, 0);

            setLoading(true);
            setNewGenerate(true);
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
                        setUpComingSession(response.data.upComingSession)
                        toast.success(
                            <div>
                <span>
                  "Success! Your Calendar Was Successfully Generated. You can view
                  your plan in Google Calendar."
                </span>
                                <Button
                                    className="google-calendar-btn col-lg-3 mt-3 btn-grey-planit"
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
                        } else if (
                            (status === 400 && problem === ERROR_INVALID_GRANT) ||
                            (status === 400 && problem === ERROR_USER_NOT_FOUND) ||
                            (status === 401 && problem === ERROR_NO_VALID_ACCESS_TOKEN)
                        ) {
                            toast.error(
                                <div>
                                    <span>Session has expired, Please Sign-in</span>
                                    <Button
                                        className="google-calendar-btn col-lg-3 mt-3 btn-grey-planit"
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
                "We are creating your study plan. This might take a minute or two.",
                {autoClose: false}
            );
        }
    };

    const handleReGenerate = () => {
        setLoading(true);
        setNewGenerate(false);
        api
            .post(
                "/re-generate",
                {},
                {
                    params: {
                        sub: subjectID,
                    },
                }
            )
            .then((response) => {
                setLoading(false);
                dismissAllToastMessages();
                if (response.status === 201 && response.data.details === NO_PROBLEM) {
                    console.log(response.data);
                    setStudyPlan(response.data.studyPlan);
                    setUpComingSession(response.data.upComingSession)
                    toast.success(
                        <div>
                <span>
                  "Success! Your Calendar Was Successfully Re-Generated. You can view
                  your plan in Google Calendar."
                </span>
                            <Button
                                className="google-calendar-btn col-lg-3 mt-3 btn-grey-planit"
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
                    if (
                        (status === 400 && problem === ERROR_INVALID_GRANT) ||
                        (status === 400 && problem === ERROR_USER_NOT_FOUND) ||
                        (status === 401 && problem === ERROR_NO_VALID_ACCESS_TOKEN)
                    ) {
                        toast.error(
                            <div>
                                <span>Session has expired, Please Sign-in</span>
                                <Button
                                    className="google-calendar-btn col-lg-3 mt-3 btn-grey-planit"
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
            "We are creating your study plan. This might take a minute or two.",
            {autoClose: false}
        );
    };

    const handleRemoveStudyPlan = async () => {
        toast.info(
            "We are removing the latest study plan. This might take a minute or two.",
            {autoClose: false}
        );
        try {
            setLoadingStudyDetails(true);
            const response = await api.delete("/study-plan", {
                params: {
                    sub: subjectID,
                },
            });
            dismissAllToastMessages();
            console.log(response.data);

            toast.success(`The latest study plan between ${new Date(studyPlan.startDateTimeOfPlan).toLocaleDateString()} and ${new Date(studyPlan.endDateTimeOfPlan).toLocaleDateString()}
            was successfully removed from your Google Calendar.`)
            setStudyPlan(null);
            setUpComingSession(null);
            setLoadingStudyDetails(false);
        } catch (error) {
            dismissAllToastMessages();
            console.error(error);

            if (error.code === ERROR_COULD_NOT_CONNECT_TO_SERVER_CODE) {
                toast.error(
                    "Service Unavailable. It looks that we have some problems right now. Please try again later."
                );
            } else {
                const problem = error.response.data.details;
                const status = error.response.status;
                if (status === 400 && (problem === ERROR_USER_NOT_FOUND || problem === ERROR_INVALID_GRANT)) {
                    toast.error(
                        <div>
                            <span>Session has expired, Please Sign-in</span>
                            <Button
                                className="google-calendar-btn col-lg-3 mt-3 btn-grey-planit"
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
        const start = newGenerate ? new Date(startDate) : new Date(studyPlan.startDateTimeOfPlan);
        start.setHours(0, 0, 0, 0);

        const end = newGenerate ? new Date(endDate) : new Date(studyPlan.endDateTimeOfPlan);
        end.setHours(23, 59, 59, 0);

        console.log(typeof decisions);
        console.log(JSON.stringify(decisions));

        const url = newGenerate ? "/scan" : "/re-generate";

        api
            .post(url, decisions, {
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
                    console.log("Calendar Has Been Created Successfully !! Hooray !!");
                    setStudyPlan(response.data.studyPlan);
                    setUpComingSession(response.data.upComingSession);
                    toast.success(
                        <div>
              <span>
                "Success! Your Calendar Was Successfully Generated. You can view
                your plan in Google Calendar."
              </span>
                            <Button
                                className="google-calendar-btn col-lg-3 mt-3 btn-grey-planit"
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
                    const problem = error.response.data.details;
                    const status = error.response.status;
                    if (
                        (status === 400 && problem === ERROR_INVALID_GRANT) ||
                        (status === 400 && problem === ERROR_USER_NOT_FOUND)
                    ) {
                        toast.error(
                            <div>
                                <span>Session has expired, Please Sign-in</span>
                                <Button
                                    className="google-calendar-btn col-lg-3 mt-3 btn-grey-planit"
                                    variant="secondary"
                                    size="lg"
                                    onClick={clearStateAndRedirect}
                                >
                                    Go to Home
                                </Button>
                            </div>
                        );
                    } else if (status === 406 && problem === COLLEGE_CALENDAR_NOT_FOUND) {
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
            "We are creating your study plan. This might take a minute or two.",
            {autoClose: false}
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
                <ClipLoader/>
            </Container>
        );
    }

    return (
        <Container>
            <PageHeader pageTitle={"Your Study Plan"}></PageHeader>

            <Row>
                <Col md={7} lg={8}>
                    {/*left*/}
                    <StudyPlanCard
                        loadingStudyDetails={loadingStudyDetails}
                        studyPlan={studyPlan}
                        handleReGenerate={handleReGenerate}
                        handleRemoveStudyPlanButtonClick={handleRemoveStudyPlan}
                    />
                    <UpcomingStudySessionCard
                        loadingStudyDetails={loadingStudyDetails}
                        upComingSession={upComingSession}
                    />
                </Col>

                <Col md={5} lg={4}>
                    {/* right */}

                    <SelectDatesAndGenerateCard
                        startDate={startDate}
                        endDate={endDate}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        handleGenerate={handleGenerate}
                        loading={loading}
                    />

                    <GoogleCalendarButton handleOpenCalendar={handleOpenCalendar}/>
                </Col>

                {loading && (
                    <div>
                        <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={loading}
                            /*onClick={handleClose}*/>
                            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                                <Card.Title style={{marginBottom: "25px"}}>Working on it..</Card.Title>
                                <Card.Body style={{marginBottom: "25px"}}>
                                    <div style={{marginBottom: "25px"}}>We are creating you study plan. This might take a minute or two.</div>
                                    <div>What is going on?
                                        <div> <ClipLoader color="#fff" loading={loading} size={10}/> We scan your Google Calendar.</div>
                                        <div> <ClipLoader color="#fff" loading={loading} size={10}/> We Fetch the latest data from Planning DB.</div>
                                        <div> <ClipLoader color="#fff" loading={loading} size={10}/> We Formulate the best study plan, just for you.</div>
                                    </div>
                                </Card.Body>
                                <ClipLoader color="#fff" loading={loading} size={100}/>
                            </div>
                        </Backdrop>
                    </div>
                )}

                {showModal && (
                    <FullDayEventsModalComponent
                        showModal={showModal}
                        handleCloseModal={handleCloseModal}
                        fullDayEvents={fullDayEvents}
                        handleDecision={handleDecision}
                    />
                )}
            </Row>
        </Container>
    );
};

export default GenerateCalendar;
