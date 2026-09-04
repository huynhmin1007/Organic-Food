import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, X } from "lucide-react";
import { useCartDetails } from "../../hooks/useCartDetails";
import { useCart } from "../../contexts/CartContext";

export default function CartDropdown() {
  const { items, totalPrice, loading, removeItem } = useCartDetails();
  const { totalQuantity } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="relative"
      onMouseEnter={() => setCartOpen(true)}
      onMouseLeave={() => setCartOpen(false)}
    >
      <button
        className="flex items-center gap-3 rounded-md border-2 border-white px-5 py-2 text-white transition
                   hover:bg-white hover:text-primary-500"
      >
        <ShoppingCart size={22} fill="currentColor" />
        <span className="font-semibold">Giỏ hàng</span>
        <span>{totalQuantity}</span>
      </button>

      {cartOpen && (
        <div className="absolute right-0 top-full w-96 bg-white rounded-lg shadow-lg z-50 text-neutral-800 flex flex-col">
          {items.length === 0 ? (
            <p className="text-center text-neutral-500 py-10">
              Giỏ hàng đang trống
            </p>
          ) : (
            <>
              <div
                className="overflow-y-auto max-h-96 divide-y divide-neutral-100
             [&::-webkit-scrollbar]:w-1.5
             [&::-webkit-scrollbar-track]:bg-transparent
             [&::-webkit-scrollbar-thumb]:bg-neutral-300
             [&::-webkit-scrollbar-thumb]:rounded-full
             [&::-webkit-scrollbar-thumb]:hover:bg-neutral-400
             [&::-webkit-scrollbar-button]:hidden"
              >
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3 p-3">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.name}
                      className="w-14 h-14 object-contain shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/${item.categorySlug}/${item.slug}`}
                        className="text-sm hover:text-primary-500 line-clamp-2"
                      >
                        {item.name}
                      </Link>

                      <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                        <p className="text-sm font-bold text-neutral-800">
                          {item.pricing.lineFinalTotal.toLocaleString("vi-VN")}đ
                        </p>
                        {item.pricing.savings > 0 && (
                          <p className="text-xs text-neutral-400 line-through">
                            {item.pricing.lineOriginalTotal.toLocaleString(
                              "vi-VN",
                            )}
                            đ
                          </p>
                        )}
                        {item.pricing.cornerBadge && (
                          <span className="bg-sale text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                            {item.pricing.cornerBadge}
                          </span>
                        )}
                      </div>

                      {item.pricing.belowPriceText && (
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <p className="text-primary-600 text-xs font-medium">
                            {item.pricing.belowPriceText}
                          </p>
                          {item.pricing.belowPriceBadge && (
                            <span className="bg-sale/10 text-sale text-[10px] font-bold px-1 py-0.5 rounded">
                              {item.pricing.belowPriceBadge}
                            </span>
                          )}
                        </div>
                      )}

                      <p className="text-xs text-neutral-500 mt-1">
                        Số lượng: {item.quantity}
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId)}
                      aria-label="Xoá sản phẩm"
                      className="text-neutral-400 hover:text-neutral-700 shrink-0 h-fit"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-neutral-200 shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm">Tổng tiền tạm tính:</span>
                  <span className="font-bold">
                    {totalPrice.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <button
                  type="button"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white
                             font-semibold py-2.5 rounded-md transition-colors"
                  onClick={() => {
                    navigate("/checkout");
                  }}
                >
                  Tiến hành thanh toán
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
