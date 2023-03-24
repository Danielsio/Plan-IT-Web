import React, { createContext, useState, useEffect } from "react";
import api from "../api/axiosBackendConfig";
import { useGoogleLogin } from "@react-oauth/google";

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const getSubjectIdFromLocalStorage = () => {
    return localStorage.getItem("userEmail");
  };

  const setSubjectIdToLocalStorage = (sub) => {
    localStorage.setItem("userEmail", sub);
  };

  const [subjectId, setSubjectId] = useState(getSubjectIdFromLocalStorage());

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setSubjectIdToLocalStorage(subjectId);
    console.log(subjectId);
  }, [subjectId]);

  const handleLogout = (sub) => {
    setIsAuthenticated(false);
    // maybe do some more logic
    setSubjectId("");
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
      const response = await api.post(
        "/sign-up",
        {},
        { params: { code: code } }
      );

      console.log(response);
      // response.data should contains the subjectId of the user
      setSubjectId(response.data);
      setIsAuthenticated(true);
      window.location.reload();
    },
  });

  // a function to extract user's email using access_token
  // const getEmailFromGoogle = async (access_token) => {
  //   const res = await fetch(
  //     `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
  //   );
  //   const data = await res.json();
  //   return data.email;
  // };

  return (
    <UserContext.Provider
      value={{
        subjectId,
        setSubjectId,
        isAuthenticated,
        setIsAuthenticated,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
