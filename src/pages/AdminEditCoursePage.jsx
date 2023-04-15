import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import api from "../api/axiosBackendConfig";
import { UserContext } from "../context/UserContext";
import { ClipLoader } from "react-spinners";

function EditCoursePage() {
  const location = useLocation();
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
        setCourse(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }

    getCourseDetails();
  }, [location.search]);

  const handleInputChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    setCourse({ ...course, [name]: value });
  };

  const handleSubjectsChange = (event) => {
    const subjectIndex = parseInt(event.target.name);
    const subjects = [...course.courseSubjects];
    subjects[subjectIndex] = event.target.value;

    setCourse({ ...course, courseSubjects: subjects });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await api.put(`/admin/courses`, course, {
        params: { sub: subjectID },
      });
      console.log(response.data);
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
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formCourseCredits">
          <Form.Label>Credits</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter course credits"
            value={course.credits}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formDifficultyLevel">
          <Form.Label>Difficulty Level</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter course difficulty level (1-10)"
            value={course.difficultyLevel}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formRecommendedStudyTime">
          <Form.Label>Recommended Study Time (in hours)</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter recommended study time"
            value={course.recommendedStudyTime}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formSubjectsPracticePercentage">
          <Form.Label>Subjects Practice Percentage</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter subjects practice percentage"
            value={course.subjectsPracticePercentage}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="formCourseSubjects">
          <Form.Label>Course Subjects</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter course subjects (comma separated)"
            value={course.courseSubjects}
            onChange={handleSubjectsChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-2">
          Save Changes
        </Button>
      </Form>
    </Container>
  );
}

export default EditCoursePage;
