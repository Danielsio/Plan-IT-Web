import React, { useState, useEffect, useContext } from "react";
import {
  Form,
  Button,
  Container,
  ToastContainer,
  Toast,
  Card,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axiosBackendConfig";
import { UserContext } from "../context/UserContext";
import { ClipLoader } from "react-spinners";
import {
  NO_PROBLEM,
  ERROR_FULL_DAY_EVENTS,
  ERROR_NO_EXAMS_FOUND,
} from "../utill/Constants";
import { toast } from "react-toastify";
import "../styles/adminDashboard.css";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Slider from "@mui/material/Slider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import MuiInput from "@mui/material/Input";
import VolumeUp from "@mui/icons-material/VolumeUp";
import { styled } from "@mui/material/styles";

function EditCourse() {
  const location = useLocation();
  const navigate = useNavigate();
  const { subjectID } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState({
    courseName: "",
    credits: "",
    difficultyLevel: "",
    recommendedStudyTime: "",
    courseSubjects: [],
  });

  useEffect(() => {
    async function getCourseDetails() {
      const courseId = new URLSearchParams(location.search).get("id");
      console.log(courseId);
      try {
        const response = await api.get(`/admin/course`, {
          params: { sub: subjectID, courseId },
        });
        setCourse(response.data.courses[0]);
        console.log(response.data.courses[0]);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }

    getCourseDetails();
  }, [location.search]);

  const handleInputChange = (event) => {
    console.log(event);
    const target = event.target;
    const name = target.name;
    const value = target.value;

    setCourse({ ...course, [name]: value });
  };

  const handleSubjectsChange = (e, index) => {
    const { value } = e.target;
    setCourse((prevCourse) => {
      const updatedSubjects = [...prevCourse.courseSubjects];
      updatedSubjects[index] = value;
      return { ...prevCourse, courseSubjects: updatedSubjects };
    });
  };

  const handleCancel = () => {
    navigate("/admin");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await api.put(`/admin/courses`, course, {
        params: { sub: subjectID },
      });
      console.log(response.data);
      if (response.data.succeed == true) {
        toast.success(
          `Success! The Course ${course.courseName} Has Updated Succefully.`
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <ClipLoader
        className="spinner"
        color="#29335c"
        loading={loading}
        size={100}
      />
    );
  }

  return (
    <Container className="my-5">
      <h1>Edit Course</h1>
      <Form onSubmit={handleSubmit}>
        <Card className="card-container">
          <Form.Group controlId="formCourseName">
            <TextField
              className="mt-2 mb-2"
              fullWidth
              type="text"
              label="Course Name"
              id="outlined-size-normal"
              name="courseName"
              defaultValue=""
              value={course.courseName}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formCourseCredits">
            <FormControl fullWidth className="mt-2 mb-2">
              <InputLabel id="demo-simple-select-label">Credits</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={course.credits}
                label="Credits"
                name="credits"
                onChange={handleInputChange}
              >
                <MenuItem value={1}>one</MenuItem>
                <MenuItem value={2}>two</MenuItem>
                <MenuItem value={3}>three</MenuItem>
                <MenuItem value={4}>four</MenuItem>
                <MenuItem value={5}>five</MenuItem>
                <MenuItem value={6}>six</MenuItem>
                <MenuItem value={7}>seven</MenuItem>
              </Select>
            </FormControl>
          </Form.Group>

          <Form.Group controlId="formDifficultyLevel">
            <FormControl fullWidth className="mt-2 mb-2">
              <InputLabel id="demo-simple-select-label">
                Difficulty Level
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={course.difficultyLevel}
                label="Difficulty Level"
                name="difficultyLevel"
                onChange={handleInputChange}
              >
                <MenuItem value={1}>one</MenuItem>
                <MenuItem value={2}>two</MenuItem>
                <MenuItem value={3}>three</MenuItem>
                <MenuItem value={4}>four</MenuItem>
                <MenuItem value={5}>five</MenuItem>
                <MenuItem value={6}>six</MenuItem>
                <MenuItem value={7}>seven</MenuItem>
                <MenuItem value={8}>eight</MenuItem>
                <MenuItem value={9}>nine</MenuItem>
                <MenuItem value={10}>ten</MenuItem>
              </Select>
            </FormControl>
          </Form.Group>

          <Form.Group controlId="formRecommendedStudyTime">
            <TextField
              className="mt-2 mb-2"
              fullWidth
              id="outlined-number"
              label="Recommended Study Time (in days)"
              type="number"
              value={course.recommendedStudyTime}
              name="recommendedStudyTime"
              onChange={handleInputChange}
              inputProps={{
                step: 1,
                min: 1,
                max: 30,
                type: "number",
              }}
            />
          </Form.Group>

          <Form.Group controlId="formSubjectsPracticePercentage">
            <Box sx={{ width: 250 }} className="mt-2 mb-2">
              <Typography id="input-slider" gutterBottom>
                Subjects Practice Percentage:
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                  <Slider
                    aria-label="Subjects Practice Percentage "
                    defaultValue={30}
                    getAriaValueText={valuetext}
                    name="subjectsPracticePercentage"
                    valueLabelDisplay="off"
                    step={10}
                    marks
                    min={10}
                    max={100}
                    value={course.subjectsPracticePercentage}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item>
                  <Typography size="small">
                    {course.subjectsPracticePercentage}%
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Form.Group>

          {course.courseSubjects &&
            course.courseSubjects.map((subject, index) => (
              <Form.Group
                controlId={`formSubject${index}`}
                key={index}
                className="mt-3 mb-3"
              >
                <TextField
                  fullWidth
                  type="text"
                  label={`Subject #${index + 1}`}
                  id="outlined-size-normal"
                  defaultValue=""
                  value={subject}
                  onChange={(e) => handleSubjectsChange(e, index)}
                />
                {index >= 0 && (
                  <Button
                    variant="danger"
                    className="mt-2"
                    onClick={() =>
                      setCourse((prevCourse) => {
                        const updatedSubjects = [...prevCourse.courseSubjects];
                        updatedSubjects.splice(index, 1);
                        return {
                          ...prevCourse,
                          courseSubjects: updatedSubjects,
                        };
                      })
                    }
                  >
                    Remove Subject
                  </Button>
                )}
              </Form.Group>
            ))}
          <Button
            variant="secondary"
            className="mt-2 mr-2 add-subject-btn"
            onClick={() =>
              setCourse((prevCourse) => ({
                ...prevCourse,
                courseSubjects: [...prevCourse.courseSubjects, ""],
              }))
            }
          >
            Add Subject
          </Button>
        </Card>
        <Button
          variant="secondary"
          className="mt-2 mr-2"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button variant="primary" type="submit" className="mt-2">
          Save Changes
        </Button>
      </Form>
    </Container>
  );
}

function valuetext(value) {
  return "${value}%";
}

export default EditCourse;
