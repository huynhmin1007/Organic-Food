import { useMemo, useState } from "react";
import { useOrders } from "../hooks/useOrders";
import { getOrderStatusLabel } from "../lib/orderStatus";
import type {
  OrderItemResponse,
  OrderResponse,
  OrderStatus,
} from "../lib/types/order";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { getOrderItemDisplay } from "../lib/orderItemDisplay";

const TABS: { key: OrderStatus | "ALL"; label: string }[] = [
  { key: "ALL", label: "Tất cả" },
  { key: "PENDING", label: "Chờ xử lý" },
  { key: "PROCESSING", label: "Đang xử lý" },
  { key: "COMPLETED", label: "Hoàn thành" },
  { key: "CANCELLED", label: "Đã huỷ" },
  { key: "FAILED", label: "Thất bại" },
  { key: "REFUNDING", label: "Đang hoàn tiền" },
  { key: "REFUNDED", label: "Đã hoàn tiền" },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function OrderItemRow({ item }: { item: OrderItemResponse }) {
  const display = getOrderItemDisplay(item);

  return (
    <div className="flex gap-3 px-4 py-3">
      <div className="relative shrink-0">
        <img
          src={item.productImageUrl}
          alt={item.productName}
          className="w-16 h-16 object-contain border border-neutral-200 rounded-md"
        />
        {display.cornerBadge && (
          <span className="absolute -top-1.5 -right-1.5 bg-sale text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            {display.cornerBadge}
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
            {display.sellingPrice.toLocaleString("vi-VN")}đ
          </p>
          {display.originalPrice && (
            <p className="text-xs text-neutral-400 line-through">
              {display.originalPrice.toLocaleString("vi-VN")}đ
            </p>
          )}
          <span className="text-xs text-neutral-500">x{item.quantity}</span>
        </div>

        {display.belowPriceText && (
          <div className="mt-1.5 border border-amber-400 rounded-md overflow-hidden inline-block">
            <div className="px-2 py-1 flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-amber-700">
                {display.belowPriceText.toUpperCase()}
              </span>
              {display.belowPriceBadge && (
                <span className="bg-sale text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {display.belowPriceBadge}
                </span>
              )}
            </div>
          </div>
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

function OrderCard({ order }: { order: OrderResponse }) {
  const subtotal = order.totalAmount + order.discountAmount;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
        <div>
          <span className="font-semibold text-sm">Đơn hàng #{order.code}</span>
          <p className="text-xs text-neutral-400 mt-0.5">
            {formatDate(order.createdAt)}
          </p>
        </div>
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-neutral-100 text-neutral-700">
          {getOrderStatusLabel(order.status)}
        </span>
      </div>

      <div className="divide-y divide-neutral-100">
        {order.items.map((item) => (
          <OrderItemRow key={item.productId} item={item} />
        ))}
      </div>

      <div className="px-4 py-3 bg-neutral-50 space-y-1.5 text-sm">
        <div className="flex justify-between text-neutral-500">
          <span>Tạm tính</span>
          <span>{subtotal.toLocaleString("vi-VN")}đ</span>
        </div>

        {order.discountAmount > 0 && (
          <div className="flex justify-between text-primary-600">
            <span>Giảm giá</span>
            <span>-{order.discountAmount.toLocaleString("vi-VN")}đ</span>
          </div>
        )}

        <div className="flex justify-between items-center pt-1.5 border-t border-neutral-200">
          <span className="font-medium">Tổng tiền</span>
          <span className="text-lg font-bold text-primary-600">
            {order.totalAmount.toLocaleString("vi-VN")}đ
          </span>
        </div>
      </div>
    </div>
  );
}

export default function OrderListPage() {
  const { orders, loading, error } = useOrders();
  const [activeTab, setActiveTab] = useState<OrderStatus | "ALL">("ALL");
  const [keyword, setKeyword] = useState("");

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: orders.length };
    for (const tab of TABS) {
      if (tab.key === "ALL") continue;
      counts[tab.key] = orders.filter((o) => o.status === tab.key).length;
    }
    return counts;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const kw = keyword.trim().toLowerCase();

    return orders
      .filter((order) => {
        if (activeTab !== "ALL" && order.status !== activeTab) return false;
        if (!kw) return true;

        const matchCode = order.code.toLowerCase().includes(kw);
        const matchProduct = order.items.some((item) =>
          item.productName.toLowerCase().includes(kw),
        );
        return matchCode || matchProduct;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [orders, activeTab, keyword]);

  return (
    <div>
      <h2 className="text-lg font-bold border-b border-neutral-200 pb-2 mb-4">
        Đơn hàng
      </h2>

      <div className="flex gap-1 overflow-x-auto border-b border-neutral-200 mb-4 [&::-webkit-scrollbar]:hidden">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-neutral-600 hover:text-primary-500"
            }`}
          >
            {tab.label}
            {tabCounts[tab.key] > 0 && ` (${tabCounts[tab.key]})`}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 bg-neutral-100 rounded-md px-3 py-2.5 mb-4">
        <Search size={16} className="text-neutral-400 shrink-0" />
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Tìm theo mã đơn hàng hoặc tên sản phẩm"
          className="flex-1 bg-transparent outline-none text-sm"
        />
      </div>

      {loading && <div className="h-40" />}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!loading && !error && (
        <>
          {filteredOrders.length === 0 ? (
            <p className="text-center text-neutral-500 py-10">
              Không có đơn hàng nào.
            </p>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <OrderCard key={order.code} order={order} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
