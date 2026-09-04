import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";

type ToastProps = {
  message: string;
  onClose: () => void;
  duration?: number;
};

export default function Toast({
  message,
  onClose,
  duration = 2500,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      className="fixed top-20 right-4 z-[100] flex items-center gap-2 bg-white border border-neutral-200
                 shadow-lg rounded-lg px-4 py-3 animate-[fadeIn_0.2s_ease-out]"
    >
      <CheckCircle2 size={18} className="text-primary-500 shrink-0" />
      <span className="text-sm text-neutral-800">{message}</span>
      <button
        onClick={onClose}
        className="text-neutral-400 hover:text-neutral-600 ml-2"
      >
        <X size={14} />
      </button>
    </div>
  );
}
