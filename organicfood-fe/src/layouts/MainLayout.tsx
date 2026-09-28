import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import stkLeft from "../assets/stk_bn_left.webp";
import stkRight from "../assets/stk_bn_right.webp";
import { CategoryProvider } from "../context/CategoryContext";
import ScrollToTop from "../components/ScrollToTop";

export default function MainLayout() {
  return (
    <CategoryProvider>
      <div className="min-h-screen flex flex-col relative">
        <ScrollToTop />
        <Header />
        <main className="flex-1 my-8">
          <Outlet />
        </main>
        <Footer />

        <>
          <img
            src={stkLeft}
            alt="Banner left"
            className="absolute left-5 top-70 cursor-pointer"
          />
          <img
            src={stkRight}
            alt="Banner right"
            className="absolute right-5 top-70 cursor-pointer"
          />
        </>
      </div>
    </CategoryProvider>
  );
}
