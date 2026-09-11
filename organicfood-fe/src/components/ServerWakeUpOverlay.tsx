import { Loader2 } from "lucide-react";
import { useServerWakeUp } from "../hooks/useServerWakeUp";

export default function ServerWakeUpOverlay({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isReady, showOverlay, elapsedSeconds } = useServerWakeUp();

  if (!isReady) {
    return showOverlay ? (
      <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center px-4">
        <Loader2 size={40} className="animate-spin text-primary-500 mb-4" />
        <p className="text-base font-medium text-neutral-800 text-center">
          Server đang khởi động...
        </p>
        <p className="text-sm text-neutral-500 text-center mt-2 max-w-sm">
          Do sử dụng gói miễn phí, server có thể mất khoảng 30-60 giây để khởi
          động sau thời gian không hoạt động. Vui lòng chờ trong giây lát.
        </p>
        <p className="text-xs text-neutral-400 mt-3">
          Đã chờ {elapsedSeconds}s
        </p>
      </div>
    ) : null;
  }

  return <>{children}</>;
}
