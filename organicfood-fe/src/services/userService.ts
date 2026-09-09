import axiosClient from "../lib/axiosClient";
import type { ApiResponse } from "../lib/types/api";
import type { AddUserAddressRequest } from "../lib/types/user";

export async function addUserAddress(
  payload: AddUserAddressRequest,
): Promise<string> {
  const { data } = await axiosClient.post<ApiResponse<string>>(
    "/users/addresses",
    payload,
  );
  return data.message;
}

export async function updateUserAddress(
  addressId: number,
  payload: AddUserAddressRequest,
): Promise<void> {
  await axiosClient.put<ApiResponse<null>>(
    `/users/addresses/${addressId}`,
    payload,
  );
}

export async function deleteUserAddress(addressId: number): Promise<void> {
  await axiosClient.delete<ApiResponse<null>>(`/users/addresses/${addressId}`);
}
