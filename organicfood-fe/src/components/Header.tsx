import banner from "../assets/top_banner.webp";
import logo from "../assets/logo.webp";
import banner1 from "../assets/banner_1.webp";
import banner2 from "../assets/banner_2.webp";
import Container from "./ui/Container";
import { Link, useLocation } from "react-router-dom";
import SearchBar from "./ui/SearchBar";
import {
  BadgeCheck,
  GiftIcon,
  MenuIcon,
  Phone,
  Star,
  User,
} from "lucide-react";
import Cart from "./Cart";
import Notification from "./Notification";
import { useEffect, useRef, useState } from "react";
import CategoryMenu from "./CategoryMenu";
import Spinner from "./ui/Spinner";
import clsx from "clsx";
import type { SliderHandle } from "./ui/Slider";
import Slider from "./ui/Slider";
import { useCategoryContext } from "../context/CategoryContext";
import { useAuth } from "../context/AuthContext";

const BANNERS = [banner1, banner2];

export default function Header() {
  const { categories } = useCategoryContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, isInitializing, logout } = useAuth();

  const isHomePage = location.pathname === "/";
  const showDropdown = isHomePage || isMenuOpen;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMenuOpen(false);
  }, [location.pathname]);

  const sliderRef = useRef<SliderHandle>(null);

  return (
    <header className="flex flex-col">
      <img src={banner} alt="Banner" className="cursor-pointer" />
      <div className="bg-primary-500 py-3">
        <Container className="flex items-center justify-between">
          <Link to="/" className="shrink-0">
            <img
              src={logo}
              alt="Organicfood - Cửa hàng thực phẩm hữu cơ"
              className="h-17.5 lg:h-27.5 w-auto"
            />
          </Link>
          <SearchBar className="" />
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-white text-primary-500">
                <Phone size={12} fill="currentColor" />
              </div>

              <div>
                <p className="">Hỗ trợ khách hàng</p>
                <Link to={"/"} className="font-bold hover:text-primary-600">
                  02873071088
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3 text-white">
              <div className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-white text-primary-500">
                <User size={12} fill="currentColor" />
              </div>

              <div>
                {isInitializing ? (
                  <>
                    <Spinner className="text-white" text=""></Spinner>
                    <button
                      type="button"
                      onClick={logout}
                      className="cursor-pointer block font-bold hover:text-primary-600"
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : isAuthenticated ? (
                  <>
                    <Link
                      to="/account/profile"
                      className="font-bold hover:text-primary-600"
                    >
                      {user?.fullName}
                    </Link>

                    <button
                      type="button"
                      onClick={logout}
                      className="cursor-pointer block font-bold hover:text-primary-600"
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <p>Tài khoản</p>

                    <Link
                      to="/account/login"
                      className="font-bold hover:text-primary-600"
                    >
                      Đăng nhập
                    </Link>
                  </>
                )}
              </div>
            </div>

            <Cart />
            <Notification />
          </div>
        </Container>
      </div>
      <div className="bg-white border-b border-stone-200">
        <Container className="flex items-center justify-between">
          <div
            className="flex items-center justify-center gap-2 cursor-pointer py-3 hover:text-primary-500"
            onMouseEnter={() => setIsMenuOpen(true)}
            onMouseLeave={() => setIsMenuOpen(false)}
          >
            <MenuIcon size={24} />
            Danh sách sản phẩm
          </div>

          <div className="flex items-center justify-center gap-2 cursor-pointer hover:text-primary-500">
            <Star size={16} />
            Chứng Nhận Hữu Cơ
          </div>

          <div className="flex items-center justify-center gap-2 cursor-pointer hover:text-primary-500">
            <GiftIcon size={16} />
            Hàng sỉ hữu cơ/tự nhiên giá tốt
          </div>

          <div className="flex items-center justify-center gap-2 cursor-pointer hover:text-primary-500">
            <BadgeCheck size={16} />
            Tự hào là doanh nghiệp hàng đầu
          </div>
        </Container>
      </div>

      <Container className="relative">
        {showDropdown && (
          <div
            className={clsx(
              "top-0 z-50 h-[338px] w-full",
              isHomePage ? "" : "absolute",
            )}
            onMouseEnter={() => setIsMenuOpen(true)}
            onMouseLeave={() => setIsMenuOpen(false)}
          >
            {categories.length > 0 ? (
              <CategoryMenu
                categories={categories}
                defaultRightContent={
                  isHomePage ? (
                    <Slider
                      ref={sliderRef}
                      itemsPerView={1}
                      scrollBy={1}
                      className="h-full"
                    >
                      {BANNERS.map((b, index) => (
                        <img
                          key={index}
                          src={b}
                          alt={`banner ${index}`}
                          className="cursor-pointer w-full h-full object-cover"
                        />
                      ))}
                    </Slider>
                  ) : null
                }
              />
            ) : (
              <div
                className={clsx(
                  "h-full bg-white flex justify-center items-center",
                  isHomePage ? "w-full" : "w-72",
                )}
              >
                <Spinner />
              </div>
            )}
          </div>
        )}
      </Container>
    </header>
  );
}
