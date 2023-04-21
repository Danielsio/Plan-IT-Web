import { useState } from "react";
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
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { Form } from "react-bootstrap";

const ProgressStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});

  const [preferences, setPreferences] = useState({
    userStudyStartTime: "",
    userStudyEndTime: "",
    userBreakTime: 0,
    studySessionTime: 0,
    studyOnHolidays: false,
    studyOnWeekends: false,
  });

  const steps = ["Day Study Time", "Session Study Time", "Holidays & Weekends"];

  const stepDescription = {
    0: (
      <>
        <Typography>
          Please enter your preferred study start and end times:
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Form.Control
            type="time"
            value={preferences.userStudyStartTime}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                userStudyStartTime: e.target.value,
              })
            }
          />
          <Form.Control
            type="time"
            value={preferences.userStudyEndTime}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                userStudyEndTime: e.target.value,
              })
            }
          />
        </Box>
      </>
    ),
    1: (
      <>
        <Typography>
          Please enter your preferred study session and break times:
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <FormControl sx={{ minWidth: 120 }}>
            <TextField
              select
              label="Study Session Time"
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
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <TextField
              select
              label="Break Time"
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
          </FormControl>
        </Box>
      </>
    ),
    2: (
      <>
        <Typography>Please select the days you want to study:</Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={preferences.studyOnHolidays}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  studyOnHolidays: e.target.checked,
                })
              }
              name="studyOnHolidays"
            />
          }
          label="I Want To Study on Holidays"
        />
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
          label="I Want To Study on Weekends"
        />
      </>
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
    setActiveStep(0);
    setPreferences({
      userStudyStartTime: "",
      userStudyEndTime: "",
      userBreakTime: 0,
      studySessionTime: 0,
      studyOnHolidays: false,
      studyOnWeekends: false,
    });
    setCompleted({});
  };

  return (
    <Box sx={{ width: "100%" }}>
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
            </Box>
          </>
        ) : (
          <>
            <Typography sx={{ mt: 2, mb: 1 }}>
              {stepDescription[activeStep]}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                onClick={handleBack}
                variant="contained"
                disabled={activeStep === 0}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ żflex: "1 1 auto" }} />
              <Button onClick={handleNext} variant="contained">
                {completedSteps === totalSteps - 1 ? "Finish" : "Next"}
              </Button>
            </Box>
          </>
        )}
      </div>
    </Box>
  );
};

export default ProgressStepper;
