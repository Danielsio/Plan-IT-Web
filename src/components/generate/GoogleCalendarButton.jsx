import {Button} from "react-bootstrap";
import React from "react";


const GoogleCalendarButton = ({handleOpenCalendar}) => {
    return <Button
        className="google-calendar-btn col-lg-3 mt-3"
        variant="secondary"
        size="lg"
        onClick={handleOpenCalendar}
    >
        <img
            className="mr-2 google-calendar-icon-btn"
            src="/Google_Calendar_icon.svg.png"
            alt=""
        />
        Open Google Calendar
    </Button>
}
export default GoogleCalendarButton