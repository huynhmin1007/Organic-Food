export function required(message = "Trường này là bắt buộc") {
  return (value: string) => (value.trim() === "" ? message : null);
}

export function email(message = "Email không hợp lệ") {
  return (value: string) => {
    if (value.trim() === "") return null; // để required() lo việc bắt buộc, tránh trùng lỗi
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    return isValid ? null : message;
  };
}

export function minLength(min: number, message?: string) {
  return (value: string) =>
    value.length < min ? (message ?? `Tối thiểu ${min} ký tự`) : null;
}

// Gộp nhiều validator thành 1 — check lần lượt, dừng ở lỗi đầu tiên gặp phải
export function combine(...validators: Array<(v: string) => string | null>) {
  return (value: string) => {
    for (const validate of validators) {
      const message = validate(value);
      if (message) return message;
    }
    return null;
  };
}

export function password(message?: string) {
  const pattern = /^(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
  return (value: string) => {
    if (value === "") return null; // để required() lo việc bắt buộc
    return pattern.test(value)
      ? null
      : (message ??
          "Mật khẩu phải có ít nhất 8 ký tự, gồm 1 số và 1 ký tự đặc biệt");
  };
}

export function phone(
  message = "Số điện thoại không hợp lệ (định dạng +84xxxxxxxxx)",
) {
  const pattern = /^\+[1-9]\d{7,14}$/;
  return (value: string) => {
    if (value.trim() === "") return null; // rỗng = hợp lệ, khớp đúng logic backend (optional field)
    return pattern.test(value) ? null : message;
  };
}
