import React from "react";

function Exam({ courseName, dateTimeISO}) {
  return (
    <div>
      <h4>{courseName}</h4>
      <h6>{new Date(dateTimeISO).toLocaleDateString()}</h6>
    </div>
  );
}

export default Exam;
