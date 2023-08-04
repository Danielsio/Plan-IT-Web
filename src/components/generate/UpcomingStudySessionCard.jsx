import React from 'react';
import {Card} from 'react-bootstrap';
import RegularEventItem from './RegularEventItem.jsx';
import {Skeleton} from "@mui/material";

const UpcomingStudySessionCard = ({loadingStudyDetails, upComingSession}) => {
    return (
        <Card className="card-container generate-plan-card">
            <Card.Body>
                <Card.Title>Upcoming Study Session:</Card.Title>
                {loadingStudyDetails ? (
                    <>
                        <Skeleton variant="rounded" height={20} animation="wave"
                                  style={{width: "20%", display: "inline-block", margin: "0 80% 0 0"}}/>
                        <Skeleton variant="rounded" height={20} animation="wave"
                                  style={{width: "100%", display: "inline-block", margin: "0 100px 0 0"}}/>
                    </>
                ) : (
                    <>
                        {upComingSession ? (
                            <RegularEventItem
                                eventSummery={upComingSession.courseName}
                                eventDescription={upComingSession.description}
                                startTime={upComingSession.start}
                                endTime={upComingSession.end}
                                colorHexValue={upComingSession.colorHexValue}
                            />
                        ) : (
                            <div>There are no sessions yet.</div>
                        )}
                    </>
                )}
            </Card.Body>
        </Card>
    );
};

export default UpcomingStudySessionCard;
