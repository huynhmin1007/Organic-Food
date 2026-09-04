import type { ProductDiscount } from "./types/product";

export type CartLinePricing = {
  unitOriginalPrice: number;
  lineOriginalTotal: number; // unitOriginalPrice * quantity
  lineFinalTotal: number; // số tiền thực phải trả cho dòng này
  savings: number; // lineOriginalTotal - lineFinalTotal
  cornerBadge?: string;
  belowPriceText?: string;
  belowPriceBadge?: string;
};

type PriceSource = {
  price: number;
  discounts: ProductDiscount[] | null | undefined;
};

export function calculateCartLinePricing(
  source: PriceSource,
  quantity: number,
): CartLinePricing {
  const basePrice = source.price;
  const lineOriginalTotal = basePrice * quantity;
  const discount = source.discounts?.[0];

  if (!discount) {
    return {
      unitOriginalPrice: basePrice,
      lineOriginalTotal,
      lineFinalTotal: lineOriginalTotal,
      savings: 0,
    };
  }

  switch (discount.discountType) {
    case "PERCENTAGE": {
      const percent = discount.discountPercent;
      const unitFinal = Math.round(basePrice * (1 - percent / 100));
      const lineFinalTotal = unitFinal * quantity;

      return {
        unitOriginalPrice: basePrice,
        lineOriginalTotal,
        lineFinalTotal,
        savings: lineOriginalTotal - lineFinalTotal,
        cornerBadge: `-${percent}%`,
      };
    }

    case "FIXED_PRICE_FOR_QUANTITY": {
      const { buyQuantity, fixedPrice } = discount;
      const bundles = Math.floor(quantity / buyQuantity);
      const remainder = quantity % buyQuantity;
      const lineFinalTotal = bundles * fixedPrice + remainder * basePrice;

      const originalPerBundle = basePrice * buyQuantity;
      const percent =
        originalPerBundle > 0
          ? Math.round((1 - fixedPrice / originalPerBundle) * 100)
          : 0;

      return {
        unitOriginalPrice: basePrice,
        lineOriginalTotal,
        lineFinalTotal,
        savings: lineOriginalTotal - lineFinalTotal,
        belowPriceText: `Mua ${buyQuantity} giảm còn ${fixedPrice.toLocaleString("vi-VN")}đ`,
        belowPriceBadge:
          bundles > 0 && percent > 0 ? `-${percent}%` : undefined,
      };
    }

    case "BUY_X_GET_Y_FREE": {
      const { buyQuantity, getQuantity } = discount;
      const groupSize = buyQuantity + getQuantity;
      const bundles = Math.floor(quantity / groupSize);
      const remainder = quantity % groupSize;
      const paidUnits =
        bundles * buyQuantity + Math.min(remainder, buyQuantity);
      const lineFinalTotal = paidUnits * basePrice;

      return {
        unitOriginalPrice: basePrice,
        lineOriginalTotal,
        lineFinalTotal,
        savings: lineOriginalTotal - lineFinalTotal,
        belowPriceText: `Mua ${buyQuantity} tặng ${getQuantity}`,
      };
    }

    case "BUY_X_GET_Y_PERCENT_OFF": {
      const { buyQuantity, discountPercent } = discount;
      const qualifies = quantity >= buyQuantity;
      const unitFinal = qualifies
        ? Math.round(basePrice * (1 - discountPercent / 100))
        : basePrice;
      const lineFinalTotal = unitFinal * quantity;

      return {
        unitOriginalPrice: basePrice,
        lineOriginalTotal,
        lineFinalTotal,
        savings: lineOriginalTotal - lineFinalTotal,
        belowPriceText: `Mua ${buyQuantity} giảm ${discountPercent}%`,
        belowPriceBadge: qualifies ? `-${discountPercent}%` : undefined,
      };
    }

    default:
      return {
        unitOriginalPrice: basePrice,
        lineOriginalTotal,
        lineFinalTotal: lineOriginalTotal,
        savings: 0,
      };
  }
}
