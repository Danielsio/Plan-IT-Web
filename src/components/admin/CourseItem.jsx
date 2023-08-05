import React, {useContext, useState} from "react";
import {Card, Button, Collapse, Col, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

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
                <Row className="d-flex justify-content-between">
                    <Col>
                        <Card.Title className="mb-0">{course.courseName}</Card.Title>
                        <div className="sub-text">Course ID: {course.courseId}</div>
                    </Col>
                    <Col style={{textAlign: "end"}}>
                        {/* Edit and Delete buttons */}
                                <Button variant="primary" className="me-2 mb-2" onClick={handleEditClick}>
                                    Edit Course Details
                                </Button>
                                <Button className="ml-2 mb-2" variant="danger" onClick={handleDeleteClick}>
                                    Delete Course
                                </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <hr className="hr-title-hr"/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card.Text className="mb-0">Credits</Card.Text>
                    </Col>
                    <Col>
                        <Card.Text className="mb-0 col-course-value">{course.credits}</Card.Text>
                    </Col>

                </Row>
                <Row>
                    <Col>
                        <hr className="hr-regular-hr"/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card.Text className="mb-0">Difficulty (1-10) </Card.Text>
                    </Col>
                    <Col>
                        <Card.Text className="mb-0 col-course-value">{course.difficultyLevel}</Card.Text>
                    </Col>
                </Row>
                {/* Additional details collapse */}
                <Collapse in={showDetails}>
                    <div>
                        <Row>
                            <Col>
                                <hr className="hr-regular-hr"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Card.Text className="mb-0">Recommended Study Time (Days)</Card.Text>
                            </Col>
                            <Col>
                                <Card.Text className="mb-0 col-course-value">{course.recommendedStudyTime}</Card.Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <hr className="hr-regular-hr"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Card.Text className="mb-0">Subjects Practice Percentage </Card.Text>
                            </Col>
                            <Col>
                                <Card.Text className="mb-0 col-course-value">{course.subjectsPracticePercentage}%</Card.Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <hr className="hr-regular-hr"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Card.Text style={{marginBottom:"0.5rem"}}>Subjects:</Card.Text>
                                <div style={{paddingLeft: "25px"}}>
                                    <ul style={{listStyleType: "none", margin: 0, padding: 0}}>
                                        {course.courseSubjects.map((subject, index) => (
                                            <li key={index}>{`${index + 1}. ${subject}`}</li>
                                        ))}
                                    </ul>
                                </div>

                            </Col>
                        </Row>
                    </div>
                </Collapse>


                <ShowMoreLessButton showDetails={showDetails} setShowDetails={setShowDetails}> </ShowMoreLessButton>

                {/* Delete Confirmation Modal */}
                <DeleteCourseConfirmationModal courseId={course.courseId}
                                               courseName={course.courseName}
                                               showDeleteModal={showDeleteModal}
                                               handleCancelDelete={handleCancelDelete}
                                               handleConfirmDelete={handleConfirmDelete}>
                </DeleteCourseConfirmationModal>

            </Card.Body>
        </Card>
    );
}

export default CourseItem;
