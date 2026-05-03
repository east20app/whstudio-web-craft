import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./store";

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  if (!isAuthenticated()) return <Navigate to="/dashboard/login" replace />;
  return children;
};
