import React, { useEffect, useContext, useState } from "react";
import api from "../api/axiosBackendConfig";
import { UserContext } from "../context/UserContext";
import CourseItem from "../components/CourseItem";
import { Container, Row, Col, ListGroup, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

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
  const [isLoading, setIsLoading] = useState(true);

  const { subjectID } = useContext(UserContext);
  useEffect(() => {
    if (isUserAdmin) {
      api
        .get("/admin/courses", { params: { sub: subjectID } })
        .then((response) => {
          console.log(response);
          setIsLoading(false);
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
        <Col className="text-end">
          <Button variant="success" onClick={handleAddCourse}>
            Add Course
          </Button>
        </Col>
      </Row>
      {courses != null ? (
        <ListGroup className="mt-3">
          {courses.map((course) => (
            <CourseItem key={course.id} course={course} />
          ))}
        </ListGroup>
      ) : (
        <h3>No Courses Exist</h3>
      )}
    </Container>
  );
}
export default AdminDashboardPage;
