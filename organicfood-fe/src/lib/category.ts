import type { Category } from "./types/category";

/** Tìm đường đi từ gốc -> node có slug khớp. Trả null nếu không tìm thấy. */
export function findCategoryPath(
  categories: Category[],
  slug: string,
): Category[] | null {
  for (const cat of categories) {
    if (cat.slug === slug) return [cat];
    if (cat.children?.length) {
      const childPath = findCategoryPath(cat.children, slug);
      if (childPath) return [cat, ...childPath];
    }
  }
  return null;
}

/** Duyệt phẳng toàn bộ cây category (mọi cấp). */
export function flattenCategories(categories: Category[]): Category[] {
  const result: Category[] = [];
  for (const cat of categories) {
    result.push(cat);
    if (cat.children?.length) result.push(...flattenCategories(cat.children));
  }
  return result;
}

/** Lọc category có tên chứa keyword (không phân biệt hoa/thường). */
export function filterCategoriesByKeyword(
  categories: Category[],
  keyword: string,
): Category[] {
  const kw = keyword.trim().toLowerCase();
  if (!kw) return [];
  return flattenCategories(categories).filter((c) =>
    c.name.toLowerCase().includes(kw),
  );
}

export function buildCategoryIdToSlugMap(
  categories: Category[],
): Map<number, string> {
  const map = new Map<number, string>();

  function walk(nodes: Category[]) {
    for (const node of nodes) {
      map.set(node.id, node.slug);
      if (node.children?.length) walk(node.children);
    }
  }

  walk(categories);
  return map;
}
