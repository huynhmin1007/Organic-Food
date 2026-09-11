import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RequireAuth() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="h-64" />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/account/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return <Outlet />;
}
