import { useContext } from "react";
import "../styles/home.css";
import GoogleButton from "react-google-button";
import { UserContext } from "../context/UserContext";

const Home = () => {
  const { handleLogin } = useContext(UserContext);

  return (
    <div className="home-page-container">
      <div className="home-page-welcome-text">
        <h1>Welcome To PlanIt !</h1>
        <h3>
          The one and only platform that manages your exam period automatically.
        </h3>
        <h3>just login and be ready for your exams.</h3>
      </div>
      <center>
        <GoogleButton
          type="dark"
          label="Continue With Google"
          onClick={handleLogin}
        />
      </center>
    </div>
  );
};

export default Home;
