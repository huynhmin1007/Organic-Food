import { useEffect, useMemo, useRef, useState } from "react";
import type { Category } from "../../lib/types/category";
import { Link } from "react-router-dom";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

type ScrollableCategoryRowProps =
  | {
      categories: Category[];
      size?: "md" | "sm";
      mode: "navigate";
      selectedId: number | null;
    }
  | {
      categories: Category[];
      size?: "md" | "sm";
      mode: "multiSelect";
      selectedIds: Set<number>;
      onToggle: (category: Category) => void;
    };

export default function ScrollableCategoryRow(
  props: ScrollableCategoryRowProps,
) {
  const { categories, size = "md" } = props;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const isCategorySelected = (cat: Category): boolean =>
    props.mode === "navigate"
      ? cat.id === props.selectedId
      : props.selectedIds.has(cat.id);

  const displayCategories = useMemo(() => {
    if (props.mode !== "navigate") return categories;

    const selected = categories.filter(isCategorySelected);
    const unselected = categories.filter((c) => !isCategorySelected(c));
    return [...selected, ...unselected];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    categories,
    props.mode,
    props.mode === "navigate" ? props.selectedId : props.selectedIds,
  ]);

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
  }, [categories]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (categories.length === 0) return null;

  const textSize = size === "md" ? "text-sm" : "text-xs";
  const itemWidth = size === "md" ? "w-24" : "w-18";

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden"
      >
        {displayCategories.map((cat) => {
          const isSelected =
            props.mode === "navigate"
              ? cat.id === props.selectedId
              : props.selectedIds.has(cat.id);

          const content = (
            <>
              <div>
                {cat.imageUrl && (
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-16 h-16 object-contain"
                  />
                )}
                {isSelected && props.mode === "multiSelect" && (
                  <span className="absolute top-0.5 right-0.5 bg-primary-500 text-white rounded-full p-0.5">
                    <Check size={10} strokeWidth={3} />
                  </span>
                )}
              </div>
              <span
                className={`${textSize} text-center leading-tight ${
                  isSelected ? "text-primary-500" : ""
                }`}
              >
                {cat.name}
              </span>
            </>
          );

          const itemClass = `relative flex flex-col items-center gap-1 border rounded-md p-2 
          hover:bg-primary-50 hover:border-primary-500 transition-colors shrink-0 ${itemWidth}
          ${isSelected ? "border border-primary-500" : ""}`;

          if (props.mode === "navigate") {
            return (
              <Link key={cat.id} to={`/${cat.slug}`} className={itemClass}>
                {content}
              </Link>
            );
          }

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => props.onToggle(cat)}
              className={itemClass}
            >
              {content}
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
