import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "./tokenStorage";

const axiosClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ??
    "http://localhost:8081/organicfood/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
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

// Gắn access token vào mọi request (nếu có)
axiosClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AuthContext đăng ký callback này để biết khi nào cần logout (refresh thất bại hẳn)
let onAuthFailure: (() => void) | null = null;
export function setOnAuthFailure(callback: () => void) {
  onAuthFailure = callback;
}

// Nếu nhiều request cùng 401 cùng lúc, chỉ gọi refresh 1 lần, các request còn lại xếp hàng chờ
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

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

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
      const refreshTokenValue = tokenStorage.getRefreshToken();

      if (!refreshTokenValue) {
        tokenStorage.clearTokens();
        onAuthFailure?.();
        return Promise.reject(new Error("Phiên đăng nhập đã hết hạn"));
      }

      if (isRefreshing) {
        // Đã có request khác đang refresh -> chờ, dùng token mới khi xong
        return new Promise((resolve, reject) => {
          pendingQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosClient(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axiosClient.post<{
          data: { accessToken: string; refreshToken: string };
        }>("/auth/token/refresh", { refreshToken: refreshTokenValue });

        const { accessToken, refreshToken: newRefreshToken } = data.data;
        tokenStorage.setTokens(accessToken, newRefreshToken);

        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenStorage.clearTokens();
        onAuthFailure?.();
        return Promise.reject(new Error("Phiên đăng nhập đã hết hạn"));
      } finally {
        isRefreshing = false;
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
