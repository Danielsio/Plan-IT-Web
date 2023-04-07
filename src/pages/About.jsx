import React from "react";
import Card from "react-bootstrap/Card";
import "../styles/about.css";

const About = () => {
  return (
    <Card className="about-page-container my-5 py-4">
      <Card.Body>
        <Card.Title className="about-card-title text-center">
          <img
            alt="PlanIT-logo"
            src="/PlanIT-without logo dark.png"
            className="about-card-title-img"
          />{" "}
        </Card.Title>
        <Card.Text className="text-center font-weight-bold">
          A company that creates personalized curricula for students is one that
          recognizes the unique learning needs and styles of each individual
          student.
        </Card.Text>
        <Card.Text className="text-center">
          Rather than adhering to a one-size-fits-all approach, this company
          takes into account a student's interests, strengths, and weaknesses to
          craft a curriculum that maximizes their potential.
        </Card.Text>
        <Card.Text className="text-center">
          With personalized curricula, students can learn at their own pace,
          focus on areas where they need more support, and explore topics that
          excite them.
        </Card.Text>
        <Card.Text className="text-center">
          This approach can lead to improved academic performance, greater
          engagement and motivation, and a more fulfilling learning experience
          overall.
        </Card.Text>
        <Card.Text className="text-center">
          A company that specializes in personalized curricula demonstrates a
          commitment to student success and can make a significant impact on the
          lives of the students they serve.
        </Card.Text>
        <Card.Text className="text-center">Version 1.0.0</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default About;
