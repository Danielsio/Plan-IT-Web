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
  COURSE_ALREDY_EXISTS,
} from "../utill/Constants";
import { toast } from "react-toastify";

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
    subjectsPracticePercentage: "",
    courseSubjects: [],
  });

  const validateForm = () => {
    console.log(course);

    let isValid = true;

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
  };

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

    if (!validateForm()) {
      return;
    }

    try {
      const response = await api.post(`/admin/courses`, course, {
        params: { sub: subjectID },
      });
      console.log(response.data);
      if (
        response.status === 201 &&
        response.data.succeed === true &&
        response.data.details === NO_PROBLEM
      ) {
        toast.success(
          `Success! The Course ${course.courseName} Has Added Succefully.`
        );
      }
    } catch (error) {
      console.error(error);

      if (
        error.response.status === 400 &&
        error.response.data.succeed === false &&
        error.response.data.details === COURSE_ALREDY_EXISTS
      ) {
        toast.warn(`The course ${course.courseName} already exists.`);
      } else {
        toast.error(
          "Service UnAvailable. It looks that we have some problems right now. Please try again later."
        );
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
    </Container>
  );
}

export default EditCourse;
