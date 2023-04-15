import React from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function CourseItem({ course }) {
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate(`/admin/edit-course?id=${course.id}`);
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{course.courseName}</Card.Title>
        <Card.Text>Credits: {course.credits}</Card.Text>
        <Card.Text>Difficulty (1-10): {course.difficultyLevel}</Card.Text>
        <Button variant="primary" className="me-2" onClick={handleEditClick}>
          Edit
        </Button>
        <Button variant="danger">Delete</Button>
      </Card.Body>
    </Card>
  );
}

export default CourseItem;
