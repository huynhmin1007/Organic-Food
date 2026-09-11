import type { DiscountDisplay } from "./discount";
import type { OrderItemResponse } from "./types/order";

export function getOrderItemDisplay(item: OrderItemResponse): DiscountDisplay {
  const hasDiscount = item.unitPrice < item.originalPrice;
  const percentOff = hasDiscount
    ? Math.round((1 - item.unitPrice / item.originalPrice) * 100)
    : 0;

  switch (item.discountType) {
    case "PERCENTAGE":
      return {
        sellingPrice: item.unitPrice,
        originalPrice: hasDiscount ? item.originalPrice : undefined,
        cornerBadge: hasDiscount ? `-${percentOff}%` : undefined,
      };

    case "FIXED_PRICE_FOR_QUANTITY":
    case "BUY_X_GET_Y_PERCENT_OFF":
      return {
        sellingPrice: item.unitPrice,
        belowPriceText: item.discountLabel ?? undefined,
        belowPriceBadge: percentOff > 0 ? `-${percentOff}%` : undefined,
      };

    case "BUY_X_GET_Y_FREE":
      return {
        sellingPrice: item.unitPrice,
        belowPriceText: item.discountLabel ?? undefined,
      };

    default:
      return { sellingPrice: item.unitPrice };
  }
}
