import React, {useContext, useState} from "react";
import {Card, Button, Collapse, Modal} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {FiChevronDown, FiChevronUp} from "react-icons/fi"; // Import icons for Show More/Show Less
import "../../styles/adminDashboard.css";
import api from "../../api/axiosBackendConfig.js";
import {UserContext} from "../../context/UserContext.jsx";
import {toast} from "react-toastify";
import DeleteCourseConfirmationModal from "./DeleteCourseConfirmationModal.jsx";
import ShowMoreLessButton from "./ShowMoreLessButton.jsx";


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
                    <ShowMoreLessButton showDetails={showDetails} setShowDetails={setShowDetails}> </ShowMoreLessButton>
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
                            <div>
                                <ul style={{listStyleType: "none", margin: 0, padding: 0}}>
                                    {course.courseSubjects.map((subject, index) => (
                                        <li key={index}>{`${index + 1}. ${subject}`}</li>
                                    ))}
                                </ul>
                            </div>

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
                <DeleteCourseConfirmationModal showDeleteModal={showDeleteModal}
                                               handleCancelDelete={handleCancelDelete}
                                               handleConfirmDelete={handleConfirmDelete}>
                </DeleteCourseConfirmationModal>

            </Card.Body>
        </Card>
    );
}

export default CourseItem;
