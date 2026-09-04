import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import CategoryMenu from "../components/layout/CategoryMenu";
import SideBanners from "../components/layout/SideBanners";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/ui/ScrollToTop";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <ScrollToTop />
      <Header />
      <CategoryMenu />
      <SideBanners className="" />
      <main className="flex-1 mt-10 mb-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
