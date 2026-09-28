// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  getUserInfo,
  login as loginApi,
  logout as logoutApi,
  refreshToken as refreshTokenApi,
} from "../services/authService";
import { registerAuthHandlers, setLoggedOut } from "../lib/axios";
import type { AuthenticationResponse } from "../types/auth";
import type { User } from "../types/user";

interface AuthContextValue {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean; // true trong lúc đang thử silent-login lúc app khởi động
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Ref giữ token "hiện hành": có hiệu lực ngay lập tức, không phải chờ React render lại.
  // Axios interceptor đọc token từ đây.
  const accessTokenRef = useRef<string | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasAttemptedSilentLogin = useRef(false);

  function scheduleProactiveRefresh(expiresIn: number) {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);

    // Chủ động refresh SỚM hơn thời điểm hết hạn thật (trước 60s), tránh access
    // token hết hạn đúng lúc đang có request bay giữa chừng.
    const refreshInMs = Math.max((expiresIn - 60) * 1000, 5000);

    refreshTimerRef.current = setTimeout(() => {
      doRefresh();
    }, refreshInMs);
  }

  async function applyAuthResponse(res: AuthenticationResponse) {
    setLoggedOut(false);
    accessTokenRef.current = res.accessToken; // có hiệu lực ngay, trước khi gọi API
    setAccessToken(res.accessToken);
    scheduleProactiveRefresh(res.expiresIn);

    try {
      setUser(await getUserInfo());
    } catch {
      setUser(null);
    }
  }

  async function doRefresh() {
    try {
      const res = await refreshTokenApi();
      await applyAuthResponse(res);
    } catch {
      // Refresh token cũng hết hạn/không hợp lệ → thực sự phải đăng nhập lại
      logout();
    }
  }

  async function login(email: string, password: string) {
    const res = await loginApi(email, password);
    await applyAuthResponse(res); // đợi có user rồi mới trả về cho LoginPage
  }

  function logout() {
    accessTokenRef.current = null;
    setLoggedOut(true);
    setAccessToken(null);
    setUser(null);
    logoutApi().catch(() => {});
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
  }

  async function refreshUser() {
    const info = await getUserInfo();
    setUser(info);
  }

  // Silent login lúc app khởi động: nếu còn refresh token cookie hợp lệ từ trước,
  // tự đăng nhập lại mà KHÔNG bắt người dùng nhập lại email/password.
  useEffect(() => {
    if (hasAttemptedSilentLogin.current) return; // chặn lần gọi thứ 2 do StrictMode
    hasAttemptedSilentLogin.current = true;

    refreshTokenApi()
      .then(applyAuthResponse)
      .catch(() => {})
      .finally(() => setIsInitializing(false));
  }, []);

  // Kết nối AuthContext với axios interceptor. Chỉ cần đăng ký 1 lần vì
  // getAccessToken đọc từ ref nên luôn ra giá trị mới nhất.
  useEffect(() => {
    registerAuthHandlers({
      getAccessToken: () => accessTokenRef.current,
      onUnauthorized: logout,
      refreshToken: refreshTokenApi,
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        isAuthenticated: !!accessToken,
        isInitializing,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth phải được dùng bên trong AuthProvider");
  }
  return ctx;
}
