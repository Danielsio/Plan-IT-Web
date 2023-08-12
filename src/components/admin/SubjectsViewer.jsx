import React from "react";
import {Form, Button} from "react-bootstrap";
import TextField from "@mui/material/TextField";

function SubjectViewer({courseSubjects, handleSubjectsChange, setCourse}) {
    return (
        <>
            { courseSubjects.map((subject, index) => (
            <Form.Group
                controlId={`formSubject${index}`}
                key={index}
                className="mt-3 mb-3"
            >
                <TextField
                    fullWidth
                    type="text"
                    label={`Subject #${index + 1}`}
                    id="outlined-size-normal"
                    defaultValue=""
                    value={subject}
                    onChange={(e) => handleSubjectsChange(e, index)}
                />
                {index >= 0 && (
                    <Button
                        variant="danger"
                        className="mt-2 btn-red-planit"
                        onClick={() =>
                            setCourse((prevCourse) => {
                                const updatedSubjects = [...prevCourse.courseSubjects];
                                updatedSubjects.splice(index, 1);
                                return {
                                    ...prevCourse,
                                    courseSubjects: updatedSubjects,
                                };
                            })
                        }
                    >
                        Remove This Subject
                    </Button>
                )}
            </Form.Group>
            )) }

            <Button
                variant="secondary"
                className="mt-2 mr-2 add-subject-btn btn-grey-planit"
                onClick={() =>
                    setCourse((prevCourse) => ({
                        ...prevCourse,
                        courseSubjects: [...prevCourse.courseSubjects, ""],
                    }))
                }
            >
                Add A Subject
            </Button>
        </>
    );
}

export default SubjectViewer;
