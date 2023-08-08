import React from 'react';
import {Card, Button, Row, Col} from 'react-bootstrap';
import ExamItem from './Exam.jsx';
import {Skeleton} from "@mui/material";

const StudyPlanCard = ({loadingStudyDetails, studyPlan, handleReGenerate}) => {
    const studyPlanStartTimeAsString = studyPlan ?
        new Date(studyPlan.startDateTimeOfPlan).toLocaleDateString() :
        "";
    const studyPlanEndTimeAsString = studyPlan ?
        new Date(studyPlan.endDateTimeOfPlan).toLocaleDateString():
        "";

    return (
        <Card className="card-container generate-plan-card">
            <Card.Body>
                <Card.Title>Latest Generated Study Plan:</Card.Title>

                {loadingStudyDetails ? (
                    <>
                        <Skeleton variant="rounded" height={20} animation="wave"
                                  style={{width: "50%", display: "inline-block", margin: "0 20% 0 0"}}/>
                        <Skeleton variant="rounded" height={20} animation="wave"
                                  style={{width: "30%", display: "inline-block"}}/>
                        <Skeleton variant="rounded" height={20} animation="wave"
                                  style={{width: "50%", display: "inline-block", margin: "0 20% 0 0"}}/>
                        <Skeleton variant="rounded" height={20} animation="wave"
                                  style={{width: "30%", display: "inline-block"}}/>
                        <Skeleton variant="rounded" height={20} animation="wave"
                                  style={{width: "100%", display: "inline-block", margin: "0 100px 0 0"}}/>
                        <Skeleton variant="rounded" height={20} animation="wave"
                                  style={{width: "100%", display: "inline-block", margin: "0 100px 0 0"}}/>
                        <Skeleton variant="rounded" height={20} animation="wave"
                                  style={{width: "100%", display: "inline-block", margin: "0 100px 0 0"}}/>
                    </>
                ) : (
                    <>
                        {studyPlan ? (
                            <>
                                <div style={{marginBottom:"20px"}}>
                                    <div>
                                        <div className="container-of-from-to-plan">
                                            <div className="sub-text">From:</div>
                                            <div className="container-of-date-plan">
                                                {studyPlanStartTimeAsString}
                                            </div>
                                        </div>

                                        <div style={{padding:"10px", display:"inline-block", fontWeight:"bold"}}>{"--->"}</div>

                                        <div className="container-of-from-to-plan">
                                            <div className="sub-text">To:</div>
                                            <div className="container-of-date-plan">
                                                {studyPlanEndTimeAsString}
                                            </div>
                                        </div>
                                    </div>
                                </div>




                                <div style={{marginBottom: "25px"}}>
                                    <div style={{display: "inline-block", whiteSpace: "break-spaces"}} className="title-in-preferences">
                                        {studyPlan.totalNumberOfStudySessions}{" "}
                                    </div>
                                    <div style={{display: "inline-block"}} className="mb-0">
                                        study sessions were generated.
                                    </div>

                                </div>



                                <hr></hr>

                                {studyPlan ? (
                                    <>
                                        <Card.Title style={{ marginTop: "25px"}}>
                                            Recognized Exams:{" "}
                                        </Card.Title>
                                        <div style={{marginBottom: "25px"}}>
                                            {studyPlan.scannedExams.map((exam) => {
                                                return (
                                                    <ExamItem
                                                        courseName={exam.courseName}
                                                        dateTimeISO={exam.dateTimeISO}
                                                    />

                                                );
                                            })}
                                        </div>

                                        <hr></hr>

                                        <Card.Title style={{marginTop: "25px"}}>Any Changes To Your Calendar?</Card.Title>
                                        <div className="sub-text" style={{marginBottom: "10px"}}>The study plan between {studyPlanStartTimeAsString} and {studyPlanEndTimeAsString} will be refreshed.</div>
                                        <Button
                                            variant="warning"
                                            size="lg"
                                            onClick={handleReGenerate}
                                        >
                                            Re-Generate The Existing Plan
                                        </Button>
                                    </>
                                ) : (
                                    <div>No study plan found.</div>
                                )}
                            </>
                        ) : (
                            <div>No study plan found.</div>
                        )}
                    </>
                )}
            </Card.Body>
        </Card>
    );
};

export default StudyPlanCard;
