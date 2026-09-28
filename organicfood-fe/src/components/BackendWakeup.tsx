import { useEffect, useState, type ReactNode } from "react";
import { waitForBackend } from "../services/connectService";
import LoadingModal from "./LoadingModal";

export default function BackendWakeup({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<"connecting" | "connected" | "failed">(
    "connecting",
  );
  const [showModal, setShowModal] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("connecting");
    const timer = setTimeout(() => setShowModal(true), 1000);

    waitForBackend(controller.signal).then((ok) => {
      if (!controller.signal.aborted) setStatus(ok ? "connected" : "failed");
    });

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [attempt]);

  if (status === "connected") return <>{children}</>;

  return showModal || status === "failed" ? (
    <div className="fixed inset-0 z-[300] bg-black/50 flex items-center justify-center p-4">
      <LoadingModal
        failed={status === "failed"}
        onRetry={() => setAttempt((a) => a + 1)}
      />
    </div>
  ) : null;
}
