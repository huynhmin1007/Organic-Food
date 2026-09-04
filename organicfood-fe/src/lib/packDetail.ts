import type { Product } from "./types/product";

const PRICE_PER_KG_CATEGORY_IDS = new Set([1, 2, 3, 4, 5]);

/**
 * Parse packDetail dạng "300g", "450g", "1.2kg", "1,2kg" -> số gram.
 * Trả về null nếu không parse được (format lạ, rỗng...).
 */
export function parsePackDetailToGrams(
  packDetail: string | null | undefined,
): number | null {
  if (!packDetail) return null;

  const match = packDetail.trim().match(/^(\d+(?:[.,]\d+)?)\s*(kg|g)$/i);
  if (!match) return null;

  const value = parseFloat(match[1].replace(",", "."));
  if (isNaN(value) || value <= 0) return null;

  const unit = match[2].toLowerCase();
  return unit === "kg" ? value * 1000 : value;
}

/**
 * Trả về text "(129.000đ/kg)" nếu sản phẩm thuộc category cần hiển thị
 * và packDetail parse được, ngược lại trả về null.
 * `price` truyền vào là giá đang hiển thị (giá sau khi đã tính discount nếu có).
 */
export function getPricePerKgText(
  product: Product,
  price: number,
): string | null {
  if (!PRICE_PER_KG_CATEGORY_IDS.has(product.categoryId)) return null;

  const grams = parsePackDetailToGrams(product.packDetail);
  if (!grams) return null;

  const rawPricePerKg = (price / grams) * 1000;
  const pricePerKg = Math.round(rawPricePerKg / 1000) * 1000; // làm tròn về hàng nghìn

  return `(${pricePerKg.toLocaleString("vi-VN")}đ/kg)`;
}
