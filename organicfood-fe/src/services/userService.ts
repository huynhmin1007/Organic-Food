import { apiClient } from "../lib/axios";

export interface AddUserAddressRequest {
  address: string;
  isDefault?: boolean;
}

export interface UpdateUserAddressRequest {
  address: string;
  isDefault?: boolean;
}

export async function addUserAddress(
  payload: AddUserAddressRequest,
): Promise<string> {
  const { data } = await apiClient.post<string>("/users/addresses", payload);
  return data;
}

export async function updateUserAddress(
  addressId: number,
  payload: UpdateUserAddressRequest,
): Promise<void> {
  await apiClient.put(`/users/addresses/${addressId}`, payload);
}

export async function deleteUserAddress(addressId: number): Promise<void> {
  await apiClient.delete(`/users/addresses/${addressId}`);
}
