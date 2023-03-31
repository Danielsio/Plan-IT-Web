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
  /********************************************/

  /* subjectID & isAuthenticated state values */
  const [subjectID, setSubjectID] = useState(getSubjectIDFromLocalStorage());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  /********************************************/

  /* event listner for changes of subjectID when another user loggs in*/
  useEffect(() => {
    setSubjectIDToLocalStorage(subjectID);
    console.log("Saving sub to localStorage: " + subjectID);

    console.log("isAuthenticated before check: " + isAuthenticated);
    if (subjectID === "" || subjectID === "null" || subjectID === null) {
      console.log("inside if of isAuthenticated check: " + isAuthenticated);
      setIsAuthenticated(false);
    } else {
      console.log("inside else of isAuthenticated check: " + isAuthenticated);
      setIsAuthenticated(true);
    }
    console.log("isAuthenticated after check: " + isAuthenticated);

  }, [subjectID]);

  /********************************************************************/

  /* Auth handlers functions  handleLogout, handleLogin, handleRegister */
  const handleLogout = () => {
    setIsAuthenticated(false);
    setSubjectID("");
    localStorage.removeItem("subjectID");
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
      setIsAuthenticated(true);
      window.location.reload();
    },
  });

  const handleRegister = useGoogleLogin({
    scope:
      "email profile openid https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email",
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
      setIsAuthenticated(true);

      // add logic to redirect user to a page to set is preferences;
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
        handleLogin,
        handleLogout,
        handleRegister,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
