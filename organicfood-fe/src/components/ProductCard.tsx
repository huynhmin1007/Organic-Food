import { Link, useNavigate } from "react-router-dom";
import type { Product } from "../types/product";
import { getDiscountDisplay } from "../lib/discount";
import SaleBadge from "./SaleBadge";
import { Check, ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type React from "react";
import { useCart } from "../context/CartContext";
import Spinner from "./ui/Spinner";
import { withMinDuration } from "../lib/withMinDuration";

export interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [justAdded, setJustAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();
  const navigate = useNavigate();
  const discounts = product.discounts ?? [];

  const productInfo = getDiscountDisplay({
    categoryId: product.categoryId,
    packDetail: product.packDetail,
    price: product.price,
    discount: discounts[0],
  });

  const packDiscountInfo = getDiscountDisplay({
    categoryId: product.categoryId,
    packDetail: product.packDetail,
    price: product.price,
    discount: discounts[1],
  });

  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    try {
      setIsAdding(true);
      await withMinDuration(addItem(product.id, 1));

      setJustAdded(true);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setJustAdded(false), 1200);
    } catch (err) {
      if (err instanceof Error && err.message === "NOT_AUTHENTICATED") {
        navigate("/account/login");
        return;
      }
    } finally {
      setIsAdding(false);
    }
  }

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block h-full rounded-md hover:shadow-md transition-shadow relative"
    >
      <div className="flex flex-col">
        <div className="w-full rounded-t-md aspect-square overflow-hidden relative">
          <img
            src={product.thumbnailUrl}
            alt={product.name}
            className="w-full h-full object-contain"
          />

          <div
            className="absolute inset-0 bg-black/20
                        translate-y-[40%] opacity-0
                        group-hover:translate-y-0 group-hover:opacity-100
                        transition-all duration-500 ease-out
                        flex items-center justify-center"
          >
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="cursor-pointer bg-primary-500 text-white rounded-full p-3 shadow-lg transition-transform hover:scale-110 disabled:opacity-90 disabled:pointer-events-none"
            >
              {isAdding ? (
                <Spinner
                  size={"sm"}
                  className="text-white h-[16] w-[16]"
                  text=""
                />
              ) : justAdded ? (
                <Check size={16} />
              ) : (
                <ShoppingCart size={16} />
              )}
            </button>
          </div>
        </div>
        <h3 className="h-10 mt-4 mx-2 text-neutral-700 text-sm line-clamp-2 group-hover:text-primary-500 transition-colors">
          {product.name}
        </h3>

        <div className="p-2 flex flex-col gap-1">
          <div className="flex items-baseline gap-1">
            <span className="text-neutral-800 font-bold text-sm">
              {productInfo.sellingPrice.toLocaleString("vi-VN")}đ
            </span>
            {product.packDetail && (
              <span className="text-neutral-600 text-xs">
                /{product.packDetail}
              </span>
            )}
          </div>
          {productInfo.originalPrice && (
            <span className="text-neutral-400 text-xs line-through">
              {productInfo.originalPrice.toLocaleString("vi-VN")}đ
            </span>
          )}
          {productInfo.pricePerKgText && (
            <span className="text-neutral-400 text-xs mt-1">
              {productInfo.pricePerKgText}
            </span>
          )}

          {productInfo.belowPriceText && (
            <div className="flex items-center gap-1.5 mt-3 flex-wrap">
              <span className="text-orange-400 text-xs font-medium">
                {productInfo.belowPriceText}
              </span>
              {productInfo.belowPriceBadge && (
                <SaleBadge text={productInfo.belowPriceBadge} />
              )}
            </div>
          )}

          {!productInfo.belowPriceText && packDiscountInfo && (
            <div className="flex items-center gap-1.5 mt-3 flex-wrap">
              <span className="text-orange-400 text-xs font-medium">
                {packDiscountInfo.belowPriceText}
              </span>
              {packDiscountInfo.belowPriceBadge && (
                <SaleBadge text={packDiscountInfo.belowPriceBadge} />
              )}
            </div>
          )}

          {productInfo.cornerBadge && (
            <div className="absolute top-2 right-2">
              <SaleBadge text={productInfo.cornerBadge} />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
