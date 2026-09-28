import type { ProductDiscount } from "./product";

export interface PlaceOrderRequest {
  idempotencyKey: string;
  phone: string;
  address: string;
  items: OrderLineRequest[];
}

export interface OrderLineRequest {
  productId: string;
  quantity: number;
}

export interface Order {
  customerId: string;
  code: string;
  status: OrderStatus;
  totalAmount: number;
  discountAmount: number;
  createdAt: string;
  items: OrderItem[];
}

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED"
  | "FAILED"
  | "REFUNDING"
  | "REFUNDED";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Chờ xử lý",
  PROCESSING: "Đang xử lý",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
  FAILED: "Thất bại",
  REFUNDING: "Đang hoàn tiền",
  REFUNDED: "Đã hoàn tiền",
};

export interface OrderItem {
  productId: string;
  productName: string;
  productSku: string;
  productImageUrl: string;
  discountLabel: string;
  discountType: ProductDiscount;
  quantity: number;
  originalPrice: number;
  unitPrice: number;
  lineTotal: number;
}
