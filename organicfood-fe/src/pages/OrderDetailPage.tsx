import { Link, useLoaderData, useLocation, useParams } from "react-router-dom";
import { ORDER_STATUS_LABEL, type Order, type OrderItem } from "../types/order";
import { useOrders } from "../hooks/useOrders";
import Spinner from "../components/ui/Spinner";
import Button from "../components/ui/Button";
import { formatVnd } from "../lib/discountCalculator";
import SaleBadge from "../components/SaleBadge";
import Container from "../components/ui/Container";

function getSavings(item: OrderItem) {
  const originalLine = item.originalPrice * item.quantity;
  const saved = Math.max(originalLine - item.lineTotal, 0);
  const percent =
    originalLine > 0 ? Math.round((saved / originalLine) * 100) : 0;
  return { originalLine, saved, percent };
}

export default function OrderDetailPage() {
  const order = useLoaderData() as Order | null;

  if (!order) {
    return (
      <Container className="py-12 text-center">
        <p className="text-stone-500">Không tìm thấy đơn hàng</p>
        <Button to="/" className="mt-4">
          Về trang chủ
        </Button>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="py-12 text-center">
        <p className="text-stone-500">Không tìm thấy đơn hàng</p>
        <Button to="/" variant="primary" className="mt-4">
          Về trang chủ
        </Button>
      </Container>
    );
  }

  const finalTotal = order.totalAmount - order.discountAmount;

  return (
    <div className="min-h-screen bg-neutral-50">
      <Container className="px-4 py-6">
        <Link to="/" className="text-2xl font-medium text-neutral-800">
          Cửa hàng thực phẩm hữu cơ Organicfood
        </Link>

        <div className="mt-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-medium">Đơn hàng #{order.code}</h2>
            <p className="text-sm text-neutral-500 mt-1">
              {new Date(order.createdAt).toLocaleString("vi-VN")}
            </p>
          </div>
          <span className="text-sm font-medium px-3 py-1 rounded-full bg-primary-100 text-primary-600">
            {ORDER_STATUS_LABEL[order.status]}
          </span>
        </div>

        <div className="bg-white rounded-md border border-stone-200 mt-5">
          <div className="flex flex-col divide-y divide-neutral-100 mx-4">
            {order.items.map((item) => {
              const { originalLine, saved, percent } = getSavings(item);
              const hasDiscount = saved > 0;

              return (
                <div
                  key={item.productId}
                  className="flex items-start gap-3 py-3"
                >
                  <img
                    src={item.productImageUrl}
                    alt={item.productName}
                    className="w-16 h-16 shrink-0 object-contain border border-neutral-200 rounded-md"
                  />

                  <div className="flex-1 min-w-0">
                    <span className="text-sm line-clamp-2">
                      {item.productName}
                    </span>

                    <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                      <span className="text-sm font-semibold">
                        {formatVnd(item.unitPrice)}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-neutral-400 line-through">
                          {formatVnd(item.originalPrice)}
                        </span>
                      )}
                      {percent > 0 && <SaleBadge text={`-${percent}%`} />}
                      <span className="text-xs text-neutral-500">
                        x {item.quantity}
                      </span>
                    </div>

                    {hasDiscount && (
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Tiết kiệm {formatVnd(saved)}
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-semibold">
                      {formatVnd(item.lineTotal)}
                    </span>
                    {hasDiscount && (
                      <span className="block text-xs text-neutral-400 line-through">
                        {formatVnd(originalLine)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mx-4 border-t border-neutral-200 space-y-2 text-sm py-3">
            <div className="flex justify-between">
              <span className="text-neutral-500">Tạm tính</span>
              <span>{formatVnd(order.totalAmount)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-neutral-500">Giảm giá</span>
                <span>-{formatVnd(order.discountAmount)}</span>
              </div>
            )}
          </div>

          <div className="mx-4 py-3 flex justify-between border-t border-neutral-200">
            <span className="font-medium">Tổng cộng</span>
            <span className="text-xl text-primary-600 font-bold">
              {formatVnd(finalTotal)}
            </span>
          </div>
        </div>

        <div className="mt-6 text-right">
          <Button to="/">Về trang chủ</Button>
        </div>
      </Container>
    </div>
  );
}
