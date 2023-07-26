import React, {createContext, useEffect, useState} from "react";
import api from "../api/axiosBackendConfig";
import {useGoogleLogin} from "@react-oauth/google";
import {
    ERROR_COULD_NOT_CONNECT_TO_SERVER_CODE,
    ERROR_ILLEGAL_CHARACTERS_IN_AUTH_CODE,
    ERROR_USER_NOT_FOUND,
    LOGIN,
    REGISTER,
} from "../utill/Constants";
import {toast} from "react-toastify";
import {Button} from "react-bootstrap";

const UserContext = createContext(null);

const UserProvider = ({children}) => {
    /* local storage functions */
    const getSubjectIDFromLocalStorage = () => {
        const sub = localStorage.getItem("subjectID");
        if (sub === "null" || sub === undefined | sub === "") {
            return null;
        } else {
            return sub;
        }
    };

    const getIsAdminFromLocalStorage = () => {
        const isAdminStr = localStorage.getItem("isAdmin");

        return isAdminStr === "true";
    };

    const getIsCompletedFirstSetupFromLocalStorage = () => {
        const isCompletedFirstSetupStr = localStorage.getItem(
            "isCompletedFirstSetup"
        );

        return isCompletedFirstSetupStr === "true";
    };

    /********************************************/

    /* subjectID & isAuthenticated state values */
    const [subjectID, setSubjectID] = useState(getSubjectIDFromLocalStorage());
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(getIsAdminFromLocalStorage());
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [isCompletedFirstSetup, setIsCompletedFirstSetup] = useState(
        getIsCompletedFirstSetupFromLocalStorage()
    );

    const clearUserState = () => {
        setSubjectID("");
        setIsAdmin(false);
        setIsCompletedFirstSetup(false);
    };

    /********************************************/

    /* event listener for changes in state variables */
    useEffect(() => {
        // Save subjectID to local storage
        localStorage.setItem("subjectID", subjectID);

        // Update authentication status and loading state based on subjectID
        setIsAuthenticated(!!subjectID);

        // Save isAdmin to local storage
        localStorage.setItem("isAdmin", isAdmin);

        // Save isCompletedFirstSetup to local storage
        localStorage.setItem("isCompletedFirstSetup", isCompletedFirstSetup);
        setIsAuthLoading(false);
    }, [subjectID, isAdmin, isCompletedFirstSetup]);

    /* Auth handlers functions  handleLogout, handleLogin, handleRegister */
    const handleLogout = () => {
        setIsAuthenticated(false);
        setSubjectID("");
        setIsAdmin(false);
        localStorage.removeItem("subjectID");
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("isCompletedFirstSetup");
        console.log("isAuthenticated: " + isAuthenticated);
        window.location.reload();
    };

    const handleLogin = useGoogleLogin({
        scope: "email profile openid https://www.googleapis.com/auth/calendar",
        redirect_uri: "http://localhost:3000",
        flow: "auth-code",
        onError: (err) => {
            console.error(err);
        },
        onSuccess: async (res) => {
            const {code} = res;

            try {
                // Send axios post request to backend with response data
                const response = await api.post(
                    "/login",
                    {},
                    {params: {code: code}}
                );

                console.log(response);
                // response.data should contain the subjectID of the user
                const {sub} = response.data;
                setSubjectID(sub);
                setIsAdmin(response.data.isAdmin);
                setIsAuthenticated(true);

                if (response.status === 200 && response.data.details === LOGIN) {
                    console.log("inside if case of 'Login'");
                    setIsCompletedFirstSetup(true);
                } else if (
                    response.status === 201 &&
                    response.data.details === REGISTER
                ) {
                    console.log("inside if case of 'Register'");
                    setIsCompletedFirstSetup(false);
                } else {
                    console.log("inside else case");
                    toast.error(
                        "Service Unavailable. It looks that we have some problems right now. Please try again later."
                    );
                }
            } catch (error) {
                if (error.code === ERROR_COULD_NOT_CONNECT_TO_SERVER_CODE) {
                    toast.error(
                        "Service Unavailable. It looks that we have some problems right now. Please try again later."
                    );
                } else {
                    const problem = error.response.data.details;
                    const status = error.response.status;
                    if (
                        (status === 400 && problem === ERROR_USER_NOT_FOUND) ||
                        (status === 400 &&
                            problem === ERROR_ILLEGAL_CHARACTERS_IN_AUTH_CODE)
                    ) {
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
        },
    });

    /************************************************************************/

    return (
        <UserContext.Provider
            value={{
                subjectID,
                setSubjectID,
                isAuthenticated,
                setIsAuthenticated,
                isAuthLoading,
                handleLogin,
                handleLogout,
                isAdmin,
                setIsAdmin,
                isCompletedFirstSetup,
                setIsCompletedFirstSetup,
                clearUserState,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export {UserContext, UserProvider};
