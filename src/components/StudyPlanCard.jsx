import React from 'react';
import {Card, Button, Row, Col} from 'react-bootstrap';
import ExamItem from '../components/Exam';
import {Skeleton} from "@mui/material";

const StudyPlanCard = ({loadingStudyDetails, studyPlan, handleReGenerate}) => {
    return (
        <Card className="card-container generate-plan-card">
            <Card.Body>
                <Card.Title>Generated Study Plan:</Card.Title>

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
                                {studyPlan ? (
                                    <>
                                        <div className="title-in-preferences">
                                            Scanned Exams:{" "}
                                            <ul>
                                                {studyPlan.scannedExams.map((exam) => {
                                                    return (
                                                        <li key={exam.dateTimeISO}>
                                                            <ExamItem
                                                                courseName={exam.courseName}
                                                                dateTimeISO={exam.dateTimeISO}
                                                            />
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                        <hr></hr>
                                        <Row className="mb-2 row-preferences">
                                            <Col xs={6}>
                                                <h6 className="mb-0 title-in-preferences">
                                                    Start Date Time of Plan:
                                                </h6>
                                            </Col>
                                            <Col xs={6}>
                                                <h6 className="mb-0 generated-plan-value">
                                                    {new Date(
                                                        studyPlan.startDateTimeOfPlan
                                                    ).toLocaleDateString()}
                                                </h6>
                                            </Col>
                                        </Row>
                                        <Row className="mb-2 row-preferences">
                                            <Col xs={6}>
                                                <h6 className="mb-0 title-in-preferences">
                                                    End Date Time of Plan:
                                                </h6>
                                            </Col>
                                            <Col xs={6}>
                                                <h6 className="mb-0 generated-plan-value">
                                                    {new Date(
                                                        studyPlan.endDateTimeOfPlan
                                                    ).toLocaleDateString()}
                                                </h6>
                                            </Col>
                                        </Row>
                                        <Row className="mb-2">
                                            <Col xs={6}>
                                                <h6 className="mb-0 title-in-preferences">
                                                    Total Number of Study Sessions:
                                                </h6>
                                            </Col>
                                            <Col xs={6}>
                                                <h6 className="mb-0 generated-plan-value">
                                                    {studyPlan.totalNumberOfStudySessions}
                                                </h6>
                                            </Col>
                                        </Row>

                                        <Button
                                            className="mt-3"
                                            variant="warning"
                                            size="lg"
                                            onClick={handleReGenerate}
                                        >
                                            Re-Generate Existing Plan
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
