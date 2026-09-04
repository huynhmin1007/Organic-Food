import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getDiscountDisplay, getPricePerKgText } from "../../lib/discount";
import type { Product } from "../../lib/types/product";
import { useCategory } from "../../contexts/CategoryContext";
import { Link } from "react-router-dom";

type ScrollableProductRowProps = {
  title?: string;
  products: Product[];
  itemsPerView?: number; // số card hiển thị vừa khung nhìn, mặc định 3
};

export default function ScrollableProductRow(props: ScrollableProductRowProps) {
  const { title, products, itemsPerView = 3 } = props;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [dotCount, setDotCount] = useState(1);
  const [activeDot, setActiveDot] = useState(0);

  const GAP_PX = 12; // khớp với gap-3 bên dưới

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);

    const dots = Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth));
    setDotCount(dots);

    const maxScroll = el.scrollWidth - el.clientWidth;
    setActiveDot(
      maxScroll > 0 ? Math.round((el.scrollLeft / maxScroll) * (dots - 1)) : 0,
    );
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [products, itemsPerView]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth; // trượt đúng 1 "trang" (đủ số card đang hiển thị)
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (products.length === 0) return null;

  return (
    <div className="relative bg-gradient-to-b from-[#4AC15C] to-[#B4FFBF] rounded-xl p-4">
      {title && <h2 className="text-white font-bold text-lg mb-3">{title}</h2>}

      <div className="">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => {
            const { categoryIdToSlug } = useCategory();
            const categorySlug = categoryIdToSlug.get(product.categoryId);
            const discountInfo = getDiscountDisplay(product);
            const pricePerKgText = getPricePerKgText(
              product.categoryId,
              product.packDetail,
              discountInfo.sellingPrice,
            );
            const href = categorySlug
              ? `/${categorySlug}/${product.slug}`
              : "#";

            return (
              <Link
                to={href}
                key={product.id}
                style={{
                  width: `calc((100% - ${GAP_PX * (itemsPerView - 1)}px) / ${itemsPerView})`,
                }}
                className="relative bg-white rounded-lg shrink-0 flex overflow-hidden"
              >
                {discountInfo.cornerBadge && (
                  <span
                    className="absolute top-2 right-2 bg-sale text-white
                       text-xs font-bold px-1.5 py-0.5 rounded z-10"
                  >
                    {discountInfo.cornerBadge}
                  </span>
                )}

                <img
                  src={product.thumbnailUrl}
                  alt={product.name}
                  className="w-24 h-24 object-contain p-2 shrink-0"
                />

                <div className="flex flex-col justify-between py-2 pr-3 flex-1 min-w-0">
                  <div>
                    <div className="flex items-baseline gap-1 flex-wrap">
                      <p className="text-red-600 font-bold text-base">
                        {discountInfo.sellingPrice.toLocaleString("vi-VN")}đ
                      </p>
                      {product.packDetail && (
                        <p className="text-xs text-neutral-500">
                          /{product.packDetail}
                        </p>
                      )}
                    </div>

                    {discountInfo.originalPrice && (
                      <p className="text-neutral-400 text-xs line-through">
                        {discountInfo.originalPrice.toLocaleString("vi-VN")}đ
                      </p>
                    )}

                    {pricePerKgText && (
                      <span className="text-neutral-400 text-xs">
                        {pricePerKgText}
                      </span>
                    )}

                    <p className="text-sm text-neutral-700 line-clamp-1 mt-0.5">
                      {product.name}
                    </p>

                    {discountInfo.belowPriceText && (
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <p className="text-orange-500 text-xs font-medium">
                          {discountInfo.belowPriceText}
                        </p>
                        {discountInfo.belowPriceBadge && (
                          <span className="bg-sale text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                            {discountInfo.belowPriceBadge}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="mt-2 self-start bg-primary-50 text-primary-600
                               font-semibold text-sm rounded-md px-4 py-1.5 hover:bg-primary-100
                               transition-colors"
                  >
                    MUA
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          aria-label="Trượt trái"
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[50%] w-7 rounded-r-lg
                       bg-neutral-500/40 hover:bg-neutral-500/60 text-white
                       flex items-center justify-center transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          aria-label="Trượt phải"
          className="absolute right-0 top-1/2 -translate-y-1/2 h-[50%] w-7 rounded-l-lg
                       bg-neutral-500/40 hover:bg-neutral-500/60 text-white
                       flex items-center justify-center transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      )}

      {dotCount > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {Array.from({ length: dotCount }).map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === activeDot ? "w-4 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
