import React, { useState, useEffect, useContext } from "react";
import {
  Form,
  Button,
  Container,
  ToastContainer,
  Toast,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axiosBackendConfig";
import { UserContext } from "../context/UserContext";
import { ClipLoader } from "react-spinners";
import {
  NO_PROBLEM,
  ERROR_FULL_DAY_EVENTS,
  ERROR_NO_EXAMS_FOUND,
  TOAST_TONE_SUCCESS,
  TOAST_TONE_WARNING,
  TOAST_TONE_ERROR,
} from "../utill/Constants";

function EditCourse() {
  const location = useLocation();
  const navigate = useNavigate();
  const { subjectID } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastBackgroundColor, setToastBackgroundColor] = useState("");
  const [toastHeaderImgSrc, setToastHeaderImgSrc] = useState("");
  const [toastHeaderMainTitle, setToastHeaderMainTitle] = useState("");
  const [toastHeaderSubTitle, setToastHeaderSubTitle] = useState("");
  const [toastBodyMessage, setToastBodyMessage] = useState("");
  const [course, setCourse] = useState({
    courseName: "",
    credits: "",
    difficultyLevel: "",
    recommendedStudyTime: "",
    courseSubjects: [],
  });

  const handleInputChange = (event) => {
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
      const response = await api.post(`/admin/courses`, course, {
        params: { sub: subjectID },
      });
      console.log(response.data);
      if (response.data.succeed == true) {
        handleShowToast(
          TOAST_TONE_SUCCESS,
          "/favicon.ico",
          "Success!",
          "alert",
          "Course Updated Succefully."
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

  const handleShowToast = (
    tone,
    headerImgSrc,
    headerMainTitle,
    headerSubTitle,
    headerBodyMessage
  ) => {
    setToastBackgroundColor(tone);
    setToastHeaderImgSrc(headerImgSrc);
    setToastHeaderMainTitle(headerMainTitle);
    setToastHeaderSubTitle(headerSubTitle);
    setToastBodyMessage(headerBodyMessage);

    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  return (
    <Container className="my-5">
      <h1>Add New Course</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formCourseName">
          <Form.Label>Course Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter course name"
            name="courseName"
            value={course.courseName}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formCourseCredits">
          <Form.Label>Credits</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter course credits"
            value={course.credits}
            name="credits"
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formDifficultyLevel">
          <Form.Label>Difficulty Level</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter course difficulty level (1-10)"
            value={course.difficultyLevel}
            name="difficultyLevel"
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formRecommendedStudyTime">
          <Form.Label>Recommended Study Time (in days)</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter recommended study time"
            value={course.recommendedStudyTime}
            name="recommendedStudyTime"
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formSubjectsPracticePercentage">
          <Form.Label>Subjects Practice Percentage </Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter subjects practice percentage (e.g - for 60% type 60)"
            value={course.subjectsPracticePercentage}
            name="subjectsPracticePercentage"
            onChange={handleInputChange}
          />
        </Form.Group>

        {course.courseSubjects &&
          course.courseSubjects.map((subject, index) => (
            <Form.Group controlId={`formSubject${index}`} key={index}>
              <Form.Label>Subject {index + 1}</Form.Label>
              <Form.Control
                type="text"
                placeholder={`Enter subject ${index + 1}`}
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
                      return { ...prevCourse, courseSubjects: updatedSubjects };
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
          className="mt-2 mr-2"
          onClick={() =>
            setCourse((prevCourse) => ({
              ...prevCourse,
              courseSubjects: [...prevCourse.courseSubjects, ""],
            }))
          }
        >
          Add Subject
        </Button>
        <Button
          variant="secondary"
          className="mt-2 mr-2"
          onClick={handleCancel}
        >
          Go Back
        </Button>
        <Button variant="primary" type="submit" className="mt-2">
          Save Changes
        </Button>
      </Form>
      {showToast && (
        <ToastContainer className="p-3 toast-container">
          <Toast
            className={`toast-card toast-card-${toastBackgroundColor}`}
            onClose={handleCloseToast}
            position="top-start"
          >
            <Toast.Header>
              <img
                src={toastHeaderImgSrc}
                className="rounded mr-2 toast-card-header-icon"
                alt=""
              />
              <strong className="mr-auto">{toastHeaderMainTitle}</strong>
              <small className="mr-2 text-muted">{toastHeaderSubTitle}</small>
            </Toast.Header>
            <Toast.Body>{toastBodyMessage}</Toast.Body>
          </Toast>
        </ToastContainer>
      )}
    </Container>
  );
}

export default EditCourse;
