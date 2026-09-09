import { useState } from "react";
import type { OrderResponse, PlaceOrderPayload } from "../../lib/types/order";
import { placeOrder } from "../../services/orderService";
import { CheckCircle2, Loader2, X } from "lucide-react";

type PaymentModalProps = {
  payload: PlaceOrderPayload;
  totalAmount: number;
  onClose: () => void;
  onSuccess: (order: OrderResponse) => void;
};

type Step = "confirm" | "processing" | "success" | "error";

export default function PaymentModal({
  payload,
  totalAmount,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const [step, setStep] = useState<Step>("confirm");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePay = async () => {
    setStep("processing");
    setErrorMessage(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const order = await placeOrder(payload);
      setStep("success");

      setTimeout(() => onSuccess(order), 800);
    } catch (err) {
      setStep("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Thanh toán thất bại",
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 relative">
        {step === "confirm" && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-600"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        )}

        {step === "confirm" && (
          <>
            <h2 className="text-lg font-bold mb-2">Xác nhận thanh toán</h2>
            <p className="text-sm text-neutral-600 mb-4">
              Số tiền cần thanh toán:{" "}
              <span className="font-bold text-primary-600">
                {totalAmount.toLocaleString("vi-VN")}đ
              </span>
            </p>
            <button
              onClick={handlePay}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white
                         font-semibold py-2.5 rounded-md transition-colors"
            >
              Thanh toán
            </button>
          </>
        )}

        {step === "processing" && (
          <div className="flex flex-col items-center py-6">
            <Loader2 size={36} className="animate-spin text-primary-500 mb-3" />
            <p className="text-sm text-neutral-600">Đang xử lý thanh toán...</p>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center py-6">
            <CheckCircle2 size={40} className="text-green-500 mb-3" />
            <p className="text-sm font-medium">Đặt hàng thành công!</p>
          </div>
        )}

        {step === "error" && (
          <div className="flex flex-col items-center py-4">
            <p className="text-sm text-red-500 mb-4 text-center">
              {errorMessage}
            </p>
            <div className="flex gap-2 w-full">
              <button
                onClick={onClose}
                className="flex-1 border border-neutral-300 rounded-md py-2 text-sm hover:bg-neutral-50"
              >
                Huỷ
              </button>
              <button
                onClick={handlePay}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white rounded-md py-2 text-sm"
              >
                Thử lại
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
