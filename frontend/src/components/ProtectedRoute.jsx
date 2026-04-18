import { Navigate, useLocation } from "react-router-dom";
import { useAppStore } from "../context/AppStore";

export default function ProtectedRoute({ role, children }) {
  const { session } = useAppStore();
  const location = useLocation();

  if (!session) {
    return <Navigate to={role === "admin" ? "/admin/login" : "/auth/login"} replace state={{ from: location.pathname }} />;
  }

  if (role && session.role !== role) {
    return <Navigate to={session.role === "admin" ? "/admin/dashboard" : "/shop"} replace />;
  }

  return children;
}
