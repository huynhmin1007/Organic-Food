export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED"
  | "FAILED"
  | "REFUNDING"
  | "REFUNDED";

export type PlaceOrderItemPayload = {
  productId: string;
  quantity: number;
};

export type PlaceOrderPayload = {
  idempotencyKey: string;
  phone: string;
  address: string;
  items: PlaceOrderItemPayload[];
};

export type OrderItemResponse = {
  productId: string;
  productName: string;
  productSku: string;
  productImageUrl: string;
  discountLabel: string | null;
  discountType: string | null;
  quantity: number;
  originalPrice: number;
  unitPrice: number;
  lineTotal: number;
};

export type OrderResponse = {
  customerId: string;
  code: string;
  status: OrderStatus;
  totalAmount: number;
  discountAmount: number;
  items: OrderItemResponse[];
};
