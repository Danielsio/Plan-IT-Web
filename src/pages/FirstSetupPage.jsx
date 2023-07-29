import { useState, useEffect, useContext } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  MenuItem,
  Stack,
  Grid,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { Form } from "react-bootstrap";
import api from "../api/axiosBackendConfig";
import { UserContext } from "../context/UserContext";
import { Container } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  ERROR_COULD_NOT_CONNECT_TO_SERVER_CODE, ERROR_USER_NOT_FOUND,
  NO_PROBLEM,
} from "../utill/Constants";

const ProgressStepper = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [preferences, setPreferences] = useState({
    userStudyStartTime: "08:00",
    userStudyEndTime: "22:00",
    userBreakTime: 30,
    studySessionTime: 120,
    studyOnWeekends: true,
  });

  const {
    subjectID,
    isAuthenticated,
    isAuthLoading,
    isCompletedFirstSetup,
    setIsCompletedFirstSetup,
    clearStateAndRedirect,
  } = useContext(UserContext);

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

  const differenceInMinutes = (startTime, endTime) => {
    const startTimeDate = new Date(`2022-01-01T${startTime}:00`);
    const endTimeDate = new Date(`2022-01-01T${endTime}:00`);
    return (endTimeDate - startTimeDate) / (1000 * 60);
  };

  const validateForm = () => {
    let isValid = true;
    const {
      userStudyStartTime,
      userStudyEndTime,
      studySessionTime,
      userBreakTime,
    } = preferences;
    if (
        !userStudyStartTime ||
        !userStudyEndTime ||
        !studySessionTime ||
        !userBreakTime
    ) {
      toast.error("Please fill out all fields");
      isValid = false;
    }

    const diffInMinutes = differenceInMinutes(
        userStudyStartTime,
        userStudyEndTime
    );

    if (studySessionTime < 60 || studySessionTime > 600) {
      toast.error("Session time should be between 60 and 600 minutes");
      isValid = false;
    }

    if (userBreakTime < 15 || userBreakTime > 120) {
      toast.error("Break time should be between 15 and 120 minutes");
      isValid = false;
    }
    console.log("dif =" + diffInMinutes + "session is : " + studySessionTime);

    if (diffInMinutes < studySessionTime) {
      toast.error(
          "The time between start time and end time should be greater than or equal to session time"
      );
      isValid = false;
    }

    return isValid;
  };

  useEffect(() => {
    if (activeStep === steps.length) {
      console.log(preferences);

      if (!validateForm()) {
        return;
      }

      convertUserPreferencesToBackendValues(preferences);
      console.log(preferences);

      api
        .post(
            "/profile",
            preferences,
            {
              params: {
                sub: subjectID,
              },
            }
        )
        .then((response) => {
          console.log(response);
          if (response.status === 200 && response.data.details === NO_PROBLEM) {
            toast.success("Your preferences have been saved.");
            setIsCompletedFirstSetup(true);
          } else {
            toast.error(
                "Service Unavailable. It looks that we have some problems right now. Please try again later."
            );
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.code === ERROR_COULD_NOT_CONNECT_TO_SERVER_CODE) {
            toast.error(
                "Service Unavailable. It looks that we have some problems right now. Please try again later."
            );
          } else {
            const problem = error.response.data.details;
            const status = error.response.status;
            if (status === 400 && problem === ERROR_USER_NOT_FOUND) {
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
    }
  }, [activeStep]);

  const steps = ["Day Study Time", "Session Study Time", "Weekends"];

  const stepDescription = {
    0: (
      <>
        <Typography sx={{ mt: 4, mb: 4, textAlign: "center" }}>
          Please enter your preferred study start and end times:
        </Typography>
        <Box sx={{ display: "block", justifyContent: "space-between" }}>
          <Box sx={{ width: "30%", margin: "auto" }}>
            <Form.Label htmlFor="userStudyStartTime">Study Start Time:</Form.Label>
            <Form.Control
                type="time"
                id="userStudyStartTime"
                value={preferences.userStudyStartTime}
                onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      userStudyStartTime: e.target.value,
                    })
                }
            />
            <Form.Text muted>
              Choose the time when you prefer to start your study sessions.
            </Form.Text>
          </Box>
          <Box sx={{ width: "30%", margin: "auto" }}>
            <Form.Label htmlFor="userStudyEndTime">Study End Time:</Form.Label>
            <Form.Control
                type="time"
                id="userStudyEndTime"
                value={preferences.userStudyEndTime}
                onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      userStudyEndTime: e.target.value,
                    })
                }
            />
            <Form.Text muted>
              Choose the time when you prefer to end your study sessions.
            </Form.Text>
          </Box>
        </Box>
      </>
    ),
    1: (
      <>
        <Typography sx={{ mt: 4, mb: 4, textAlign: "center" }}>
          Please enter your preferred study session and break times:
        </Typography>
        <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 2, md: 4 }}
            sx={{ maxWidth: 800, mx: "auto" }}
        >
          <FormControl sx={{ minWidth: 200, maxWidth: "50%" }}>
            <TextField
                select
                label="Select Study Session Time"
                id="studySessionTime"
                value={preferences.studySessionTime}
                onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      studySessionTime: e.target.value,
                    })
                }
            >
              {[60, 90, 120, 150, 180, 210, 240].map((value) => (
                  <MenuItem key={value} value={value}>
                    {value} minutes | {value / 60} Hours
                  </MenuItem>
              ))}
            </TextField>
            <Form.Text muted>
              Choose how long you prefer each study session to be. This is the time you will focus on your studies without interruptions.
            </Form.Text>
          </FormControl>
          <FormControl sx={{ minWidth: 200, maxWidth: "50%" }}>
            <TextField
                select
                label="Select Break Time"
                id="userBreakTime"
                value={preferences.userBreakTime}
                onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      userBreakTime: e.target.value,
                    })
                }
            >
              {[10, 15, 20, 25, 30, 40, 50, 60].map((value) => (
                  <MenuItem key={value} value={value}>
                    {value} minutes
                  </MenuItem>
              ))}
            </TextField>
            <Form.Text muted>
              Choose the duration of your break time between study sessions. Breaks are essential for staying refreshed and maintaining focus.
            </Form.Text>
          </FormControl>
        </Stack>
      </>
    ),
    2: (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography sx={{ mt: 4, mb: 4, textAlign: "center" }}>
            Please indicate your weekend study preferences:
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
              control={
                <Checkbox
                    checked={preferences.studyOnWeekends}
                    onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          studyOnWeekends: e.target.checked,
                        })
                    }
                    name="studyOnWeekends"
                />
              }
              label="I want to include weekends in my study schedule"
          />
        </Grid>
      </Grid>
    ),
  };

  const totalSteps = steps.length;
  const completedSteps = Object.keys(completed).length;
  const allStepsCompleted = completedSteps === totalSteps;

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleNext = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleReset = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (!isAuthLoading && !isCompletedFirstSetup && !isAuthenticated) {
      console.log("redirecting to home page");
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
      <Box sx={{ width: "50%", margin: "auto" }}>
        <Stepper activeStep={activeStep}>
          {steps.map((step, index) => (
              <Step key={step} completed={completed[index]}>
                <StepLabel>{step}</StepLabel>
              </Step>
          ))}
        </Stepper>
        <div>
          {allStepsCompleted ? (
            <>
              <Typography sx={{ mt: 2, mb: 1 }}>All Steps Completed</Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button variant="contained" onClick={handleReset}>
                  Reset
                </Button>
                <Button onClick={()=> navigate("/generate-calendar")} variant="contained" sx={{ ml: 2 }}>
                  Create Study Plan
                </Button>
              </Box>
            </>
          ) : (
            <>
              {stepDescription[activeStep]}
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Button
                    onClick={handleBack}
                    variant="contained"
                    disabled={activeStep === 0}
                    sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleNext} variant="contained">
                  {activeStep === totalSteps - 1 ? "Finish" : "Next"}
                </Button>
              </Box>
            </>
          )}
        </div>
      </Box>
  );
};

export default ProgressStepper;
