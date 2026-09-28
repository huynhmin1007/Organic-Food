import { Link } from "react-router-dom";
import { ShoppingBagIcon } from "./icon/ShoppingBagIcon";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { getDiscountDisplay } from "../lib/discount";
import { X } from "lucide-react";
import Button from "./ui/Button";
import SaleBadge from "./SaleBadge";

export default function Cart() {
  const { items, totalItems, totalAmount, discountAmount, removeItem } =
    useCart();
  const [isShowItems, setIsShowItems] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsShowItems(true)}
      onMouseLeave={() => setIsShowItems(false)}
    >
      <Link to={"/cart"}>
        <div className="hover:text-primary-500 hover:bg-white flex gap-2 items-center justify-center rounded-md border-2 border-white text-white px-2 py-2">
          <ShoppingBagIcon size={24} />
          <span>Giỏ hàng</span>
          <span>{totalItems}</span>
        </div>
      </Link>
      {isShowItems && (
        <div className="absolute bg-white right-0 top-full rounded-lg flex flex-col w-96 border border-stone-200 z-50 text-neutral-800">
          {totalItems === 0 ? (
            <p className="text-center text-neutral-500 py-10">
              Bạn chưa thêm sản phẩm nào vào giỏ hàng!
            </p>
          ) : (
            <div className="flex flex-col">
              <div
                className="overflow-y-auto max-h-96 divide-y divide-neutral-100
            [&::-webkit-scrollbar]:w-1.5
             [&::-webkit-scrollbar-track]:bg-transparent
             [&::-webkit-scrollbar-thumb]:bg-neutral-300
             [&::-webkit-scrollbar-thumb]:rounded-full
             [&::-webkit-scrollbar-thumb]:hover:bg-neutral-400
             [&::-webkit-scrollbar-button]:hidden"
              >
                {items.map((i) => {
                  const product = i.product;
                  const quantity = i.quantity;
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
                    <div key={product.id} className="flex gap-3 p-3">
                      <img
                        src={product.thumbnailUrl}
                        alt={product.name}
                        className="w-14 h-14 object-contain shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${product.slug}`}
                          className="text-sm hover:text-primary-500 line-clamp-2"
                        >
                          {product.name}
                        </Link>
                        <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                          <p className="text-sm font-bold text-neutral-800">
                            {productInfo.sellingPrice.toLocaleString("vi-VN")}đ
                          </p>
                          {productInfo.originalPrice && (
                            <p className="text-xs text-neutral-400 line-through">
                              {productInfo.originalPrice.toLocaleString(
                                "vi-VN",
                              )}
                              đ
                            </p>
                          )}
                          {productInfo.cornerBadge && (
                            <span className="bg-sale text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                              {productInfo.cornerBadge}
                            </span>
                          )}
                        </div>
                        {productInfo.belowPriceText && (
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <p className="text-orange-400 text-xs font-medium">
                              {productInfo.belowPriceText}
                            </p>
                            {productInfo.belowPriceBadge && (
                              <SaleBadge text={productInfo.belowPriceBadge} />
                            )}
                          </div>
                        )}

                        {!productInfo.belowPriceText && packDiscountInfo && (
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <p className="text-primary-600 text-xs font-medium">
                              {packDiscountInfo.belowPriceText}
                            </p>
                            {packDiscountInfo.belowPriceBadge && (
                              <SaleBadge
                                text={packDiscountInfo.belowPriceBadge}
                              />
                            )}
                          </div>
                        )}

                        <p className="text-xs text-neutral-500 mt-1">
                          Số lượng: {quantity}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(i.product.id)}
                        aria-label="Xoá sản phẩm"
                        className="text-neutral-400 hover:text-neutral-700 shrink-0 h-fit cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="mx-5 space-y-2 pb-4">
                <div className="flex gap-2 text-base mt-2">
                  Tổng tiền tạm tính:
                  {discountAmount ? (
                    <div className="flex gap-2 items-baseline">
                      <span className="font-semibold">
                        {(totalAmount - discountAmount).toLocaleString("vi-VN")}
                        đ
                      </span>
                      <span className="text-xs line-through text-neutral-400">
                        {totalAmount.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  ) : (
                    <span className="font-semibold">
                      {totalAmount.toLocaleString("vi-VN")}đ
                    </span>
                  )}
                </div>
                <Button className="w-full" to="/checkout">
                  Thanh toán
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
