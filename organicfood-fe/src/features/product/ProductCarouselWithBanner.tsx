import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import MemberCard from "./MemberCard";
import member1 from "../../assets/member_1.webp";
import member2 from "../../assets/member_2.webp";
import member3 from "../../assets/member_3.webp";
import member4 from "../../assets/member_4.webp";

type Member = {
  id: number;
  imageUrl: string;
  name: string;
  originalPrice: number;
  sellingPrice: number;
  discountPercent: number;
};

const IMAGES = [member1, member2, member3, member4];

const FAKE_PRODUCTS: Member[] = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1,
  name: [
    "Gói thành viên OrgaEats",
    "Gói thành viên OrgaLife",
    "Gói thành viên OrgaLove",
    "Gói thành viên OrgaPlus",
  ][i],
  originalPrice: [6195000, 46800000, 21850000, 13090000][i],
  sellingPrice: [5900000, 39000000, 19000000, 11900000][i],
  discountPercent: [5, 20, 15, 10][i],
  imageUrl: IMAGES[i],
}));

const PAGE_SIZE = 3;
const MAX_PAGE = 2;

export default function ProductCarouselWithBanner({
  banner,
  viewAllHref = "/",
}: {
  banner: string;
  viewAllHref?: string;
}) {
  const [page, setPage] = useState(0);
  const [offset, setOffset] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const isAnimating = useRef(false);

  const products = FAKE_PRODUCTS.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE,
  );

  const goTo = (nextPage: number) => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const goingRight = nextPage > page;
    setOffset(goingRight ? -32 : 32);
    setOpacity(0);

    setTimeout(() => {
      setPage(nextPage);
      setOffset(goingRight ? 32 : -32);
      setOpacity(0);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setOffset(0);
          setOpacity(1);
          setTimeout(() => {
            isAnimating.current = false;
          }, 300);
        });
      });
    }, 250);
  };

  return (
    <div>
      <div className="flex gap-6">
        {/* Cột trái: banner cố định */}
        <div className="w-[455px] shrink-0">
          <img
            src={banner}
            alt="banner"
            className="w-full h-full object-cover cursor-pointer"
          />
        </div>

        <div className="flex-1 relative px-6">
          <div className="overflow-hidden h-[420px]">
            <div
              className="grid grid-cols-3 gap-4 transition-all duration-300 ease-out"
              style={{ transform: `translateX(${offset}px)`, opacity }}
            >
              {products.map((p) => (
                <div
                  key={p.id}
                  className="rounded-md hover:shadow-md transition-shadow"
                >
                  <MemberCard member={p} />
                </div>
              ))}
            </div>
          </div>

          {page > 0 && (
            <button
              onClick={() => goTo(page - 1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -mt-20
                         bg-white border border-neutral-200 rounded-full p-2
                         shadow-md hover:border-primary-500 hover:text-primary-500
                         transition-colors z-10"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {page < MAX_PAGE && (
            <button
              onClick={() => goTo(page + 1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mt-20
                         bg-white border border-neutral-200 rounded-full p-2
                         shadow-md hover:border-primary-500 hover:text-primary-500
                         transition-colors z-10"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Xem tất cả */}
      <div className="flex justify-center mt-6">
        <Link
          to={viewAllHref}
          className="border rounded-md px-4 py-2 border-primary-500 text-primary-500
                     hover:text-white hover:bg-primary-500 transition-colors
                     inline-flex items-center w-36"
        >
          <span className="flex-1 text-center">Xem tất cả</span>
          <ChevronRight size={20} />
        </Link>
      </div>
    </div>
  );
}
