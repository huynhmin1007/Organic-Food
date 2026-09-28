import { Link } from "react-router-dom";
import type { Product } from "../types/product";
import clsx from "clsx";
import { getDiscountDisplay } from "../lib/discount";
import SaleBadge from "./SaleBadge";

interface ProductCardRowProps {
  product: Product;
  className?: string;
}

export default function ProductCardRow({
  product,
  className,
}: ProductCardRowProps) {
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

  return (
    <Link
      to={`/product/${product.slug}`}
      className={clsx(
        "overflow-hidden flex gap-2 bg-white py-2 px-2 rounded-md relative",
        className,
      )}
    >
      {productInfo.cornerBadge && (
        <div className="absolute top-1 right-1">
          <SaleBadge text={productInfo.cornerBadge} />
        </div>
      )}
      <img
        src={product.thumbnailUrl}
        alt={product.name}
        className="w-24 h-24 object-contain shrink-0"
      />
      <div className="flex flex-col flex-1 min-w-0 gap-0.5 justify-between">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-baseline gap-1 flex-wrap">
            <span className="text-red-600 font-bold text-base">
              {productInfo.sellingPrice.toLocaleString("vi-VN")}đ
            </span>
            <span className="text-xs text-neutral-500">
              /{product.packDetail}
            </span>
          </div>
          {productInfo.originalPrice && (
            <span className="text-neutral-400 text-xs line-through">
              {productInfo.originalPrice.toLocaleString("vi-VN")}đ
            </span>
          )}
        </div>
        <span className="text-sm text-neutral-700 line-clamp-1 font-semibold">
          {product.name}
        </span>
        {productInfo.belowPriceText && (
          <div className="flex items-center gap-1.5 mt-3 overflow-hidden">
            <span className="text-orange-400 text-xs font-medium shrink-0">
              {productInfo.belowPriceText}
            </span>
            {productInfo.belowPriceBadge && (
              <SaleBadge text={productInfo.belowPriceBadge} />
            )}
          </div>
        )}

        {!productInfo.belowPriceText && packDiscountInfo && (
          <div className="flex items-center gap-1.5 mt-3 overflow-hidden">
            <span className="text-orange-400 text-xs font-medium shrink-0">
              {packDiscountInfo.belowPriceText}
            </span>
            {packDiscountInfo.belowPriceBadge && (
              <SaleBadge text={packDiscountInfo.belowPriceBadge} />
            )}
          </div>
        )}
        <button
          type="button"
          className="cursor-pointer mt-2 self-start bg-primary-50 text-primary-600 font-semibold text-sm rounded-md px-4 py-1.5 hover:bg-primary-100 transition-colors"
        >
          MUA
        </button>
      </div>
    </Link>
  );
}
