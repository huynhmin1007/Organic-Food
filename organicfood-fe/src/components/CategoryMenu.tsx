import { Link } from "react-router-dom";
import { useState, type ReactNode } from "react";
import type { Category } from "../types/category";

interface CategoryMenuProps {
  categories: Category[];
  defaultRightContent?: ReactNode;
}

export default function CategoryMenu({
  categories,
  defaultRightContent,
}: CategoryMenuProps) {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const rightContent = activeCategory
    ? (renderChildrenGrid(activeCategory) ?? defaultRightContent)
    : defaultRightContent;

  return (
    <div className=" flex h-full" onMouseLeave={() => setActiveCategory(null)}>
      <aside className="border border-stone-200 bg-white w-72 shrink-0 border-r border-stone-200 overflow-y-auto scrollbar-hidden">
        {categories.map((c) => (
          <Link
            to={`/products?categorySlug=${c.slug}`}
            key={c.id}
            onMouseEnter={() => setActiveCategory(c)}
            className="flex hover:bg-stone-hover hover:text-primary-500 px-2 py-3"
          >
            {c.imageUrl && (
              <img
                src={c.imageUrl}
                alt={c.slug}
                className="w-[18px] h-[18px] shrink-0"
              />
            )}
            <span className="mx-2 text-base">{c.name}</span>
          </Link>
        ))}
      </aside>

      {rightContent && (
        <div className="flex-1 bg-white border-b border-r border-stone-200">
          {rightContent}
        </div>
      )}
    </div>
  );
}

function renderChildrenGrid(category: Category) {
  if (category.children.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-x-6 gap-y-3 p-4">
      {category.children.map((c) => (
        <Link
          key={c.id}
          to={`/products?categorySlug=${c.slug}`}
          className="text-sm hover:text-primary-500 font-bold"
        >
          {c.name}
        </Link>
      ))}
    </div>
  );
}
