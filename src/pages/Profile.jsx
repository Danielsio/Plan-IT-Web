import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import "../styles/profile.css";

function Profile() {
  const { isAuthenticated } = useContext(UserContext);

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/profile");
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="message-container">
        <h1>Please Login Or Register to view Your Profile</h1>
      </div>
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1>{userData.name}</h1>
      <img src={userData.image} alt={userData.name} />
      <p>Email: {userData.email}</p>
      <h2>Preferences:</h2>
      <ul>
        <li>Field 1: {userData.preferences.field1}</li>
        <li>Field 2: {userData.preferences.field2}</li>
        <li>Field 3: {userData.preferences.field3}</li>
      </ul>
      {/* more user data can be displayed here */}
    </div>
  );
}

export default Profile;
