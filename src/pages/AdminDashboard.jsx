import React, { useEffect, useContext, useState } from "react";
import api from "../api/axiosBackendConfig";
import { UserContext } from "../context/UserContext";
import CourseItem from "../components/CourseItem";
import { Container, Row, Col, ListGroup, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

function AdminDashboardPage() {
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    api
      .get("/profile", {
        params: { sub: subjectID },
      })
      .then((response) => {
        console.log(response);
        if (!response.data.user.admin) {
          setIsUserAdmin(false);
          navigate("/");
          return;
        }
        setIsUserAdmin(true);
      });
  }, []);

  const [courses, setCourses] = useState(null);

  const { subjectID } = useContext(UserContext);
  useEffect(() => {
    if (isUserAdmin) {
      api
        .get("/admin/courses", { params: { sub: subjectID } })
        .then((response) => {
          console.log(response);
          setCourses(response.data.courses);
        });
    }
  }, [isUserAdmin]);

  const handleAddCourse = () => {
    navigate(`/admin/add-course`);
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h2>Course List</h2>
        </Col>
        <Col className="text-end add-course-btn-col">
          <Button variant="success" onClick={handleAddCourse}>
            Add Course
          </Button>
        </Col>
      </Row>
      {courses != null ? (
        <ListGroup className="mt-3">
          {courses.map((course) => (
            <CourseItem key={course.courseId} course={course} />
          ))}
        </ListGroup>
      ) : (
        <ClipLoader
          className="spinner"
          color="#29335c"
          loading={!courses}
          size={100}
        />
      )}
    </Container>
  );
}
export default AdminDashboardPage;
