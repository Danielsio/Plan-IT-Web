import {Button, Modal} from "react-bootstrap";
import React from "react";

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
                <Button className="btn-grey-planit" variant="secondary" onClick={handleCancelDelete}>
                    Cancel
                </Button>
                <Button variant="danger" className="btn-red-planit" onClick={handleConfirmDelete}>
                    Yes, Delete This Course
                </Button>
            </Modal.Footer>
        </Modal>
    );
    }

export default DeleteCourseConfirmationModal;