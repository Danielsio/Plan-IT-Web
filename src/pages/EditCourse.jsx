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
        <Form.Group controlId="formCourseName">
          <Form.Label>Course Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter course name"
            value={course.courseName}
            name="courseName"
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
          <Form.Label>Difficulty Level (1-10)</Form.Label>
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
          <Form.Label>
            Subjects Practice Percentage (e.g for 60% type 60)
          </Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter subjects practice percentage"
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
          Cancel
        </Button>
        <Button variant="primary" type="submit" className="mt-2">
          Save Changes
        </Button>
      </Form>
    </Container>
  );
}

export default EditCourse;
