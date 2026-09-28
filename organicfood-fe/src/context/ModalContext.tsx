import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface ModalContextValue {
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ReactNode>(null);
  const isOpen = content !== null;

  const openModal = useCallback((node: ReactNode) => setContent(node), []);
  const closeModal = useCallback(() => setContent(null), []);

  // Khóa scroll nền khi modal mở
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const value = useMemo(
    () => ({ openModal, closeModal }),
    [openModal, closeModal],
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4">
          {content}
        </div>
      )}
    </ModalContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal phải được dùng bên trong ModalProvider");
  return ctx;
}
