import React from "react";
import ListGroup from "react-bootstrap/ListGroup";

function FullDayEventItem({ date, name, handleDecision }) {
  return (
    <ListGroup horizontal className="m-2">
      <ListGroup.Item>{name}</ListGroup.Item>
      <ListGroup.Item>{new Date(date).toLocaleDateString()}</ListGroup.Item>
      <ListGroup.Item>
        <input type="checkbox" onChange={() => handleDecision(date)} />
      </ListGroup.Item>
    </ListGroup>
  );
}

export default FullDayEventItem;
