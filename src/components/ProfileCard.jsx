import { Button } from "react-bootstrap";
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
    <div className="Profile-Card">
      <div className="upper-container">
        <div className="image-container">
          <img
            src={picProfile}
            alt="profile Pic"
            height="100px"
            width="100px"
          />
        </div>
      </div>
      <div className="lower_container">
        <h3>Name: {name}</h3>
        <h4>Email: {email}</h4>
        <div className="Preferences mt-2">
          <h4 className="mb-2">Preferences:</h4>
          <h6>Study Start Time: {startTime} </h6>
          <h6>Study End Time: {endTime}</h6>
          <h6>Break Time Size: {breakTime} Minutes</h6>
          <h6>Study Session Size: {SessionLength} Minutes</h6>
          <h6>Study On Holidays: {StudyOnHolidays ? "Yes" : "No"}</h6>
          <h6>Study On Weekends: {studyOnWeekends ? "Yes" : "No"}</h6>
        </div>
        <Button className="mt-2" onClick={onClick}>
          Edit Preferences
        </Button>
      </div>
    </div>
  );
};

export default ProfileCard;
