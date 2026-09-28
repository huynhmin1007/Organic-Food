import { BadgePercent, ChevronDown } from "lucide-react";
import type { Category } from "../types/category";
import { useState } from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";

interface CategorMenuPanelProps {
  categories: Category[];
}

export default function CategoryMenuPanel({
  categories,
}: CategorMenuPanelProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  function toggle(id: number) {
    setExpandedId((current) => (current === id ? null : id));
  }

  return (
    <div>
      <Link to={`/products?onSale=true`}>
        <div className="flex items-center border-b border-stone-200 mx-2 py-3 cursor-pointer">
          <BadgePercent size={22} className="fill-red-500 stroke-white" />
          <span className="hover:text-primary-500 mx-2 text-base font-medium">
            KHUYẾN MÃI SỐC
          </span>
        </div>
      </Link>

      {categories.map((c) => {
        const isExpanded = expandedId === c.id;
        const hasChildren = c.children.length > 0;

        return (
          <div
            key={c.id}
            className=""
            onClick={() => hasChildren && toggle(c.id)}
          >
            <div className="flex items-center justify-between mx-2 py-3 border-b border-stone-200 cursor-pointer">
              <div className="flex items-center">
                {c.imageUrl && (
                  <img
                    src={c.imageUrl}
                    alt={c.name}
                    className="w-[22px] h-[22px] shrink-0"
                  />
                )}
                <span className="hover:text-primary-500 mx-2 text-base font-medium">
                  {c.name}
                </span>
              </div>
              {hasChildren && (
                <ChevronDown
                  size={18}
                  className={clsx(
                    "text-stone-400 transition-transform duration-200",
                    isExpanded && "rotate-180",
                  )}
                />
              )}
            </div>

            {hasChildren && (
              <div
                className={clsx(
                  "grid transition-all duration-300 ease-in-out",
                  isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <div className="flex flex-col pb-2">
                    {c.children.map((child) => (
                      <Link
                        key={child.id}
                        to={`/products?categorySlug=${child.slug}`}
                        className="mx-2 pl-7 py-2 text-sm hover:text-primary-500"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
