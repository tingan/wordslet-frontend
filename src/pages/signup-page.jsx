import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToken } from "../auth/useToken";
import { isValidEmail } from "../util/utils.js";

export const SignUpPage = () => {
  const [token, setToken] = useToken();
  const [errorMessage, setErrorMessage] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setErrorMessage("");
    setEmailValue(e.target.value);
  };

  const onSignUpClicked = async () => {
    if (!isValidEmail(emailValue)) {
      setErrorMessage("Email is invalid.");
      return false;
    }
    try {
      const response = await axios.post("/api/signup", {
        email: emailValue,
        password: passwordValue,
      });
      const { token } = response.data;
      setToken(token);
      navigate("/");
    } catch (err) {
      console.log(err);
      setErrorMessage("this email has already been registered.");
    }
  };

  return (
    <div className="content-container flex flex-col justify-center items-center flex-wrap w-[300px] m-auto">
      <h1>Sign Up</h1>
      {errorMessage && (
        <div className="fail text-red-500 my-2">{errorMessage}</div>
      )}
      <input
        value={emailValue}
        type="email"
        onChange={handleEmailChange}
        placeholder="someone@gmail.com"
        className="w-full form-input my-1"
      />
      <input
        type="password"
        value={passwordValue}
        onChange={(e) => setPasswordValue(e.target.value)}
        placeholder="password"
        className="w-full form-input my-1"
      />
      <input
        type="password"
        value={confirmPasswordValue}
        onChange={(e) => setConfirmPasswordValue(e.target.value)}
        placeholder="password"
        className="w-full form-input my-1"
      />
      <hr />

      <button
        disabled={
          !emailValue ||
          !passwordValue ||
          passwordValue !== confirmPasswordValue ||
          errorMessage
        }
        onClick={onSignUpClicked}
        className="w-full btn-blue my-1 disabled:opacity-75"
      >
        Sign Up
      </button>
      <button
        onClick={() => navigate("/login")}
        className="w-full btn-blue my-1 disabled:opacity-75"
      >
        Already have an account? Log In
      </button>
    </div>
  );
};
