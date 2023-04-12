import React from "react";
import { Row, Col } from "react-bootstrap";

// <div>
//   <h4>{courseName}</h4>
//   <h6>{new Date(dateTimeISO).toLocaleDateString()}</h6>
// </div>

function Exam({ courseName, dateTimeISO }) {
  return (
    <Row className="mb-2 row-preferences">
      <Col xs={6}>
        <h6 className="mb-0 title-in-preferences">{courseName}</h6>
      </Col>
      <Col xs={6}>
        <h6 className="mb-0 generated-plan-value">
          {new Date(dateTimeISO).toLocaleDateString()}
        </h6>
      </Col>
    </Row>
  );
}

export default Exam;
