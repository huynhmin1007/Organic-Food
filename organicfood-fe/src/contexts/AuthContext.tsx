import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { UserInfo } from "../lib/types/user";
import { tokenStorage } from "../lib/tokenStorage";
import {
  performTokenRefresh,
  setOnAuthFailure,
  setOnTokenRefreshed,
} from "../lib/axiosClient";
import { login as loginApi, getMyInfo } from "../services/authService";

type AuthContextValue = {
  user: UserInfo | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// Refresh sớm hơn 30s so với thời điểm hết hạn thật, tránh sát nút bị lệch giờ
const REFRESH_BUFFER_MS = 30_000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshTimerRef = useRef<number | null>(null);

  const logout = () => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    tokenStorage.clearTokens();
    setUser(null);
  };

  const scheduleRefresh = (expiresInSeconds: number) => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);

    const delay = Math.max(expiresInSeconds * 1000 - REFRESH_BUFFER_MS, 5_000);

    refreshTimerRef.current = window.setTimeout(async () => {
      try {
        await performTokenRefresh(); // thành công -> tự bắn onTokenRefreshed -> tự đặt lại hẹn giờ tiếp theo
      } catch {
        // performTokenRefresh đã tự gọi onAuthFailure (logout) khi thất bại hẳn
      }
    }, delay);
  };

  const refreshUser = async () => {
    const info = await getMyInfo();
    setUser(info);
  };

  useEffect(() => {
    setOnAuthFailure(logout);
    setOnTokenRefreshed(scheduleRefresh);
  }, []);

  // Lúc app khởi động: nếu có sẵn token, tính thời gian còn lại để đặt hẹn giờ đúng ngay từ đầu
  useEffect(() => {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      setLoading(false);
      return;
    }

    const expiresAt = tokenStorage.getAccessTokenExpiresAt();
    if (expiresAt) {
      const remainingSeconds = Math.max((expiresAt - Date.now()) / 1000, 0);
      scheduleRefresh(remainingSeconds);
    }

    getMyInfo()
      .then(setUser)
      .catch(() => tokenStorage.clearTokens())
      .finally(() => setLoading(false));

    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, []);

  const login = async (email: string, password: string) => {
    const res = await loginApi({ email, password });
    tokenStorage.setTokens(res.accessToken, res.refreshToken, res.expiresIn);
    scheduleRefresh(res.expiresIn);

    const info = await getMyInfo();
    setUser(info);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải được gọi bên trong <AuthProvider>");
  return ctx;
}
