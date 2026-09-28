import { useEffect, useState } from "react";
import Spinner from "./ui/Spinner";
import Button from "./ui/Button";

interface LoadingModalProps {
  failed?: boolean;
  onRetry?: () => void;
}

export default function LoadingModal({ failed, onRetry }: LoadingModalProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (failed) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [failed]);

  return (
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 text-center">
      {failed ? (
        <>
          <h2 className="text-lg font-bold mb-2">Không kết nối được máy chủ</h2>
          <p className="text-sm text-neutral-500 mb-4">
            Máy chủ chưa phản hồi. Vui lòng thử lại.
          </p>
          <Button onClick={onRetry}>Thử lại</Button>
        </>
      ) : (
        <>
          <div className="flex justify-center mb-4">
            <Spinner />
          </div>
          <h2 className="text-lg font-bold mb-2">Đang khởi động hệ thống</h2>
          <p className="text-sm text-neutral-500">
            Backend được deploy trên gói miễn phí nên cần khoảng 2-3 phút để
            khởi động lại sau thời gian không hoạt động. Vui lòng chờ trong giây
            lát, trang sẽ tự tiếp tục khi hệ thống sẵn sàng.
          </p>
          <p className="text-xs text-neutral-400 mt-3">Đã chờ {seconds}s</p>
        </>
      )}
    </div>
  );
}
