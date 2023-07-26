import React, { useEffect, useContext, useState } from "react";
import api from "../api/axiosBackendConfig";
import { UserContext } from "../context/UserContext";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  ERROR_COULD_NOT_CONNECT_TO_SERVER_CODE,
  NO_PROBLEM,
} from "../utill/Constants";
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
        if (response.status === 200 && response.data.details === NO_PROBLEM) {
          if (!response.data.user.admin) {
            setIsUserAdmin(false);
            navigate("/");
            return;
          }
          setIsUserAdmin(true);
        } else {
          toast.error(
            "Service Unavailable. It looks that we have some problems right now. Please try again later."
          );
        }
      })
      .catch((error) => {
        if (error.code === ERROR_COULD_NOT_CONNECT_TO_SERVER_CODE) {
          toast.error(
            "Service Unavailable. It looks that we have some problems right now. Please try again later."
          );
        } else {
          const problem = error.response.data.details;
          const status = error.response.status;
          if (status === 400 && problem === ERROR_USER_NOT_FOUND) {
            toast.error(
              <div>
                <span>Session has expired, Please Sign-in</span>
                <Button
                  className="google-calendar-btn col-lg-3 mt-3"
                  variant="secondary"
                  size="lg"
                  onClick={clearStateAndRedirect}
                >
                  Go to Home
                </Button>
              </div>
            );
          } else {
            toast.error(
              "Service Unavailable. It looks that we have some problems right now. Please try again later."
            );
          }
        }
      });
  }, []);

  const navigateToCoursesDashboard = () => {
    navigate(`/admin/courses-dashboard`);
  };

  const navigateToUsersDashboard = () => {
    navigate(`/admin/users-dashboard`);
  };

  const handleUpdateHolidays = () => {
    api
      .put("/admin/update-holidays", {}, { params: { sub: subjectID } })
      .then((response) => {
        console.log(response);
        if (response.status === 200 && response.data.details === NO_PROBLEM) {
          toast.success("The holidays were updated successfully.");
        } else {
          toast.error(
            "Service Unavailable. It looks that we have some problems right now. Please try again later."
          );
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.code === ERROR_COULD_NOT_CONNECT_TO_SERVER_CODE) {
          toast.error(
            "Service Unavailable. It looks that we have some problems right now. Please try again later."
          );
        } else {
          const problem = error.response.data.details;
          const status = error.response.status;
          if (status === 400 && problem === ERROR_USER_NOT_FOUND) {
            toast.error(
              <div>
                <span>Session has expired, Please Sign-in</span>
                <Button
                  className="google-calendar-btn col-lg-3 mt-3"
                  variant="secondary"
                  size="lg"
                  onClick={clearStateAndRedirect}
                >
                  Go to Home
                </Button>
              </div>
            );
          } else if (status === 401 && problem === ERROR_UNAUTHORIZED_USER) {
            toast.warn(
              "Your cannot perform this operation. Refering to your home page."
            );
          } else {
            toast.error(
              "Service Unavailable. It looks that we have some problems right now. Please try again later."
            );
          }
        }
      });
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
        onClick={handleUpdateHolidays}
      >
        Update Holidays
      </Button>
    </Container>
  );
}
export default AdminDashboardPage;
