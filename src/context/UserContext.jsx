import React, { createContext, useState, useEffect, useCallback } from "react";
import api from "../api/axiosBackendConfig";
import { useGoogleLogin } from "@react-oauth/google";

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  /* local stoarge functions */
  const getSubjectIDFromLocalStorage = () => {
    return localStorage.getItem("subjectID");
  };

  const setSubjectIDToLocalStorage = (sub) => {
    localStorage.setItem("subjectID", sub);
  };

  const getIsAdminFromLocalStorage = () => {
    const isAdminStr = localStorage.getItem("isAdmin");

    return isAdminStr === "true";
  };

  const setIsAdminToLocalStorage = (isAdmin) => {
    localStorage.setItem("isAdmin", isAdmin);
  };

  const getIsCompletedFirstSetupFromLocalStorage = () => {
    const isCompletedFirstSetupStr = localStorage.getItem(
      "isCompletedFirstSetup"
    );

    return isCompletedFirstSetupStr === "true";
  };

  const setIsIsCompletedFirstSetupToLocalStorage = (isCompletedFirstSetup) => {
    localStorage.setItem("isCompletedFirstSetup", isCompletedFirstSetup);
  };
  /********************************************/

  /* subjectID & isAuthenticated state values */
  const [subjectID, setSubjectID] = useState(getSubjectIDFromLocalStorage());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(getIsAdminFromLocalStorage());
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [firstSetupLoading, setFirstSetupLoading] = useState(true);
  const [isCompletedFirstSetup, setIsCompletedFirstSetup] = useState(
    getIsAdminFromLocalStorage()
  );

  /********************************************/

  /* event listner for changes of subjectID when another user loggs in*/
  useEffect(() => {
    setSubjectIDToLocalStorage(subjectID);
    setIsAuthLoading(false);

    console.log("the subVal in the localStorage: " + subjectID);

    if (subjectID === "" || subjectID === "null" || subjectID === null) {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, [subjectID]);

  /********************************************************************/

  /* event listner for changes of isAdmin when another user loggs in*/
  useEffect(() => {
    setIsAdminToLocalStorage(isAdmin);
    console.log("the isAdmin in the localStorage: " + isAdmin);
  }, [isAdmin]);

  /* event listner for changes of isCompletedFirstSetup when another user loggs in*/
  useEffect(() => {
    setIsAdminToLocalStorage(isCompletedFirstSetup);
    setFirstSetupLoading(false);
    console.log(
      "the isCompletedFirstSetup in the localStorage: " + isCompletedFirstSetup
    );
  }, [isCompletedFirstSetup]);

  /* Auth handlers functions  handleLogout, handleLogin, handleRegister */
  const handleLogout = () => {
    setIsAuthenticated(false);
    setSubjectID("");
    setIsAdmin(false);
    localStorage.removeItem("subjectID");
    localStorage.removeItem("isAdmin");
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
      const { code } = res;

      // Send axios post request to backend with response data
      const response = await api.post("/login", {}, { params: { code: code } });

      console.log(response);
      // response.data should contains the subjectID of the user
      const { sub } = response.data;
      setSubjectID(sub);
      setIsAdmin(response.data.isAdmin);
      setIsAuthenticated(true);

      if (response.data.details == "Login") {
        setIsCompletedFirstSetup(true);
      } else {
        setIsCompletedFirstSetup(false);
      }
    },
  });

  /************************************************************************/

  /*a function to extract user's email using access_token
  const getEmailFromGoogle = async (access_token) => {
    const res = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
    );
    const data = await res.json();
    return data.email;
  };*/

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
        isCompletedFirstSetup,
        setIsCompletedFirstSetup,
        firstSetupLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
