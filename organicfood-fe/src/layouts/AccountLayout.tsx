import { Outlet } from "react-router-dom";
import Container from "../components/ui/Container";
import AccountSidebar from "../components/layout/AccountSidebar";

export default function AccountLayout() {
  return (
    <Container>
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
        <AccountSidebar />
        <div className="bg-white rounded-md shadow-sm py-3 px-4">
          <Outlet />
        </div>
      </div>
    </Container>
  );
}
