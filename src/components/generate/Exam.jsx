import React from "react";
import {Row, Col} from "react-bootstrap";
import Box from "@mui/material/Box";

function ExamItem({courseName, dateTimeISO}) {
    return (

        <Row style={{marginBottom:"10px"}}>
            <Col style={{flexGrow: 0}}>
                <Box className="box-event-line"/>
            </Col>
            <Col>
                <div className="mb-0 title-in-preferences">
                    {courseName}
                </div>
            </Col>
            <Col className="generated-plan-value" style={{maxWidth: "fit-content"}}>
                <div className="sub-text">
                    {new Date(dateTimeISO).toLocaleDateString()}
                </div>
            </Col>
        </Row>

    );
}

export default ExamItem;
