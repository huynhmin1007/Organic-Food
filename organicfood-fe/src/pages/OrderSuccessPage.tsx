import { Link, useLocation, useNavigate } from "react-router-dom";
import type { OrderItemResponse, OrderResponse } from "../lib/types/order";
import { CheckCircle2 } from "lucide-react";
import { getOrderStatusLabel } from "../lib/orderStatus";

function OrderItemCard({ item }: { item: OrderItemResponse }) {
  const hasDiscount = item.unitPrice < item.originalPrice;
  const percentOff = hasDiscount
    ? Math.round((1 - item.unitPrice / item.originalPrice) * 100)
    : 0;

  return (
    <div className="flex gap-3 py-3">
      <div className="relative shrink-0">
        <img
          src={item.productImageUrl}
          alt={item.productName}
          className="w-16 h-16 object-contain border border-neutral-200 rounded-md"
        />
        {hasDiscount && (
          <span className="absolute -top-1.5 -right-1.5 bg-sale text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            -{percentOff}%
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-neutral-800 line-clamp-2">
          {item.productName}
        </p>
        <p className="text-xs text-neutral-400 mt-0.5">
          SKU: {item.productSku}
        </p>

        <div className="flex items-baseline gap-2 mt-1 flex-wrap">
          <p className="text-sm font-bold text-neutral-800">
            {item.unitPrice.toLocaleString("vi-VN")}đ
          </p>
          {hasDiscount && (
            <p className="text-xs text-neutral-400 line-through">
              {item.originalPrice.toLocaleString("vi-VN")}đ
            </p>
          )}
          <span className="text-xs text-neutral-500">x {item.quantity}</span>
        </div>

        {item.discountLabel && (
          <p className="text-xs text-primary-600 font-medium mt-1">
            {item.discountLabel}
          </p>
        )}
      </div>

      <div className="text-right shrink-0">
        <p className="text-sm font-semibold text-neutral-800">
          {item.lineTotal.toLocaleString("vi-VN")}đ
        </p>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order as OrderResponse | undefined;

  if (!order) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-8">
        <div className="text-center">
          <CheckCircle2 size={48} className="text-green-500 mx-auto mb-3" />
          <h1 className="text-xl font-bold mb-1">Đặt hàng thành công</h1>

          <div className="flex items-center justify-center gap-2 mt-2">
            <p className="text-sm text-neutral-500">
              Mã đơn hàng:{" "}
              <span className="font-semibold text-neutral-800">
                {order.code}
              </span>
            </p>
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-neutral-100 text-neutral-700">
              {getOrderStatusLabel(order.status)}
            </span>
          </div>
        </div>

        <div className="mt-6 border-t border-neutral-200 divide-y divide-neutral-100">
          {order.items.map((item) => (
            <OrderItemCard key={item.productId} item={item} />
          ))}
        </div>

        <div className="border-t border-neutral-200 mt-2 pt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-500">Tạm tính</span>
            <span>
              {(order.totalAmount + order.discountAmount).toLocaleString(
                "vi-VN",
              )}
              đ
            </span>
          </div>

          {order.discountAmount > 0 && (
            <div className="flex justify-between text-primary-600">
              <span>Giảm giá</span>
              <span>-{order.discountAmount.toLocaleString("vi-VN")}đ</span>
            </div>
          )}
        </div>

        <div className="border-t border-neutral-200 mt-3 pt-3 flex items-center justify-between">
          <span className="font-medium">Tổng cộng</span>
          <span className="text-xl font-bold text-primary-600">
            {order.totalAmount.toLocaleString("vi-VN")}đ
          </span>
        </div>

        <Link
          to="/"
          className="block mt-6 bg-primary-600 hover:bg-primary-700 text-white
                     font-semibold py-2.5 rounded-md transition-colors text-center"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
