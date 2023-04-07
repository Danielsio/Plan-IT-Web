import { Button, Col, Row } from "react-bootstrap";
import "../styles/ProfileCard.css";

const ProfileCard = ({
  name,
  email,
  picProfile,
  startTime,
  endTime,
  breakTime,
  SessionLength,
  StudyOnHolidays,
  studyOnWeekends,
  onClick,
}) => {
  return (
    <div className="Profile-Card card">
      <div className="upper-container card-body">
        <div className="image-container d-flex justify-content-center">
          <img
            src={picProfile}
            alt="profile Pic"
            height="100px"
            width="100px"
          />
        </div>
      </div>

      <div className="lower-container card-body">
        <h3 className="card-title">Name: {name}</h3>
        <h4 className="card-subtitle mb-2 text-muted">Email: {email}</h4>
        <div className="Preferences mt-2">
          <h4 className="text-center mb-3">Preferences:</h4>
          <Row className="mb-2">
            <Col xs={6}>
              <h6 className="mb-0">Study Start Time:</h6>
            </Col>
            <Col xs={6}>
              <h6 className="mb-0">{startTime}</h6>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col xs={6}>
              <h6 className="mb-0">Study End Time:</h6>
            </Col>
            <Col xs={6}>
              <h6 className="mb-0">{endTime}</h6>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col xs={6}>
              <h6 className="mb-0">Break Time Size:</h6>
            </Col>
            <Col xs={6}>
              <h6 className="mb-0">{breakTime} Minutes</h6>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col xs={6}>
              <h6 className="mb-0">Study Session Size:</h6>
            </Col>
            <Col xs={6}>
              <h6 className="mb-0">{SessionLength} Minutes</h6>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col xs={6}>
              <h6 className="mb-0">Study On Holidays:</h6>
            </Col>
            <Col xs={6}>
              <h6 className="mb-0">{StudyOnHolidays ? "Yes" : "No"}</h6>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col xs={6}>
              <h6 className="mb-0">Study On Weekends:</h6>
            </Col>
            <Col xs={6}>
              <h6 className="mb-0">{studyOnWeekends ? "Yes" : "No"}</h6>
            </Col>
          </Row>
        </div>

        <Button
          size="lg"
          className="mt-2 edit-preference-btn mx-auto"
          onClick={onClick}
        >
          Edit Preferences
        </Button>
      </div>
    </div>
  );
};

export default ProfileCard;
