import React, { createContext, useState, useEffect, useCallback } from "react";
import api from "../api/axiosBackendConfig";
import { useGoogleLogin } from "@react-oauth/google";

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  /* local stoarge functions */
  const getSubjectIdFromLocalStorage = () => {
    return localStorage.getItem("subjectId");
  };

  const setSubjectIdToLocalStorage = (sub) => {
    localStorage.setItem("subjectId", sub);
  };
  /********************************************/

  /* subjectId & isAuthenticated state values */
  const [subjectId, setSubjectId] = useState(getSubjectIdFromLocalStorage());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  /********************************************/

  /* event listner for changes of subjectId when another user loggs in*/
  useEffect(() => {
    setSubjectIdToLocalStorage(subjectId);
    console.log("Saving sub to localStorage: " + subjectId);

    console.log(typeof subjectId);
    if (subjectId === "") {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, [subjectId]);

  /********************************************************************/

  /* Auth handlers functions  handleLogout, handleLogin, handleRegister */
  const handleLogout = () => {
    setIsAuthenticated(false);
    setSubjectId("");
    localStorage.removeItem("subjectId");
    console.log("isAuthenticated: " + isAuthenticated);
    window.location.reload();
  };

  const handleLogin = useGoogleLogin({
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
      // response.data should contains the subjectId of the user
      const { sub } = response.data;
      setSubjectId(sub);
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
      // response.data should contains the subjectId of the user
      const { sub } = response.data;
      setSubjectId(sub);
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
        subjectId,
        setSubjectId,
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
