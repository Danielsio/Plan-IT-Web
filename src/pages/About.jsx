import React from "react";
import styled from "styled-components";

const AboutContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
`;

const AboutHeading = styled.h1`
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const AboutText = styled.p`
  font-size: 24px;
  margin-bottom: 10px;
  line-height: 1.5;
  text-align: center;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const About = () => {
  return (
    <AboutContainer>
      <AboutHeading>PlanIt</AboutHeading>
      <AboutText>
        A company that creates personalized curricula for students is one that
        recognizes the unique learning needs and styles of each individual
        student.
      </AboutText>
      <AboutText>
        Rather than adhering to a one-size-fits-all approach, this company takes
        into account a student's interests, strengths, and weaknesses to craft a
        curriculum that maximizes their potential.
      </AboutText>
      <AboutText>
        With personalized curricula, students can learn at their own pace, focus
        on areas where they need more support, and explore topics that excite
        them.
      </AboutText>
      <AboutText>
        This approach can lead to improved academic performance, greater
        engagement and motivation, and a more fulfilling learning experience
        overall.
      </AboutText>
      <AboutText>
        A company that specializes in personalized curricula demonstrates a
        commitment to student success and can make a significant impact on the
        lives of the students they serve.
      </AboutText>
      <AboutText>Version 1.0.0</AboutText>
    </AboutContainer>
  );
};

export default About;
