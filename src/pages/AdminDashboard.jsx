import React, { useEffect, useContext, useState } from "react";
import api from "../api/axiosBackendConfig";
import { UserContext } from "../context/UserContext";
import { Container, Row, Col, ListGroup, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ERROR_COULD_NOT_CONNECT_TO_SERVER_CODE } from "../utill/Constants";
import { toast } from "react-toastify";

function AdminDashboardPage() {
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const navigate = useNavigate();

  const { subjectID } = useContext(UserContext);

  useEffect(() => {
    api
      .get("/profile", {
        params: { sub: subjectID },
      })
      .then((response) => {
        console.log(response);
        if (!response.data.user.admin) {
          setIsUserAdmin(false);
          navigate("/");
          return;
        }
        setIsUserAdmin(true);
      })
      .catch((error) => {
        if (error.code === ERROR_COULD_NOT_CONNECT_TO_SERVER_CODE) {
          toast.error(
            "Service Unavailable. It looks that we have some problems right now. Please try again later."
          );
        }
      });
  }, []);

  const navigateToCoursesDashboard = () => {
    navigate(`/admin/courses-dashboard`);
  };

  const navigateToUsersDashboard = () => {
    navigate(`/admin/users-dashboard`);
  };

  const navigateToHolidaysDashboard = () => {
    navigate(`/admin/holidays-dashboard`);
  };

  return (
    <Container className="mt-4 text-center">
      <Button
        size="lg"
        variant="primary"
        className="w-50 h-100 mb-3 mx-2"
        onClick={navigateToCoursesDashboard}
      >
        Courses
      </Button>
      <Button
        size="lg"
        variant="secondary"
        className="w-50 h-100 mb-3 mx-2"
        onClick={navigateToUsersDashboard}
      >
        Users
      </Button>
      <Button
        size="lg"
        variant="success"
        className="w-50 h-100 mb-3 mx-2"
        onClick={navigateToHolidaysDashboard}
      >
        Holidays
      </Button>
    </Container>
  );
}
export default AdminDashboardPage;
