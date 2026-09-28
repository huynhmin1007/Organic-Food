import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import ToastContainer from "../components/ToastContainer";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
  isLeaving: boolean;
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (type: ToastType, message: string) => void;
  dismissToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);
const DISPLAY_DURATION = 2000;
const LEAVE_DURATION = 300;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idCounter = useRef(0);

  function showToast(type: ToastType, message: string) {
    const id = idCounter.current++;
    setToasts((prev) => [...prev, { id, type, message, isLeaving: false }]);

    setTimeout(() => startLeaving(id), DISPLAY_DURATION);
  }

  function startLeaving(id: number) {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isLeaving: true } : t)),
    );

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, LEAVE_DURATION);
  }

  function dismissToast(id: number) {
    startLeaving(id);
  }

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast phải được dùng bên trong ToastProvider");
  return {
    success: (message: string) => ctx.showToast("success", message),
    error: (message: string) => ctx.showToast("error", message),
    info: (message: string) => ctx.showToast("info", message),
  };
}
