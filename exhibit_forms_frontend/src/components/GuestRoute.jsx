import { useContext } from "react";
import { UserContext } from "./UserContext";
import { Navigate } from "react-router-dom";

const GuestRoute = ({ children }) => {
  const { user } = useContext(UserContext);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default GuestRoute;
