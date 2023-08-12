import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import {Col, Row} from "react-bootstrap";
import Box from "@mui/material/Box";

function FullDayEventItem({date, name, handleDecision}) {
    return (
            <Row style={{margin: "15px"}}>
                <Col style={{flexGrow: 0}}>
                    <Box className="box-event-line"/>
                </Col>
                <Col>
                    <div className="mb-0 title-in-preferences">
                        {name}
                    </div>
                </Col>
                <Col className="generated-plan-value" style={{maxWidth: "fit-content"}}>
                    <div className="sub-text">
                        {new Date(date).toLocaleDateString()}
                    </div>
                </Col>
                <Col style={{maxWidth: "fit-content"}}>
                    <input type="checkbox" onChange={() => handleDecision(date)}/>
                </Col>
            </Row>
    );
}

export default FullDayEventItem;
