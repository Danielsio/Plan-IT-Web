import { useGoogleLogin } from "@react-oauth/google";
import api from "../api/axiosBackendConfig";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

const SignIn = () => {
  const { subjectId, setSubjectId, setIsAuthenticated } =
    useContext(UserContext);

  const sendCodeTOBackendForLogin = async (code) => {
    const res = await api.post("/sign-up", {}, { params: { code: code } });
    return res;
  };

  const login = useGoogleLogin({
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
      const response = await sendCodeTOBackendForLogin(code);

      console.log(response);
      // response.data should contains the subjectId of the user
      setSubjectId(response.data);
      setIsAuthenticated(true);
    },
  });

  return (
    <div className="sign-up-button">
      <button onClick={login}>Google Sign-Up</button>
    </div>
  );
};

export default SignIn;
