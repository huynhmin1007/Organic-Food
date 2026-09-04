import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { UserInfo } from "../lib/types/user";
import { tokenStorage } from "../lib/tokenStorage";
import { setOnAuthFailure } from "../lib/axiosClient";
import { login as loginApi, getMyInfo } from "../services/authService";

type AuthContextValue = {
  user: UserInfo | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    tokenStorage.clearTokens();
    setUser(null);
  };

  useEffect(() => {
    setOnAuthFailure(logout);
  }, []);

  useEffect(() => {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      setLoading(false);
      return;
    }

    getMyInfo()
      .then(setUser)
      .catch(() => tokenStorage.clearTokens())
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await loginApi({ email, password });
    tokenStorage.setTokens(res.accessToken, res.refreshToken);

    const info = await getMyInfo();
    setUser(info);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, login, logout }}
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
