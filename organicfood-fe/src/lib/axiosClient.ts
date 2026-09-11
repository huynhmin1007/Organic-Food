import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "./tokenStorage";

const axiosClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ??
    import.meta.env.VITE_API_URL ??
    "http://localhost:8081/organicfood/api/v1",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
  paramsSerializer: {
    serialize: (params) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (Array.isArray(value)) {
          value.forEach((item) => searchParams.append(key, String(item)));
        } else {
          searchParams.append(key, String(value));
        }
      });
      return searchParams.toString();
    },
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let onAuthFailure: (() => void) | null = null;
export function setOnAuthFailure(callback: () => void) {
  onAuthFailure = callback;
}

// AuthContext đăng ký để biết mỗi khi token vừa được refresh (chủ động hoặc bị động),
// dùng để đặt lại hẹn giờ refresh tiếp theo
let onTokenRefreshed: ((expiresIn: number) => void) | null = null;
export function setOnTokenRefreshed(callback: (expiresIn: number) => void) {
  onTokenRefreshed = callback;
}

let isRefreshing = false;
let pendingQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

function processQueue(error: unknown, token: string | null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  pendingQueue = [];
}

/** Hàm refresh dùng chung — cả interceptor (khi gặp 401) lẫn timer chủ động đều gọi hàm này */
export async function performTokenRefresh(): Promise<string> {
  const refreshTokenValue = tokenStorage.getRefreshToken();
  if (!refreshTokenValue) throw new Error("Không có refresh token");

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      pendingQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;
  try {
    const { data } = await axiosClient.post<{
      data: { accessToken: string; refreshToken: string; expiresIn: number };
    }>("/auth/token/refresh", { refreshToken: refreshTokenValue });

    const { accessToken, refreshToken: newRefreshToken, expiresIn } = data.data;
    tokenStorage.setTokens(accessToken, newRefreshToken, expiresIn);
    onTokenRefreshed?.(expiresIn);

    processQueue(null, accessToken);
    return accessToken;
  } catch (err) {
    processQueue(err, null);
    tokenStorage.clearTokens();
    onAuthFailure?.();
    throw err;
  } finally {
    isRefreshing = false;
  }
}

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & {
          _retry?: boolean;
          _retryCount?: number;
        })
      | undefined;

    const isTimeoutOrNetworkError = !error.response;
    if (
      isTimeoutOrNetworkError &&
      originalRequest &&
      (originalRequest._retryCount ?? 0) < 1
    ) {
      originalRequest._retryCount = (originalRequest._retryCount ?? 0) + 1;
      await new Promise((resolve) => setTimeout(resolve, 1000)); // chờ 1s trước khi thử lại
      return axiosClient(originalRequest);
    }

    const isRefreshEndpoint = originalRequest?.url?.includes(
      "/auth/token/refresh",
    );
    const isLoginEndpoint = originalRequest?.url?.includes("/auth/login");

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isRefreshEndpoint &&
      !isLoginEndpoint
    ) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await performTokenRefresh();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch {
        return Promise.reject(new Error("Phiên đăng nhập đã hết hạn"));
      }
    }

    const apiMessage = (
      error.response?.data as { message?: string } | undefined
    )?.message;
    return Promise.reject(
      new Error(apiMessage || error.message || "Đã có lỗi xảy ra"),
    );
  },
);

export default axiosClient;
