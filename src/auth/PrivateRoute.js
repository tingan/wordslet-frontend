import { Redirect, Route } from "react-router-dom";
import { useUser } from "./useUser";
import { check_loggedin } from "../util/utils.js";

export const ProtectedRoute = ({ children }) => {
  const isLoggedIn = check_loggedin();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
