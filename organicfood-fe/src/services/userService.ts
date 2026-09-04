import axiosClient from "../lib/axiosClient";
import type { ApiResponse } from "../lib/types/api";
import type { UserAddressRequest } from "../lib/types/user";

export async function addUserAddress(
  payload: UserAddressRequest,
): Promise<void> {
  await axiosClient.post<ApiResponse<null>>("/users/addresses", payload);
}

export async function updateUserAddress(
  addressId: number,
  payload: UserAddressRequest,
): Promise<void> {
  await axiosClient.put<ApiResponse<null>>(
    `/users/addresses/${addressId}`,
    payload,
  );
}

export async function deleteUserAddress(addressId: number): Promise<void> {
  await axiosClient.delete<ApiResponse<null>>(`/users/addresses/${addressId}`);
}
