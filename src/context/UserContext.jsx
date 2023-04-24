import React, { createContext, useState, useEffect, useCallback } from "react";
import api from "../api/axiosBackendConfig";
import { useGoogleLogin } from "@react-oauth/google";

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  /* local stoarge functions */
  const getSubjectIDFromLocalStorage = () => {
    return localStorage.getItem("subjectID");
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
