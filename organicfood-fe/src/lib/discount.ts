import type { ProductDiscount } from "./types/product";

export type DiscountDisplay = {
  sellingPrice: number;
  originalPrice?: number;
  cornerBadge?: string;
  belowPriceText?: string;
  belowPriceBadge?: string;
};

type PriceSource = {
  price: number;
  discounts: ProductDiscount[] | null | undefined;
};

export function getDiscountDisplay(source: PriceSource): DiscountDisplay {
  const basePrice = source.price;
  const discount = source.discounts?.[0];

  if (!discount) {
    return { sellingPrice: basePrice };
  }

  switch (discount.discountType) {
    case "PERCENTAGE": {
      const percent = discount.discountPercent;
      const sellingPrice = Math.round(basePrice * (1 - percent / 100));
      return {
        sellingPrice,
        originalPrice: basePrice,
        cornerBadge: `-${percent}%`,
      };
    }

    case "FIXED_PRICE_FOR_QUANTITY": {
      const { buyQuantity, fixedPrice } = discount;
      const originalTotal = basePrice * buyQuantity;
      const percent =
        originalTotal > 0
          ? Math.round((1 - fixedPrice / originalTotal) * 100)
          : 0;

      return {
        sellingPrice: basePrice,
        belowPriceText: `Mua ${buyQuantity} giảm còn ${fixedPrice.toLocaleString("vi-VN")}đ`,
        belowPriceBadge: percent > 0 ? `-${percent}%` : undefined,
      };
    }

    case "BUY_X_GET_Y_FREE": {
      const { buyQuantity, getQuantity } = discount;
      return {
        sellingPrice: basePrice,
        belowPriceText: `Mua ${buyQuantity} tặng ${getQuantity}`,
      };
    }

    case "BUY_X_GET_Y_PERCENT_OFF": {
      const { buyQuantity, discountPercent } = discount;
      return {
        sellingPrice: basePrice,
        belowPriceText: `Mua ${buyQuantity} giảm ${discountPercent}%`,
      };
    }

    default:
      return { sellingPrice: basePrice };
  }
}

const PRICE_PER_KG_CATEGORY_IDS = new Set([1, 2, 3, 4, 5]);

export function parsePackDetailToGrams(
  packDetail: string | null | undefined,
): number | null {
  if (!packDetail) return null;
  const match = packDetail.trim().match(/^(\d+(?:[.,]\d+)?)\s*(kg|g)$/i);
  if (!match) return null;

  const value = parseFloat(match[1].replace(",", "."));
  if (isNaN(value) || value <= 0) return null;

  return match[2].toLowerCase() === "kg" ? value * 1000 : value;
}

export function getPricePerKgText(
  categoryId: number,
  packDetail: string | null | undefined,
  price: number,
): string | null {
  if (!PRICE_PER_KG_CATEGORY_IDS.has(categoryId)) return null;

  const grams = parsePackDetailToGrams(packDetail);
  if (!grams) return null;

  const rawPricePerKg = (price / grams) * 1000;
  const pricePerKg = Math.round(rawPricePerKg / 1000) * 1000;

  return `(${pricePerKg.toLocaleString("vi-VN")}đ/kg)`;
}
