import { Button, Col, Row, Card } from "react-bootstrap";
import "../styles/ProfileCard.css";

const ProfileCard = ({
  name,
  email,
  picProfile,
  startTime,
  endTime,
  breakTime,
  SessionLength,
  studyOnHolidays,
  studyOnWeekends,
  onClick,
}) => {
  return (
    
   <>
    

    

    <Row>
        <Col sm={4}>
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
        <h3 className="card-title">{name}</h3>
        <h5 className="card-subtitle mb-2 text-muted">{email}</h5>

        

        
      </div>
    </div>
        </Col>

        <Col sm={8}>
          <div className="Profile-Card card">
            <div className="Preferences mt-2">
              <div className="card-body">
              <h3 className="card-title">Preferences</h3>
                <Row className="mb-2 row-preferences">
                  <Col xs={6}>
                    <h6 className="mb-0 title-in-preferences">Study Start Time:</h6>
                  </Col>
                  <Col xs={6}>
                    <h6 className="mb-0">{startTime}</h6>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col xs={6}>
                    <h6 className="mb-0 title-in-preferences">Study End Time:</h6>
                  </Col>
                  <Col xs={6}>
                    <h6 className="mb-0">{endTime}</h6>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col xs={6}>
                    <h6 className="mb-0 title-in-preferences">Break Time Size:</h6>
                  </Col>
                  <Col xs={6}>
                    <h6 className="mb-0">{breakTime} Minutes</h6>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col xs={6}>
                    <h6 className="mb-0 title-in-preferences">Study Session Size:</h6>
                  </Col>
                  <Col xs={6}>
                    <h6 className="mb-0">{SessionLength} Minutes</h6>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col xs={6}>
                    <h6 className="mb-0 title-in-preferences">Study On Holidays:</h6>
                  </Col>
                  <Col xs={6}>
                    <h6 className="mb-0">{studyOnHolidays ? "Yes" : "No"}</h6>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col xs={6}>
                    <h6 className="mb-0 title-in-preferences">Study On Weekends:</h6>
                  </Col>
                  <Col xs={6}>
                    <h6 className="mb-0">{studyOnWeekends ? "Yes" : "No"}</h6>
                  </Col>
                </Row>

                <Button
                  size="lg"
                  className="mt-2 edit-preference-btn mx-auto"
                  onClick={onClick}
                >
                  Edit Preferences
                </Button>
              </div>
              
    
            </div>
          </div>
        
        </Col>

      </Row>
   </>
  );
};

export default ProfileCard;
