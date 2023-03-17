import { useGoogleLogin } from "@react-oauth/google";
import api from "../api/axiosBackendConfig";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const SignUp = () => {
  const { userEmail, setUserEmail, getEmailFromGoogle } =
    useContext(UserContext);

  const sendTokenAndEmailToBackendSignUP = async (code) => {
    const res = await api.post("/sign-up", {}, { params: { code: code } });
    return res;
  };

  const login = useGoogleLogin({
    scope:
      "email profile openid https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email",
    redirect_uri: "http://localhost:3000",
    onError: (err) => {
      console.error(err);
    },
    onSuccess: async (res) => {
      const { access_token } = res;
      const email = await getEmailFromGoogle(access_token);
      console.log(email);

      // Send axios post request to backend with response data
      const response = await sendTokenAndEmailToBackendSignUP(
        access_token,
        email
      );

      // check if user is already Signed-up
      if (response.status == 409) {
        // display error-msg
      }
      console.log(response.data);
    },
  });

  return (
    <div className="sign-up-button">
      <button onClick={login}>Google Sign-Up</button>
    </div>
  );
};

export default SignUp;
