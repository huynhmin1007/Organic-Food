import type { Category } from "../types/category";

export function findCategoryBySlug(
  categories: Category[],
  slug?: string,
): Category | null {
  if (!slug) return null;
  for (const c of categories) {
    if (c.slug === slug) return c;
    const found = findCategoryBySlug(c.children, slug);
    if (found) return found;
  }
  return null;
}

export function findCategoryPathBySlug(
  categories: Category[],
  slug?: string,
): Category[] {
  if (!slug) return [];

  for (const c of categories) {
    if (c.slug === slug) return [c];

    const childPath = findCategoryPathBySlug(c.children, slug);
    if (childPath.length > 0) return [c, ...childPath];
  }

  return [];
}

export function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ")
    .trim();
}

export function flattenCategories(categories: Category[]): Category[] {
  return categories.flatMap((c) => [c, ...flattenCategories(c.children)]);
}

function similarity(keyword: string, name: string): number {
  const k = normalizeText(keyword);
  const n = normalizeText(name);
  if (!k || !n) return 0;
  if (k === n) return 1;
  if (n.includes(k) || k.includes(n)) return 0.8;

  const kTokens = new Set(k.split(" "));
  const nTokens = new Set(n.split(" "));
  let shared = 0;
  kTokens.forEach((t) => nTokens.has(t) && shared++);
  return (shared / Math.max(kTokens.size, nTokens.size)) * 0.7;
}

export function findSimilarCategories(
  categories: Category[],
  keyword?: string | null,
  { threshold = 0.4, limit = 3 } = {},
): Category[] {
  if (!keyword?.trim()) return [];

  return flattenCategories(categories)
    .map((category) => ({
      category,
      score: similarity(keyword, category.name),
    }))
    .filter((x) => x.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.category);
}
