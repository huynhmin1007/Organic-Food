const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

export function isValidPassword(password: string): boolean {
  return PASSWORD_PATTERN.test(password);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidFullName(fullName: string): boolean {
  const trimmed = fullName.trim();
  // Tối thiểu 2 ký tự, không toàn số, cho phép chữ có dấu tiếng Việt + khoảng trắng
  return trimmed.length >= 2 && /^[\p{L}\s]+$/u.test(trimmed);
}

export function isValidVietnamesePhone(phone: string): boolean {
  const trimmed = phone.trim();
  // Số VN dạng nhập tay: bắt đầu 0, theo sau là 1 trong các đầu số di động hợp lệ, tổng 10 số
  return /^0(3[2-9]|5[5689]|7[0-9]|8[1-9]|9[0-9])\d{7}$/.test(trimmed);
}

/** Chuyển "0988431111" -> "+84988431111" để gửi lên BE */
export function toE164VietnamesePhone(phone: string): string {
  const trimmed = phone.trim();
  return "+84" + trimmed.slice(1);
}
