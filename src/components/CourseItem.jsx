import React, {useContext, useState} from "react";
import {Card, Button, Collapse, Modal} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {FiChevronDown, FiChevronUp} from "react-icons/fi"; // Import icons for Show More/Show Less
import "../styles/adminDashboard.css";
import api from "../api/axiosBackendConfig";
import {UserContext} from "../context/UserContext";
import {toast} from "react-toastify";


function CourseItem({course}) {
    const navigate = useNavigate();
    const [showDetails, setShowDetails] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const {subjectID} = useContext(UserContext);

    const handleEditClick = () => {
        navigate(`/admin/edit-course?id=${course.courseId}`);
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        api
            .delete(`/admin/courses/${course.courseId}`,
                {
                    params: {
                        sub: subjectID
                    }
                })
            .then(() => {
                setShowDeleteModal(false);
                toast.success("Successfully deleted Course :" + course.courseName)
            })
            .catch(() => {
                toast.error("Something Went Wrong. Please try Again later.")
            })
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    }


    return (
        <Card className="mb-3 course-item-card card-container">
            <Card.Body>
                <div className="d-flex align-items-center justify-content-between">
                    <Card.Title>{course.courseName}</Card.Title>
                    <Button variant="link" onClick={() => setShowDetails((prev) => !prev)}>
                        {showDetails ? (
                            <>
                                Show Less <FiChevronUp/> {/* Show icon for Show Less */}
                            </>
                        ) : (
                            <>
                                Show More <FiChevronDown/> {/* Show icon for Show More */}
                            </>
                        )}
                    </Button>
                </div>
                <Card.Text>Credits: {course.credits}</Card.Text>
                <Card.Text>Difficulty (1-10): {course.difficultyLevel}</Card.Text>

                {/* Additional details collapse */}
                <Collapse in={showDetails}>
                    <div>
                        <Card.Text>Recommended Study Time (Days): {course.recommendedStudyTime}</Card.Text>
                        <Card.Text>Subjects Practice Percentage: {course.subjectsPracticePercentage}%</Card.Text>
                        <div>
                            <Card.Text>Subjects:</Card.Text>
                            <ul style={{listStyleType: "none", margin: 0, padding: 0}}>
                                {course.courseSubjects.map((subject, index) => (
                                    <li key={index}>{`${index + 1}. ${subject}`}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </Collapse>

                {/* Edit and Delete buttons */}
                <div className="mt-2">
                    <Button variant="primary" className="me-2" onClick={handleEditClick}>
                        Edit Course Details
                    </Button>
                    <Button className="ml-2" variant="danger" onClick={handleDeleteClick}>
                        Delete Course</Button>
                </div>

                {/* Delete Confirmation Modal */}
                <Modal show={showDeleteModal} onHide={handleCancelDelete}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Deletion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this course?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCancelDelete}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleConfirmDelete}>
                            Yes, Delete This Course
                        </Button>
                    </Modal.Footer>
                </Modal>

            </Card.Body>
        </Card>
    );
}

export default CourseItem;
