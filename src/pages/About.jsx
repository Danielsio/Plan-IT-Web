import React from "react";
import Card from "react-bootstrap/Card";
import "../styles/about.css";

const About = () => {
  return (
    <Card className="about-page-container">
      <Card.Body>
        <Card.Title className="about-card-title">PlanIT</Card.Title>
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
