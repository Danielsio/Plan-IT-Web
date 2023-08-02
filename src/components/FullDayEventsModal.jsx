import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import FullDayEventItem from '../components/FullDayEventItem';

const FullDayEventsModalComponent = ({showModal, handleCloseModal, fullDayEvents, handleDecision}) => {
    return (
        <Modal show={showModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
            <Modal.Header>
                <Modal.Title>We Found Full Day Events !</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Please Choose:</h5>
                <ul>
                    {fullDayEvents.map((event) => (
                        <FullDayEventItem
                            key={event.start.date.value}
                            date={event.start.date.value}
                            name={event.summary}
                            handleDecision={handleDecision}
                        />
                    ))}
                </ul>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Continue Generate My Plan !
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FullDayEventsModalComponent;
