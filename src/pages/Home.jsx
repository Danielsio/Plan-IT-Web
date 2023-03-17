import React from "react";
import GoogleSignUp from "../components/GoogleSignUp";

function Home() {
  return (
    <div>
      <div className="home-page-welcome-text">
        <h1>Welcome To PlanIt !</h1>
        <h3>
          The one and only platform that manages your exam period automatically.
        </h3>
        <h3>just sign-up or login and be ready for your exams.</h3>
      </div>
      <GoogleSignUp />
    </div>
  );
}

export default Home;
