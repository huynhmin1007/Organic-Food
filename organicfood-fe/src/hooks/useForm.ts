import { useState } from "react";

type Validator = (value: string) => string | null; // trả về message lỗi, hoặc null nếu hợp lệ

type ValidatorsMap<T> = Partial<Record<keyof T, Validator>>;

export function useForm<T extends Record<string, string>>(
  initialValues: T,
  validators: ValidatorsMap<T>,
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  function handleChange(field: keyof T, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Xoá lỗi của field đó ngay khi người dùng sửa lại — không đợi submit mới hết lỗi
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function validateField(field: keyof T): boolean {
    const validator = validators[field];
    if (!validator) return true;

    const message = validator(values[field]);
    setErrors((prev) => ({ ...prev, [field]: message ?? undefined }));
    return message === null;
  }

  function validateAll(): boolean {
    let isValid = true;
    const newErrors: Partial<Record<keyof T, string>> = {};

    for (const field in validators) {
      const validator = validators[field];
      if (!validator) continue;
      const message = validator(values[field]);
      if (message) {
        newErrors[field] = message;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }

  return { values, errors, handleChange, validateField, validateAll };
}
