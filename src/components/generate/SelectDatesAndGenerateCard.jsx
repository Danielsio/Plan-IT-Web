import React from 'react';
import {Card, Button} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import ClipLoader from 'react-spinners/ClipLoader';

const SelectDatesCardComponent = ({startDate, endDate, setStartDate, setEndDate, handleGenerate, loading}) => {
    return (
        <Card className="card-container generate-plan-card select-dates-card">
            <Card.Body>
                <Card.Title>Generate A New Study Plan</Card.Title>

                <div className="sub-text" style={{marginBottom: "10px"}}>Select the beginning and the end of your study period.
                    A new study plan will be generated within those boundaries.</div>
                <div className="mb-3">
                    <label htmlFor="start-date-picker">Start date:</label>
                    <DatePicker
                        id="start-date-picker"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="end-date-picker">End date:</label>
                    <DatePicker
                        id="end-date-picker"
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        className="form-control"
                    />
                </div>
                <Button variant="primary" style={{width: "100%"}} size="lg" onClick={handleGenerate}>
                    Generate A New Plan
                </Button>

                {loading && (
                    <div className="row mt-3">
                        <div className="col-12 text-center">
                            <ClipLoader color="#29335c" loading={loading} size={50}/>
                        </div>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default SelectDatesCardComponent;
