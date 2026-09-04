import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BadgeCheckIcon,
  ChevronRight,
  GiftIcon,
  MenuIcon,
  StarIcon,
} from "lucide-react";
import banner from "../../assets/slider_2_1024x1024.webp";
import Container from "../ui/Container";
import type { Category } from "../../lib/types/category";
import { useCategory } from "../../contexts/CategoryContext";

function CategoryDropdown({
  fixed,
  categories,
}: {
  fixed: boolean;
  categories: Category[];
}) {
  const [hovered, setHovered] = useState<Category | null>(null);

  return (
    <div className="flex" onMouseLeave={() => setHovered(null)}>
      <div
        className="bg-white shadow-sm border border-neutral-200 flex flex-col w-72 h-[360px] shrink-0
                 overflow-y-auto
                 [&::-webkit-scrollbar]:w-1
                 [&::-webkit-scrollbar-track]:bg-transparent
                 [&::-webkit-scrollbar-thumb]:bg-primary-500
                 [&::-webkit-scrollbar-thumb]:rounded-full
                 [&::-webkit-scrollbar-button]:hidden"
      >
        {categories.map((cat) => (
          <div key={cat.id} onMouseEnter={() => setHovered(cat)}>
            <Link
              to={`/${cat.slug}`}
              className="flex items-center py-2 px-4 hover:text-primary-500 transition-colors"
            >
              {cat.imageUrl && (
                <img
                  src={cat.imageUrl}
                  alt={cat.slug}
                  className="w-[18px] h-[18px] mr-2 shrink-0"
                />
              )}

              <span>{cat.name}</span>

              {cat.children.length > 0 && (
                <ChevronRight size={16} className="ml-auto shrink-0" />
              )}
            </Link>
          </div>
        ))}
      </div>

      {fixed && <RightPanel hovered={hovered} />}
      {!fixed && hovered && hovered.children.length > 0 && (
        <RightPanel hovered={hovered} />
      )}
    </div>
  );
}

function RightPanel({ hovered }: { hovered: Category | null }) {
  return (
    <div className="bg-white shadow-sm border-r border-b border-neutral-200 flex-1 h-[360px]">
      {hovered && hovered.children.length > 0 ? (
        <div className="grid grid-cols-3 gap-x-8 gap-y-3 py-2 px-4">
          {hovered.children.map((child) => (
            <Link
              key={child.id}
              to={`/${child.slug}`}
              className="text-sm font-bold hover:text-primary-500 transition-colors"
            >
              {child.name}
            </Link>
          ))}
        </div>
      ) : (
        <img src={banner} alt="banner" className="w-full h-full" />
      )}
    </div>
  );
}

export default function CategoryMenu() {
  const { categories, loading, error } = useCategory();
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (loading) return <div></div>;

  return (
    // relative vẫn giữ để dropdown hover (trang khác) neo vào đây
    <div className="relative">
      {/* Nav bar */}
      <div className="bg-white shadow-sm">
        <Container className="flex items-center">
          <div
            className="py-3 flex shrink-0 items-center gap-3 w-64 hover:text-primary-500 cursor-pointer"
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <MenuIcon size={24} />
            <span>Danh sách sản phẩm</span>
          </div>

          <div className="ml-14 flex items-center gap-10">
            <div className="flex items-center gap-2">
              <StarIcon size={16} fill="currentColor" />
              <Link to="/" className="hover:text-primary-500">
                Chứng nhận Hữu Cơ
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <GiftIcon size={16} />
              <Link to="/" className="hover:text-primary-500">
                Hàng sỉ hữu cơ / tự nhiên giá tốt
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <BadgeCheckIcon size={16} />
              <Link to="/" className="hover:text-primary-500">
                Tự hào do doanh nghiệp nữ làm chủ
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* Trang chủ: trong flow */}
      {isHome && (
        <div className="max-w-6xl mx-auto">
          <CategoryDropdown categories={categories} fixed={true} />
        </div>
      )}

      {/* Trang khác: absolute overlay */}
      {!isHome && menuOpen && (
        <div className="absolute left-0 right-0 top-full z-50">
          <div
            className="max-w-6xl mx-auto"
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <CategoryDropdown categories={categories} fixed={false} />
          </div>
        </div>
      )}
    </div>
  );
}
