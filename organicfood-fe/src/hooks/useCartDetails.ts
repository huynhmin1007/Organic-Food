import { useMemo } from "react";
import { useCart } from "../contexts/CartContext";
import { getDiscountDisplay, type DiscountDisplay } from "../lib/discount";
import { useProductList } from "./useProduct";
import { useCategory } from "../contexts/CategoryContext";
import {
  calculateCartLinePricing,
  type CartLinePricing,
} from "../lib/cartPricing";

export type CartDetailedItem = {
  productId: string;
  quantity: number;
  name: string;
  slug: string;
  categorySlug: string;
  thumbnailUrl: string;
  pricing: CartLinePricing;
  stockQuantity: number;
};

export function useCartDetails() {
  const { items, updateQuantity, removeItem } = useCart();
  const { categoryIdToSlug } = useCategory();

  const productIds = useMemo(() => items.map((i) => i.productId), [items]);

  const { products, loading, error } = useProductList({
    productIds,
    size: Math.max(productIds.length, 1),
    enabled: productIds.length > 0,
  });

  const detailedItems: CartDetailedItem[] = useMemo(() => {
    return items
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;

        const pricing = calculateCartLinePricing(product, item.quantity);
        const categorySlug = categoryIdToSlug.get(product.categoryId) ?? "";

        return {
          productId: item.productId,
          quantity: item.quantity,
          name: product.name,
          slug: product.slug,
          categorySlug,
          thumbnailUrl: product.thumbnailUrl,
          pricing,
          stockQuantity: product.stockQuantity,
        };
      })
      .filter((i): i is CartDetailedItem => i !== null);
  }, [items, products, categoryIdToSlug]);

  const totalPrice = useMemo(
    () => detailedItems.reduce((sum, i) => sum + i.pricing.lineFinalTotal, 0),
    [detailedItems],
  );

  return {
    items: detailedItems,
    totalPrice,
    loading: productIds.length > 0 && loading,
    error,
    updateQuantity,
    removeItem,
  };
}
