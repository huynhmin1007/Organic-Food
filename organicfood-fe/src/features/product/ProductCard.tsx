import { Link } from "react-router-dom";
import { Check, ShoppingCart } from "lucide-react";
import { getDiscountDisplay, getPricePerKgText } from "../../lib/discount";
import type { Product } from "../../lib/types/product";
import { useCategory } from "../../contexts/CategoryContext";
import { useCart } from "../../contexts/CartContext";
import { useState } from "react";

export default function ProductCard({ product }: { product: Product }) {
  const { categoryIdToSlug } = useCategory();
  const categorySlug = categoryIdToSlug.get(product.categoryId);
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const discountInfo = getDiscountDisplay(product);
  const pricePerKgText = getPricePerKgText(
    product.categoryId,
    product.packDetail,
    discountInfo.sellingPrice,
  );
  const href = categorySlug ? `/${categorySlug}/${product.slug}` : "#";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!categorySlug) return;

    addItem(product.id, 1);

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <Link to={href} className="group cursor-pointer block">
      {/* Ảnh */}
      <div className="relative rounded-sm overflow-hidden aspect-square">
        <img
          src={product.thumbnailUrl}
          alt={product.name}
          className="w-full h-full object-contain p-4"
        />

        {discountInfo.cornerBadge && (
          <span
            className="absolute top-2 right-2 bg-sale text-white
                     text-xs font-bold px-1.5 py-0.5 rounded"
          >
            {discountInfo.cornerBadge}
          </span>
        )}

        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/20
                        translate-y-[40%] opacity-0
                        group-hover:translate-y-0 group-hover:opacity-100
                        transition-all duration-500 ease-out
                        flex items-center justify-center"
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart(e);
            }}
            className="bg-primary-500 text-white rounded-full p-3 shadow-lg
                       transition-transform hover:scale-110"
          >
            {justAdded ? (
              <Check size={16} className="text-white" />
            ) : (
              <ShoppingCart size={16} className="text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-2 px-2 pb-4">
        <p
          className="text-sm text-neutral-700 truncate
                group-hover:text-primary-500 transition-colors duration-200"
        >
          {product.name}
        </p>

        {/* Giá */}
        <div className="flex items-baseline gap-1 mt-4">
          <p className="text-neutral-800 font-bold text-sm">
            {discountInfo.sellingPrice.toLocaleString("vi-VN")}đ
          </p>

          {product.packDetail && (
            <p className="text-xs text-neutral-600">/{product.packDetail}</p>
          )}
        </div>

        {discountInfo.originalPrice && (
          <p className="text-neutral-400 text-xs line-through mt-1">
            {discountInfo.originalPrice.toLocaleString("vi-VN")}đ
          </p>
        )}

        {pricePerKgText && (
          <span className="text-neutral-400 font-normal text-xs">
            {pricePerKgText}
          </span>
        )}

        {/* Khuyến mãi theo số lượng */}
        {discountInfo.belowPriceText && (
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            <p className="text-orange-400 text-xs font-medium">
              {discountInfo.belowPriceText}
            </p>
            {discountInfo.belowPriceBadge && (
              <span
                className="bg-sale text-white
                     text-[10px] font-bold px-1.5 py-0.5 rounded"
              >
                {discountInfo.belowPriceBadge}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
