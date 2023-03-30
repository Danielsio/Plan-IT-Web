import React from "react";
import Card from "react-bootstrap/Card";

const About = () => {
  return (
    <Card
      className="mx-auto mt-5 p-4"
      style={{
        width: "50%",
        border: "1px solid #dcdcdc",
        boxShadow: "0px 0px 10px #dcdcdc",
      }}
    >
      <Card.Body>
        <Card.Title>PlanIT</Card.Title>
        <Card.Text>
          A company that creates personalized curricula for students is one that
          recognizes the unique learning needs and styles of each individual
          student.
        </Card.Text>
        <Card.Text>
          Rather than adhering to a one-size-fits-all approach, this company
          takes into account a student's interests, strengths, and weaknesses to
          craft a curriculum that maximizes their potential.
        </Card.Text>
        <Card.Text>
          With personalized curricula, students can learn at their own pace,
          focus on areas where they need more support, and explore topics that
          excite them.
        </Card.Text>
        <Card.Text>
          This approach can lead to improved academic performance, greater
          engagement and motivation, and a more fulfilling learning experience
          overall.
        </Card.Text>
        <Card.Text>
          A company that specializes in personalized curricula demonstrates a
          commitment to student success and can make a significant impact on the
          lives of the students they serve.
        </Card.Text>
        <Card.Text>Version 1.0.0</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default About;
