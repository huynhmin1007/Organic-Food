import { apiClient } from "../lib/axios";
import type { AuthenticationResponse } from "../types/auth";
import type { User } from "../types/user";

export async function login(
  email: string,
  password: string,
): Promise<AuthenticationResponse> {
  const { data } = await apiClient.post<AuthenticationResponse>("/auth/login", {
    email,
    password,
  });
  return data;
}

export async function refreshToken(): Promise<AuthenticationResponse> {
  const { data } = await apiClient.post<AuthenticationResponse>(
    "/auth/token/refresh",
  );
  return data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}

export async function getUserInfo(): Promise<User> {
  const { data } = await apiClient.get<User>("/users/my-info");
  console.log(data);
  return data;
}
