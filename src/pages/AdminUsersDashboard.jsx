import React, { useEffect, useContext, useState } from "react";
import api from "../api/axiosBackendConfig";
import { UserContext } from "../context/UserContext";
import { Container, ListGroup, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import {
  ERROR_COULD_NOT_CONNECT_TO_SERVER_CODE,
  NO_PROBLEM,
} from "../utill/Constants";
import { toast } from "react-toastify";
import UserItem from "../components/UserItem";

function AdminUsersDashboard() {
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  const navigate = useNavigate();
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

  const [users, setUsers] = useState(null);

  const { subjectID } = useContext(UserContext);
  useEffect(() => {
    if (isUserAdmin) {
      api
        .get("/admin/users", { params: { sub: subjectID } })
        .then((response) => {
          console.log(response);
          if (response.status === 200 && response.data.details === NO_PROBLEM) {
            setUsers(response.data.users);
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
            if (status === 401 && problem === ERROR_UNAUTHORIZED_USER) {
              toast.warn(
                "Your cannot perform this operation. Refering to your home page."
              );
            } else if (status === 400 && problem === ERROR_USER_NOT_FOUND) {
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
    }
  }, [isUserAdmin]);

  return (
    <Container className="mt-4">
      {users == null ? (
        ClipLoader(
          <div className="text-center">
            <ClipLoader size={50} />
          </div>
        )
      ) : (
        <ListGroup>
          {users.map((user) => (
            <ListGroup.Item key={user.subjectId}>
              <UserItem
                id={user.subjectID}
                profile={user.profile}
                admin={user.admin}
              />
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
}
export default AdminUsersDashboard;
