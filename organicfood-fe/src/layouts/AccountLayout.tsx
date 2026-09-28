import { Navigate, Outlet } from "react-router-dom";
import Container from "../components/ui/Container";
import AccountSidebar from "../components/AccountSidebar";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/ui/Spinner";

export default function AccountLayout() {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/account/login" replace />;

  return (
    <Container className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
      <AccountSidebar />
      <div className="flex-1 min-w-0 bg-white rounded-md py-3 px-4">
        <Outlet />
      </div>
    </Container>
  );
}
