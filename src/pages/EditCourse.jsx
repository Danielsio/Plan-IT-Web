import React, {useState, useEffect, useContext} from "react";
import {
    Form,
    Button,
    Container,
    Card,
} from "react-bootstrap";
import {useLocation, useNavigate} from "react-router-dom";
import api from "../api/axiosBackendConfig";
import {UserContext} from "../context/UserContext";
import {ClipLoader} from "react-spinners";
import {
    NO_PROBLEM,
    ERROR_COULD_NOT_CONNECT_TO_SERVER_CODE,
    ERROR_COURSE_NOT_FOUND, ERROR_UNAUTHORIZED_USER, ERROR_USER_NOT_FOUND,
} from "../utill/Constants";
import {toast} from "react-toastify";
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
import PageHeader from "../components/common/PageHeader.jsx";
import SubjectViewer from "../components/admin/SubjectsViewer.jsx";

export const validateCourseDetails = (isValid, course) => {

    if (course.courseName.trim() === "") {
        toast.error("Please Enter Course Name !");
        isValid = false; // Name field is empty
    }

    if (course.credits < 1 || course.credits > 7) {
        toast.error("Please Enter credits between 1-7 !");
        isValid = false; // Credits field is invalid
    }

    if (course.difficultyLevel < 1 || course.difficultyLevel > 10) {
        toast.error("Please Enter difficultyLevel between 1-10 !");
        isValid = false; // Difficulty field is invalid
    }

    if (course.recommendedStudyTime < 1 || course.recommendedStudyTime > 30) {
        toast.error("Please Enter recommended Study Time between 1-30 !");
        isValid = false; // Study time field is invalid
    }

    if (
        course.subjectsPracticePercentage < 10 ||
        course.subjectsPracticePercentage > 100
    ) {
        toast.error("Please Enter subjects Practice Percentage between 10-100 !");
        isValid = false; // Study time field is invalid
    }

    if (
        course.courseSubjects.length > 0 &&
        course.courseSubjects.some((subject) => subject.trim() === "")
    ) {
        toast.error("Dont leave empty subjects please !");
        isValid = false; // Subjects field contains an empty string
    }

    return isValid; // All fields are valid
}

function EditCourse() {
    const location = useLocation();
    const navigate = useNavigate();
    const {subjectID, clearStateAndRedirect} = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState({
        courseName: "",
        credits: "",
        difficultyLevel: "",
        recommendedStudyTime: "",
        courseSubjects: [],
    });

    const validateForm = () => {
        console.log(course);

        let isValid;

        isValid = validateCourseDetails(course);
        console.log(course);

        return isValid;

    };
    
    useEffect(() => {
        async function getCourseDetails() {
            const courseId = new URLSearchParams(location.search).get("id");
            console.log(courseId);
            try {
                const response = await api.get(`/admin/courses/${courseId}`, {
                    params: {sub: subjectID},
                });
                if (response.status === 200 && response.data.details === NO_PROBLEM) {
                    setCourse(response.data.courses[0]);
                    console.log(response.data.courses[0]);
                } else {
                    toast.error(
                        "Service Unavailable. It looks that we have some problems right now. Please try again later."
                    );
                }

                setLoading(false);
            } catch (error) {
                console.error(error);

                if (error.code === ERROR_COULD_NOT_CONNECT_TO_SERVER_CODE) {
                    toast.error(
                        "Service Unavailable. It looks that we have some problems right now. Please try again later."
                    );
                } else {
                    const problem = error.response.data.details;
                    const status = error.response.status;
                    if (
                        status === 400 &&
                        error.response.data.succeed === false &&
                        problem === ERROR_COURSE_NOT_FOUND
                    ) {
                        toast.warn(
                            `The course ${course.courseName} is not in the our services.`
                        );
                    } else if (status === 401 && problem === ERROR_UNAUTHORIZED_USER) {
                        toast.warn(
                            "Your cannot perform this operation. Refering to your home page."
                        );
                    } else if (status === 400 && problem === ERROR_USER_NOT_FOUND) {
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
            }
        }

        getCourseDetails();
    }, [location.search]);

    const handleInputChange = (event) => {
        console.log(event);
        const target = event.target;
        const name = target.name;
        const value = target.value;

        setCourse({...course, [name]: value});
    };

    const handleSubjectsChange = (e, index) => {
        const {value} = e.target;
        setCourse((prevCourse) => {
            const updatedSubjects = [...prevCourse.courseSubjects];
            updatedSubjects[index] = value;
            return {...prevCourse, courseSubjects: updatedSubjects};
        });
    };

    const handleCancel = () => {
        navigate("/admin/courses-dashboard");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await api.put(`/admin/courses`, course, {
                params: {sub: subjectID},
            });
            console.log(response.data);
            if (response.data.succeed == true) {
                toast.success(
                    `Success! The Course ${course.courseName} Has Updated Succefully.`
                );
            } else {
                toast.error(
                    "Service Unavailable. It looks that we have some problems right now. Please try again later."
                );
            }
        } catch (error) {
            console.error(error);

            if (error.code === ERROR_COULD_NOT_CONNECT_TO_SERVER_CODE) {
                toast.error(
                    "Service Unavailable. It looks that we have some problems right now. Please try again later."
                );
            } else {
                const problem = error.response.data.details;
                const status = error.response.status;
                if (
                    status === 400 &&
                    error.response.data.succeed === false &&
                    problem === ERROR_COURSE_NOT_FOUND
                ) {
                    toast.warn(`The course ${course.courseName} is not in our services.`);
                } else if (status === 401 && problem === ERROR_UNAUTHORIZED_USER) {
                    toast.warn(
                        "Your cannot perform this operation. Referring to your home page."
                    );
                } else if (status === 400 && problem === ERROR_USER_NOT_FOUND) {
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
        <Container>
            <PageHeader pageTitle={"Edit Course"}> </PageHeader>
            <Form onSubmit={handleSubmit}>
                <Card className="card-container">

                    <div className="mb-2 sub-text">Course ID: {course.courseId}</div>

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
                        <Box sx={{width: 250}} className="mt-2 mb-2">
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
                        <SubjectViewer courseSubjects={course.courseSubjects} handleSubjectsChange={handleSubjectsChange} setCourse={setCourse}> </SubjectViewer>
                    }
                </Card>
                <Button
                    variant="secondary"
                    className="mt-2 mr-2"
                    style={{marginBottom:"20px"}}
                    onClick={handleCancel}
                >
                    Cancel
                </Button>
                <Button variant="primary"
                        type="submit"
                        className="mt-2"
                        style={{marginBottom:"20px"}}>
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
