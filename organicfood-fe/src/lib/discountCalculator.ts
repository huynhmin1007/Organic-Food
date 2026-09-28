// src/lib/discountCalculator.ts
import type { Product, ProductDiscount } from "../types/product";

/* ------------------------------ Types ------------------------------ */

export interface DiscountLineResult {
  quantity: number;
  freeQuantity: number;
  unitPrice: number;
  originalPrice: number;
  lineTotal: number;
  discount: ProductDiscount | null; // null = nothing applies at this quantity
}

export interface CartLineDisplay {
  unitPrice: number;
  originalUnitPrice?: number; // only set when the unit price is actually lower
  lineTotal: number;
  originalLineTotal?: number; // only set when the line is actually cheaper
  badge?: string; // e.g. "-13%"
  promoText?: string; // what was applied, e.g. "2 combo x 48.000đ"
  savedAmount: number;
}

/* ----------------------------- Helpers ----------------------------- */

const roundHalfUp = (n: number) => Math.round(n + 1e-9); // matches Java HALF_UP

export function formatVnd(amount: number) {
  return `${Math.round(amount).toLocaleString("vi-VN")}đ`;
}

function noDiscount(price: number, quantity: number): DiscountLineResult {
  return {
    quantity,
    freeQuantity: 0,
    unitPrice: price,
    originalPrice: price,
    lineTotal: price * quantity,
    discount: null,
  };
}

// Skip discounts that expired after the cart was loaded. The server still has
// the final say on the charged amount.
function isExpired(d: ProductDiscount) {
  return !!d.endAt && new Date(d.endAt).getTime() <= Date.now();
}

/* ------------------------- Per-type calculation ------------------------- */

function percentage(
  d: ProductDiscount,
  quantity: number,
  price: number,
): DiscountLineResult {
  const unitPrice = roundHalfUp((price * (100 - d.discountPercent)) / 100);
  return {
    quantity,
    freeQuantity: 0,
    unitPrice,
    originalPrice: price,
    lineTotal: unitPrice * quantity,
    discount: d,
  };
}

function fixedPriceForQuantity(
  d: ProductDiscount,
  quantity: number,
  price: number,
): DiscountLineResult {
  if (!d.buyQuantity) return noDiscount(price, quantity);

  const bundles = Math.floor(quantity / d.buyQuantity);
  const remainder = quantity % d.buyQuantity;
  const lineTotal = d.fixedPrice * bundles + price * remainder;
  const unitPrice = quantity > 0 ? roundHalfUp(lineTotal / quantity) : 0;

  return {
    quantity,
    freeQuantity: 0,
    unitPrice,
    originalPrice: price,
    lineTotal,
    discount: d,
  };
}

function buyXGetYFree(
  d: ProductDiscount,
  quantity: number,
  price: number,
): DiscountLineResult {
  if (!d.buyQuantity) return noDiscount(price, quantity);

  const freeQuantity = Math.floor((quantity * d.getQuantity) / d.buyQuantity);
  return {
    quantity,
    freeQuantity,
    unitPrice: price,
    originalPrice: price,
    lineTotal: price * quantity,
    discount: d,
  };
}

function buyXGetYPercentOff(
  d: ProductDiscount,
  quantity: number,
  price: number,
): DiscountLineResult {
  const cycleSize = d.buyQuantity + d.getQuantity;
  if (!cycleSize) return noDiscount(price, quantity);

  const discountedUnits = Math.floor((quantity * d.getQuantity) / cycleSize);
  const fullPriceUnits = quantity - discountedUnits;

  // Like the backend, lineTotal stays unrounded; only unitPrice is rounded
  const lineTotal =
    price * fullPriceUnits +
    (price * (100 - d.discountPercent) * discountedUnits) / 100;
  const unitPrice = quantity > 0 ? roundHalfUp(lineTotal / quantity) : 0;

  return {
    quantity,
    freeQuantity: 0,
    unitPrice,
    originalPrice: price,
    lineTotal,
    discount: d,
  };
}

export function computeLine(
  price: number,
  discount: ProductDiscount | null | undefined,
  quantity: number,
): DiscountLineResult {
  if (!discount) return noDiscount(price, quantity);

  switch (discount.discountType) {
    case "PERCENTAGE":
      return percentage(discount, quantity, price);
    case "FIXED_PRICE_FOR_QUANTITY":
      return fixedPriceForQuantity(discount, quantity, price);
    case "BUY_X_GET_Y_FREE":
      return buyXGetYFree(discount, quantity, price);
    case "BUY_X_GET_Y_PERCENT_OFF":
      return buyXGetYPercentOff(discount, quantity, price);
    default:
      return noDiscount(price, quantity);
  }
}

/* --------------------------- Picking the best --------------------------- */

// Same as the backend's benefit(): value of everything received minus what is paid
export function benefit(r: DiscountLineResult) {
  return r.originalPrice * (r.quantity + r.freeQuantity) - r.lineTotal;
}

// Evaluate every discount on the product, keep the one with the highest
// benefit, and only if that benefit is strictly positive (ties keep the
// earlier discount, like the backend).
export function pickBestLine(
  product: Product,
  quantity: number,
): DiscountLineResult {
  let best = noDiscount(product.price, quantity);
  let bestBenefit = 0;

  for (const discount of product.discounts ?? []) {
    if (isExpired(discount)) continue;

    const candidate = computeLine(product.price, discount, quantity);
    const candidateBenefit = benefit(candidate);

    if (candidateBenefit > bestBenefit) {
      bestBenefit = candidateBenefit;
      best = candidate;
    }
  }

  return best;
}

/* ---------------------------- Cart display ---------------------------- */

// Text is built from the calculated result, never from discount.label
export function getCartLineDisplay(line: DiscountLineResult): CartLineDisplay {
  const originalLineTotal = line.originalPrice * line.quantity;
  const savedAmount = Math.max(0, Math.round(benefit(line)));

  const display: CartLineDisplay = {
    unitPrice: line.unitPrice,
    originalUnitPrice:
      line.unitPrice < line.originalPrice ? line.originalPrice : undefined,
    lineTotal: line.lineTotal,
    originalLineTotal:
      line.lineTotal < originalLineTotal ? originalLineTotal : undefined,
    savedAmount,
  };

  const d = line.discount;
  if (!d) return display;

  switch (d.discountType) {
    case "PERCENTAGE": {
      display.badge = `-${d.discountPercent}%`;
      break;
    }

    case "FIXED_PRICE_FOR_QUANTITY": {
      const bundles = Math.floor(line.quantity / d.buyQuantity);
      const bundleOriginal = line.originalPrice * d.buyQuantity;
      const percent =
        bundleOriginal > 0
          ? Math.round((1 - d.fixedPrice / bundleOriginal) * 100)
          : 0;

      display.promoText = `Combo ${d.buyQuantity} sản phẩm ${formatVnd(d.fixedPrice)}`;
      if (percent > 0) display.badge = `-${percent}%`;
      break;
    }

    case "BUY_X_GET_Y_FREE": {
      display.promoText = `Được tặng kèm ${line.freeQuantity} sản phẩm`;
      break;
    }

    case "BUY_X_GET_Y_PERCENT_OFF": {
      const discountedUnits = Math.floor(
        (line.quantity * d.getQuantity) / (d.buyQuantity + d.getQuantity),
      );
      display.promoText = `${discountedUnits} sản phẩm được giảm ${d.discountPercent}%`;
      break;
    }
  }

  return display;
}
