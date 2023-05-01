import React, { useEffect, useContext, useState } from "react";
import api from "../api/axiosBackendConfig";
import { UserContext } from "../context/UserContext";
import { Container, Row, Col, ListGroup, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { ERROR_COULD_NOT_CONNECT_TO_SERVER_CODE } from "../utill/Constants";
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

  const [users, setUsers] = useState(null);

  const { subjectID } = useContext(UserContext);
  useEffect(() => {
    if (isUserAdmin) {
      console.log("aksdgaks");
      api
        .get("/admin/users", { params: { sub: subjectID } })
        .then((response) => {
          console.log(response);
          setUsers(response.data.users);
        })
        .catch((error) => {
          if (error.code === ERROR_COULD_NOT_CONNECT_TO_SERVER_CODE) {
            toast.error(
              "Service Unavailable. It looks that we have some problems right now. Please try again later."
            );
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
                id={user.subjectId}
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
