export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthenticationResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
};

export type UserAddress = {
  address: string;
  isDefault: boolean;
};

export type UserInfo = {
  accountId: string;
  email: string;
  fullName: string;
  phone: string;
  addresses: UserAddress[];
};

export type RegisterPayload = {
  email: string;
  password: string;
  fullName: string;
  phone: string; // dạng +84... đã convert trước khi gửi
};

export type VerifyOtpPayload = {
  email: string;
  otp: string;
};

export type UserAddressRequest = {
  address: string;
  isDefault: boolean;
};
