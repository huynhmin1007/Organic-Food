import {
  BadgeCheckIcon,
  GiftIcon,
  MenuIcon,
  Phone,
  ShoppingCart,
  StarIcon,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import topBanner from "../../assets/top_banner.jpg";
import Container from "../ui/Container";
import SearchBar from "./SearchBar";
import banner from "../../assets/slider_2_1024x1024.webp";
import bannerLeft from "../../assets/stk-bn-left.webp";
import bannerRight from "../../assets/stk-bn-right.webp";
import { useCategory } from "../../contexts/CategoryContext";
import { flattenCategories } from "../../lib/category";
import CartDropdown from "./CartDropDown";
import { useAuth } from "../../contexts/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const cartRef = useRef<HTMLDivElement>(null);
  const { categories } = useCategory();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
        setCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (query: string) => {
    const normalizedQuery = query.trim().toLowerCase();

    const matchedCategory = flattenCategories(categories).find(
      (cat) => cat.name.toLowerCase() === normalizedQuery,
    );

    if (matchedCategory) {
      navigate(`/${matchedCategory.slug}`);
      return;
    }

    navigate(`/tim-kiem?keyword=${encodeURIComponent(query)}`);
  };

  return (
    <header>
      <div className="w-full overflow-hidden">
        <Link to="/" className="block">
          <img
            src={topBanner}
            alt="Banner"
            className="w-full object-cover object-center"
            style={{ maxHeight: 80 }}
          />
        </Link>
      </div>

      <div className="bg-primary-500">
        <Container className="flex items-center py-1">
          <Link to="/" className="shrink-0">
            <img src={logo} alt="Organic Food" className="w-[120px] h-auto" />
          </Link>

          <div className="mx-12 flex-1 max-w-[520px]">
            <SearchBar onSearch={handleSearch} />
          </div>

          <div className="ml-auto flex items-center gap-10">
            {/* Phone */}
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-white text-primary-500">
                <Phone size={12} fill="currentColor" />
              </div>

              <div className="leading-tight">
                <p className="">Hỗ trợ khách hàng</p>
                <p className="font-bold">02873071088</p>
              </div>
            </div>

            {/* Account */}
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-white text-primary-500">
                <User size={12} fill="currentColor" />
              </div>

              <div className="leading-tight">
                {!isAuthenticated ? (
                  <div>
                    <p>Tài khoản</p>
                    <Link
                      to="/account/login"
                      className="font-bold hover:text-primary-100"
                    >
                      <p>Đăng nhập</p>
                    </Link>
                  </div>
                ) : (
                  <div>
                    <Link to="/account/profile">
                      <p className="">{user?.fullName}</p>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="font-bold hover:text-primary-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Cart */}
            <CartDropdown />
          </div>
        </Container>
      </div>
    </header>
  );
}
