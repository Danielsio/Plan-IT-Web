import React, { useContext } from "react";
import { Card, Button } from "react-bootstrap";
import "../styles/adminDashboard.css";
import api from "../api/axiosBackendConfig";
import { UserContext } from "../context/UserContext";
import { NO_PROBLEM } from "../utill/Constants";
import { toast } from "react-toastify";

function UserItem({ profile, admin, id }) {
  const { subjectID } = useContext(UserContext);

  const handleMakeAdminClick = () => {
    console.log(subjectID);
    api
      .put("/admin/make-user-admin", {
        params: { sub: subjectID, useSubId: id },
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200 && response.data.details === NO_PROBLEM) {
          toast.success(`Success! User ${profile.name} is now an admin.`);
        }
      })
      .catch((error) => {
        if (error.code === ERROR_COULD_NOT_CONNECT_TO_SERVER_CODE) {
          toast.error(
            "Service Unavailable. It looks that we have some problems right now. Please try again later."
          );
        }
      });
  };

  const renderButton = () => {
    if (admin) {
      return (
        <Button variant="secondary" className="me-2" disabled>
          User is Admin
        </Button>
      );
    } else {
      return (
        <Button
          variant="primary"
          className="me-2"
          onClick={handleMakeAdminClick}
        >
          Make Admin
        </Button>
      );
    }
  };

  return (
    <Card className="mb-3 course-item-card card-container">
      <Card.Body>
        <Card.Title>{profile.name}</Card.Title>
        <Card.Text>Email: {profile.email}</Card.Text>
        <Card.Text>Admin: {admin ? "Yes" : "No"}</Card.Text>
        {renderButton()}
        <Button variant="danger" className="ml-2">
          Delete
        </Button>
      </Card.Body>
    </Card>
  );
}

export default UserItem;
