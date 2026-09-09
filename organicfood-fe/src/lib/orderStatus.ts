import type { OrderStatus } from "./types/order";

export function getOrderStatusLabel(status: OrderStatus): string {
  switch (status) {
    case "PENDING":
      return "Chờ xử lý";
    case "PROCESSING":
      return "Đang xử lý";
    case "COMPLETED":
      return "Hoàn thành";
    case "CANCELLED":
      return "Đã huỷ";
    case "FAILED":
      return "Thất bại";
    case "REFUNDING":
      return "Đang hoàn tiền";
    case "REFUNDED":
      return "Đã hoàn tiền";
  }
}
