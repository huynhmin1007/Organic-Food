import clsx from "clsx";
import { CheckIcon, Info, X, XCircle } from "lucide-react";

interface ToastContainerProps {
  toasts: {
    id: number;
    type: "success" | "error" | "info";
    message: string;
    isLeaving: boolean;
  }[];
  onDismiss: (id: number) => void;
}

const ICONS = {
  success: CheckIcon,
  error: XCircle,
  info: Info,
};

const STYLES = {
  success: "bg-white border-l-4 border-primary-500 text-stone-800",
  error: "bg-white border-l-4 border-red-500 text-stone-800",
  info: "bg-white border-l-4 border-blue-500 text-stone-800",
};

export default function ToastContainer({
  toasts,
  onDismiss,
}: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-200 flex flex-col gap-2 w-80">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type];
        return (
          <div
            key={toast.id}
            className={clsx(
              "flex items-start gap-2 rounded-md shadow-lg px-4 py-3 transition-all duration-300",
              STYLES[toast.type],
              toast.isLeaving
                ? "opacity-0 translate-x-4"
                : "opacity-100 translate-x-0",
            )}
          >
            <Icon size={18} className="shrink-0 mt-0.5" />
            <p className="flex-1 text-sm">{toast.message}</p>
            <button
              onClick={() => onDismiss(toast.id)}
              className="shrink-0 text-stone-400 hover:text-stone-600"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
