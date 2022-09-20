import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToken } from "../auth/useToken";
import { check_loggedin } from "../util/utils.js";
import { isValidEmail } from "../util/utils.js";

export const LogInPage = () => {
  const [token, setToken] = useToken();

  const [errorMessage, setErrorMessage] = useState("");

  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const navigate = useNavigate();
  let isLoggedIn = check_loggedin();

  const onLogInClicked = async () => {
    if (!isValidEmail(emailValue)) {
      setErrorMessage("Email is invalid.");
      return false;
    }
    try {
      const response = await axios.post("/api/login", {
        email: emailValue,
        password: passwordValue,
      });
      const { token } = response.data;
      setToken(token);
      navigate("/");
    } catch (err) {
      console.log(err);
      setErrorMessage("Login fails.");
    }
  };

  const handleEmailChange = (e) => {
    setErrorMessage("");
    setEmailValue(e.target.value);
  };

  return (
    <div className="content-container flex flex-col justify-center items-center flex-wrap w-[300px] m-auto">
      <h1>Log In</h1>
      {errorMessage && (
        <div className="fail my-3 text-red-500">{errorMessage}</div>
      )}
      <input
        value={emailValue}
        type="email"
        onChange={handleEmailChange}
        placeholder="someone@gmail.com"
        className="w-full form-input my-1"
        required
      />
      <input
        type="password"
        value={passwordValue}
        onChange={(e) => setPasswordValue(e.target.value)}
        placeholder="password"
        className="w-full form-input my-1"
        required
      />
      <hr />
      <button
        disabled={isLoggedIn || !emailValue || !passwordValue}
        onClick={onLogInClicked}
        className="w-full btn-blue my-1 disabled:opacity-75"
      >
        Log In
      </button>
      <button
        hidden
        disabled={isLoggedIn}
        onClick={() => navigate("/forgot-password")}
        className="w-full btn-blue my-1 disabled:opacity-75"
      >
        Forgot your password?
      </button>
      <button
        disabled={isLoggedIn}
        onClick={() => navigate("/signup")}
        className="w-full btn-blue my-1 disabled:opacity-75"
      >
        Don't have an account? Sign Up
      </button>
    </div>
  );
};
