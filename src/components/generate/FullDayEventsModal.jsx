import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import FullDayEventItem from './FullDayEventItem.jsx';

const FullDayEventsModalComponent = ({showModal, handleCloseModal, fullDayEvents, handleDecision}) => {
    return (
        <Modal show={showModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
            <Modal.Header>
                <Modal.Title>Decide on full-day events and holidays</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>The following events are full-day events from your calendars, or holidays occurring within the selected dates.</div>
                <div>You need to specify on which of those you are willing to study.</div>
                <div>Mark all the days, where you <div style={{display: "inline-block", fontWeight: "bold"}}>do</div> want to study in:</div>
                <div>
                    {fullDayEvents.map((event) => (
                        <FullDayEventItem
                            key={event.start.date.value}
                            date={event.start.date.value}
                            name={event.summary}
                            handleDecision={handleDecision}
                        />
                    ))}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button className="btn-grey-planit" variant="secondary" onClick={handleCloseModal}>
                    Continue Generate My Plan !
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FullDayEventsModalComponent;
