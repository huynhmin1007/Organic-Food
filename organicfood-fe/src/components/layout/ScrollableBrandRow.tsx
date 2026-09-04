import { useEffect, useRef, useState } from "react";
import type { Brand } from "../../lib/types/brand";
import { Link } from "react-router-dom";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

type ScrollableBrandRowProps = {
  brands: Brand[];
  selectedBrands: string[];
  onToggle: (brand: Brand) => void;
};

export default function ScrollableBrandRow(props: ScrollableBrandRowProps) {
  const { brands, selectedBrands } = props;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = scrollRef.current;

    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
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
  }, [brands]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8; // cuộn ~80% chiều rộng khung nhìn mỗi lần bấm
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden"
      >
        {brands.map((brand) => {
          const isSelected = selectedBrands.includes(brand.slug);

          if (!brand.imageUrl) return;

          return (
            <button
              key={brand.id}
              className="border rounded-md border-neutral-300 shrink-0 w-16"
              type="button"
              onClick={() => props.onToggle(brand)}
            >
              <div className="relative">
                <img
                  src={brand.imageUrl}
                  alt={brand.name}
                  className="w-full h-full object-contain"
                />

                {isSelected && (
                  <span className="absolute -top-0 -right-0.5 bg-primary-500 text-white rounded-full p-0.5">
                    <Check size={10} strokeWidth={3} />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          aria-label="Trượt trái"
          className="absolute left-0 top-1/2 -translate-y-1/2
                     bg-neutral-500/60 hover:bg-neutral-600/70 text-white
                     rounded-full p-1.5 shadow"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          aria-label="Trượt phải"
          className="absolute right-0 top-1/2 -translate-y-1/2
                     bg-neutral-500/60 hover:bg-neutral-600/70 text-white
                     rounded-full p-1.5 shadow"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}
