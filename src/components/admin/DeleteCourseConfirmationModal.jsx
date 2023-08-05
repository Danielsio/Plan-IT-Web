import {Button, Card, Collapse, Modal} from "react-bootstrap";
import React from "react";
import CourseItem from "./CourseItem.jsx";
import {FiChevronDown, FiChevronUp} from "react-icons/fi";

function DeleteCourseConfirmationModal({courseId, courseName, showDeleteModal, handleCancelDelete, handleConfirmDelete}) {


    return (
        <Modal show={showDeleteModal} onHide={handleCancelDelete}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure you want to delete this course? </p>
                <p>{courseName} (ID:{courseId}) </p>
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
    );
    }

export default DeleteCourseConfirmationModal;