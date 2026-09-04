import axiosClient from "../lib/axiosClient";
import type { ApiResponse } from "../lib/types/api";
import type {
  AuthenticationResponse,
  LoginPayload,
  RegisterPayload,
  UserInfo,
  VerifyOtpPayload,
} from "../lib/types/user";

export async function login(
  payload: LoginPayload,
): Promise<AuthenticationResponse> {
  const { data } = await axiosClient.post<ApiResponse<AuthenticationResponse>>(
    "/auth/login",
    payload,
  );
  return data.data;
}

export async function getMyInfo(): Promise<UserInfo> {
  const { data } =
    await axiosClient.get<ApiResponse<UserInfo>>("/users/my-info");
  return data.data;
}

export async function register(payload: RegisterPayload): Promise<void> {
  await axiosClient.post<ApiResponse<null>>("/auth/register", payload);
}

export async function verifyRegisterOtp(
  payload: VerifyOtpPayload,
): Promise<void> {
  await axiosClient.post<ApiResponse<null>>("/auth/register/verify", payload);
}
