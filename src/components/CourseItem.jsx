import React from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/adminDashboard.css";

function CourseItem({ course }) {
  const navigate = useNavigate();

  const handleEditClick = () => {
    console.log(course);
    navigate(`/admin/edit-course?id=${course.courseId}`);
  };

  return (
    <Card className="mb-3 course-item-card card-container">
      <Card.Body>
        <Card.Title>{course.courseName}</Card.Title>
        <Card.Text>Credits: {course.credits}</Card.Text>
        <Card.Text>Difficulty (1-10): {course.difficultyLevel}</Card.Text>
        <Button variant="primary" className="me-2" onClick={handleEditClick}>
          Edit
        </Button>
        <Button variant="danger" className="ml-2">
          Delete
        </Button>
      </Card.Body>
    </Card>
  );
}

export default CourseItem;
