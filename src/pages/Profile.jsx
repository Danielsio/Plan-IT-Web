import React, {useState, useEffect, useContext} from "react";
import {UserContext} from "../context/UserContext";
import "../styles/profile.css";
import {Container, Row, Col, Button} from "react-bootstrap";
import api from "../api/axiosBackendConfig";
import {ClipLoader} from "react-spinners";
import {useNavigate} from "react-router-dom";
import ProfileCard from "../components/ProfileCard";
import {
    ERROR_COULD_NOT_CONNECT_TO_SERVER_CODE, ERROR_USER_NOT_FOUND,
    NO_PROBLEM,
} from "../utill/Constants";
import {toast} from "react-toastify";

function Profile() {
    const convertUserStudyTimeToHours = (userStudyTime) => {
        const hour = Math.floor(userStudyTime / 100);
        if (hour < 10) {
            return "0" + hour.toString();
        } else {
            return hour.toString();
        }
    };

    const convertUserStudyTimeToMinute = (userStudyTime) => {
        const minute = userStudyTime % 100;
        if (minute < 10) {
            return "0" + minute.toString();
        } else {
            return minute.toString();
        }
    };

    const {isAuthenticated, subjectID, isAuthLoading, setIsAdmin, clearStateAndRedirect} =
        useContext(UserContext);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const handleEditPreferences = () => {
        const oldUserPreferences = userData.userPreferences;
        navigate(
            `/edit-preferences?oldUserPreferences=${JSON.stringify(
                oldUserPreferences
            )}`
        );
    };

    useEffect(() => {
        /* get user from backend DB */
        const getUserData = async () => {
            try {
                const response = await api.get("/profile", {
                    params: {sub: subjectID},
                });
                console.log(response);

                if (response.status === 200 && response.data.details === NO_PROBLEM) {
                    setUserData(response.data.user);
                    console.log(userData);
                    if (response.data.user.admin) {
                        setIsAdmin(true);
                    }
                } else {
                    toast.error(
                        "Service Unavailable. It looks that we have some problems right now. Please try again later."
                    );
                }
                console.log(userData);
                
                setLoading(false);
            } catch (error) {
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
                    } else {
                        toast.error(
                            "Service Unavailable. It looks that we have some problems right now. Please try again later."
                        );
                    }
                }
            }
        };

        if (isAuthenticated) {
            getUserData();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (!isAuthLoading && !isAuthenticated) {
            navigate("/");
        }
    }, [isAuthLoading, isAuthenticated]);

    if (isAuthLoading) {
        return (
            <Container>
                <ClipLoader/>
            </Container>
        );
    }

    return loading ? (
        <ClipLoader
            className="spinner"
            color="#29335c"
            loading={loading}
            size={100}
        />
    ) : (
        <Container className="mt-5">
            <Row>
                <Col>
                    <ProfileCard
                        name={userData.profile.name}
                        email={userData.profile.email}
                        pictureUrl={userData.profile.pictureUrl}
                        userStudyStartTime={
                            convertUserStudyTimeToHours(
                                userData.userPreferences.userStudyStartTime
                            ).toString() +
                            ":" +
                            convertUserStudyTimeToMinute(
                                userData.userPreferences.userStudyStartTime
                            ).toString()
                        }
                        userStudyEndTime={
                            convertUserStudyTimeToHours(
                                userData.userPreferences.userStudyEndTime
                            ).toString() +
                            ":" +
                            convertUserStudyTimeToMinute(
                                userData.userPreferences.userStudyEndTime
                            ).toString()
                        }
                        userBreakTime={userData.userPreferences.userBreakTime}
                        studySessionTime={userData.userPreferences.studySessionTime}
                        studyOnWeekends={userData.userPreferences.studyOnWeekends}
                        onClick={handleEditPreferences}
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default Profile;
