import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";
import type { Cart, CartItem } from "../types/user";
import { useAuth } from "./AuthContext";
import { getCart, updateCart } from "../services/cartService";
import { useToast } from "./ToastContext";

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  discountAmount: number;
  isLoading: boolean;
  isSyncing: boolean;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

type QuantityMap = Record<string, number>;

const CartContext = createContext<CartContextValue | null>(null);
const EMPTY_ITEMS: CartItem[] = [];

const toQuantityMap = (items: CartItem[]): QuantityMap =>
  Object.fromEntries(items.map((i) => [i.product.id, i.quantity]));

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const cartRef = useRef<Cart | null>(null);
  const versionRef = useRef(0); // định danh mutation mới nhất
  const syncQueueRef = useRef<Promise<unknown>>(Promise.resolve());

  const toast = useToast();

  const commit = useCallback((next: Cart | null) => {
    cartRef.current = next;
    setCart(next);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      commit(null);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    getCart(controller.signal)
      .then(commit)
      .catch((err) => {
        if (!axios.isCancel(err)) commit(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [isAuthenticated, commit]);

  const requireCart = useCallback((): Cart => {
    if (!isAuthenticated) throw new Error("NOT_AUTHENTICATED");
    if (!cartRef.current) throw new Error("CART_NOT_READY");
    return cartRef.current;
  }, [isAuthenticated]);

  const sync = useCallback(
    async (nextMap: QuantityMap, optimisticItems?: CartItem[]) => {
      const previous = cartRef.current!;
      const version = ++versionRef.current;

      if (optimisticItems) {
        // Chỉ cập nhật items + số lượng; tiền chờ server tính
        commit({
          ...previous,
          items: optimisticItems,
          totalQuantity: optimisticItems.reduce((s, i) => s + i.quantity, 0),
        });
      }

      setPendingCount((c) => c + 1);
      try {
        const task = syncQueueRef.current.then(() => updateCart(nextMap));
        syncQueueRef.current = task.catch(() => {});
        await task;
      } catch (err) {
        if (version === versionRef.current) commit(previous);
        throw err;
      } finally {
        setPendingCount((c) => c - 1);
      }

      if (version !== versionRef.current) return;

      try {
        const fresh = await getCart();
        if (version === versionRef.current) commit(fresh);
      } catch {
        //
      }
    },
    [commit],
  );
  const addItem = useCallback(
    async (productId: string, quantity = 1) => {
      const { items } = requireCart();
      const map = toQuantityMap(items);
      map[productId] = (map[productId] ?? 0) + quantity;

      const optimistic = items.some((i) => i.product.id === productId)
        ? items.map((i) =>
            i.product.id === productId
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          )
        : undefined;

      try {
        await sync(map, optimistic);
        toast.success("Đã thêm sản phẩm vào giỏ hàng");
      } catch (err) {
        toast.error("Không thể thêm sản phẩm vào giỏ hàng");
        throw err;
      }
    },
    [requireCart, sync],
  );
  const removeItem = useCallback(
    async (productId: string) => {
      const { items } = requireCart();
      const next = items.filter((i) => i.product.id !== productId);
      await sync(toQuantityMap(next), next);
    },
    [requireCart, sync],
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity < 1) return;
      const { items } = requireCart();
      const next = items.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i,
      );
      await sync(toQuantityMap(next), next);
    },
    [requireCart, sync],
  );

  const clearCart = useCallback(async () => {
    requireCart();
    await sync({}, []);
  }, [requireCart, sync]);

  const value = useMemo<CartContextValue>(
    () => ({
      items: cart?.items ?? EMPTY_ITEMS,
      totalItems: cart?.totalQuantity ?? 0,
      totalAmount: cart?.totalAmount ?? 0,
      discountAmount: cart?.discountAmount ?? 0,
      isLoading,
      isSyncing: pendingCount > 0,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [
      cart,
      isLoading,
      pendingCount,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart phải được dùng bên trong CartProvider");
  return ctx;
}
