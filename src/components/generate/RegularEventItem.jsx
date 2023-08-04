import React from "react";
import {Col, Row} from "react-bootstrap";
import Box from "@mui/material/Box";

function EventDateTime({startTime, endTime}) {
    const dateOfStartTime = new Date(startTime.value);
    const dateOfEndTime = new Date(endTime.value);

    return (<>
        {dateOfStartTime.toLocaleDateString() !== dateOfEndTime.toLocaleDateString() ? (
            <div
                className="sub-text">{dateOfStartTime.toLocaleString()} - {dateOfEndTime.toLocaleString('he-IL', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            })}
            </div>
        ) : (
            <div
                className="sub-text"> {dateOfStartTime.toLocaleDateString()}, {dateOfStartTime.toLocaleTimeString('he-IL', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            })}-{dateOfEndTime.toLocaleTimeString('he-IL', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            })}
            </div>
        )
        }
    </>);
}

function NumberOfDaysAway({eventDate}) {
    const currentDate = new Date();

    currentDate.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);

    // To calculate the time difference of two dates
    const Difference_In_Time = eventDate.getTime() - currentDate.getTime();

    // To calculate the no. of days between two dates
    const Difference_In_Days = Math.ceil(Difference_In_Time / (1000 * 3600 * 24));


    return (<> {Difference_In_Days === 0 ? (
        <div className="sub-text">Today</div>
    ) : (Difference_In_Days === 1 ? (
            <div className="sub-text">Tomorrow</div>
        ) : (
            <div style={{textAlign: "center"}}>
                <div className="sub-text">{Difference_In_Days}</div>
                <div className="sub-text"> days away</div>
            </div>

        )
    )
    }
    </>);
}


function RegularEventItem({eventSummery, eventDescription, startTime, endTime, colorHexValue}) {
    const boxColorHexValue = colorHexValue === undefined ? '#4279d1' : colorHexValue;

    return (
        <Row>
            <Col style={{flexGrow: 0}}>
                <Box
                    sx={{
                        backgroundColor: boxColorHexValue
                    }}
                    style={{width: "4px", height: "100%"}}
                />
            </Col>
            <Col>
                <div className="mb-0 title-in-preferences">{eventSummery}</div>
                <EventDateTime startTime={startTime} endTime={endTime}></EventDateTime>
                <div>Subjects: {eventDescription}</div>
            </Col>
            <Col style={{maxWidth: "fit-content"}}>
                <NumberOfDaysAway eventDate={new Date(startTime.value)}></NumberOfDaysAway>
            </Col>
        </Row>


    );
}

export default RegularEventItem;
