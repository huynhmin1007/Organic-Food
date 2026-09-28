// src/lib/axios.ts
import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { ApiError, type ApiResponse } from "../types/api";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

const SUCCESS_CODE = 200;

let getAccessToken: () => string | null = () => null;
let onUnauthorized: () => void = () => {};
let refreshTokenFn: () => Promise<{ accessToken: string }> = () =>
  Promise.reject(new Error("registerAuthHandlers chưa được gọi"));
let refreshInFlight: Promise<string | null> | null = null;

export function registerAuthHandlers(handlers: {
  getAccessToken: () => string | null;
  onUnauthorized: () => void;
  refreshToken: () => Promise<{ accessToken: string }>;
}) {
  getAccessToken = handlers.getAccessToken;
  onUnauthorized = handlers.onUnauthorized;
  refreshTokenFn = handlers.refreshToken;
}

// ==== REQUEST INTERCEPTOR: gắn access token từ memory vào mọi request ====
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// ==== RESPONSE INTERCEPTOR: unwrap ApiResponse + tự refresh khi gặp 401 ====
apiClient.interceptors.response.use(
  (response) => {
    const body = response.data as ApiResponse<unknown>;
    if (body.code !== SUCCESS_CODE) {
      return Promise.reject(new ApiError(body.code, body.message));
    }
    response.data = body.data;
    return response;
  },
  async (error: AxiosError<ApiResponse<unknown>>) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status;

    if (status === 401 && isLoggedOut) {
      return Promise.reject(error);
    }

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!refreshInFlight) {
        refreshInFlight = refreshTokenFn()
          .then((res) => res.accessToken)
          .catch(() => {
            onUnauthorized();
            return null;
          })
          .finally(() => {
            refreshInFlight = null;
          });
      }

      const newAccessToken = await refreshInFlight;

      if (!newAccessToken) {
        return Promise.reject(error);
      }

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    }

    const message = error.response?.data?.message ?? error.message;
    const code = error.response?.data?.code ?? status ?? 0;
    return Promise.reject(new ApiError(code, message));
  },
);
let isLoggedOut = false;

export function setLoggedOut(value: boolean) {
  isLoggedOut = value;
}
