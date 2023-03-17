import React, { createContext, useState, useEffect } from "react";

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const getEmailFromLocalStorage = () => {
    return localStorage.getItem("userEmail");
  };

  const setEmailToLocalStorage = (email) => {
    localStorage.setItem("userEmail", email);
  };

  const getEmailFromGoogle = async (access_token) => {
    const res = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
    );
    const data = await res.json();
    return data.email;
  };

  const [userEmail, setUserEmail] = useState(getEmailFromLocalStorage());

  useEffect(() => {
    setEmailToLocalStorage(userEmail);
  }, [userEmail]);

  return (
    <UserContext.Provider
      value={{
        userEmail,
        setUserEmail,
        getEmailFromGoogle,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
