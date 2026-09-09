import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  isValidEmail,
  isValidFullName,
  isValidPassword,
  isValidVietnamesePhone,
  toE164VietnamesePhone,
} from "../lib/validators";
import { register } from "../services/authService";
import Container from "../components/ui/Container";

type FieldErrors = {
  fullName?: string;
  phone?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export default function RegisterPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const errors: FieldErrors = {};

    if (!fullName.trim()) {
      errors.fullName = "Vui lòng nhập họ và tên";
    } else if (!isValidFullName(fullName)) {
      errors.fullName = "Họ và tên không hợp lệ";
    }

    if (!phone.trim()) {
      errors.phone = "Vui lòng nhập số điện thoại";
    } else if (!isValidVietnamesePhone(phone)) {
      errors.phone = "Số điện thoại không hợp lệ";
    }

    if (!email.trim()) {
      errors.email = "Vui lòng nhập email";
    } else if (!isValidEmail(email)) {
      errors.email = "Email không hợp lệ";
    }

    if (!password) {
      errors.password = "Vui lòng nhập mật khẩu";
    } else if (!isValidPassword(password)) {
      errors.password =
        "Mật khẩu tối thiểu 8 ký tự, gồm ít nhất 1 số và 1 ký tự đặc biệt";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Vui lòng nhập lại mật khẩu";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "Mật khẩu nhập lại không khớp";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (!validate()) return;

    setSubmitting(true);
    try {
      await register({
        fullName: fullName.trim(),
        phone: toE164VietnamesePhone(phone),
        email: email.trim(),
        password,
      });

      navigate("/account/verify-otp", {
        state: { email: email.trim(), password },
      });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Đăng ký thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <div className="bg-white rounded-md px-3 py-4 max-w-3xl mx-auto">
        <div className="border-b border-neutral-200 pb-3">
          <h1 className="font-bold text-xl">ĐĂNG KÝ TÀI KHOẢN</h1>
          <div className="text-sm mt-1">
            Bạn đã có tài khoản? Đăng nhập{" "}
            <Link to="/account/login" className="underline text-primary-600">
              tại đây
            </Link>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto flex flex-col space-y-2 py-4 max-w-lg"
          noValidate
        >
          <h2 className="font-semibold text-lg text-center">
            THÔNG TIN CÁ NHÂN
          </h2>
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-md px-3 py-2 mb-2">
              {formError}
            </div>
          )}

          <label className="text-sm font-bold" htmlFor="fullName">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={`rounded-md border py-2 px-4 outline-none ${
              fieldErrors.fullName
                ? "border-red-400 focus:border-red-500"
                : "border-neutral-200 focus:border-primary-500"
            }`}
            placeholder="Họ và tên"
          />
          {fieldErrors.fullName && (
            <p className="text-xs text-red-500">{fieldErrors.fullName}</p>
          )}

          <label className="text-sm font-bold mt-2" htmlFor="phone">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`rounded-md border py-2 px-4 outline-none ${
              fieldErrors.phone
                ? "border-red-400 focus:border-red-500"
                : "border-neutral-200 focus:border-primary-500"
            }`}
            placeholder="0987654321"
          />
          {fieldErrors.phone && (
            <p className="text-xs text-red-500">{fieldErrors.phone}</p>
          )}

          <label className="text-sm font-bold mt-2" htmlFor="email">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`rounded-md border py-2 px-4 outline-none ${
              fieldErrors.email
                ? "border-red-400 focus:border-red-500"
                : "border-neutral-200 focus:border-primary-500"
            }`}
            placeholder="Email"
          />
          {fieldErrors.email && (
            <p className="text-xs text-red-500">{fieldErrors.email}</p>
          )}

          <label className="text-sm font-bold mt-2" htmlFor="password">
            Mật khẩu <span className="text-red-500">*</span>
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`rounded-md border py-2 px-4 outline-none ${
              fieldErrors.password
                ? "border-red-400 focus:border-red-500"
                : "border-neutral-200 focus:border-primary-500"
            }`}
            placeholder="Mật khẩu"
          />
          {fieldErrors.password && (
            <p className="text-xs text-red-500">{fieldErrors.password}</p>
          )}

          <label className="text-sm font-bold mt-2" htmlFor="confirmPassword">
            Nhập lại mật khẩu <span className="text-red-500">*</span>
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`rounded-md border py-2 px-4 outline-none ${
              fieldErrors.confirmPassword
                ? "border-red-400 focus:border-red-500"
                : "border-neutral-200 focus:border-primary-500"
            }`}
            placeholder="Nhập lại mật khẩu"
          />
          {fieldErrors.confirmPassword && (
            <p className="text-xs text-red-500">
              {fieldErrors.confirmPassword}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="bg-primary-500 hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed
                       text-white rounded-md w-full py-2 text-lg font-semibold mt-3 transition-colors"
          >
            {submitting ? "Đang đăng ký..." : "Đăng ký"}
          </button>

          <div className="flex gap-2 mt-2">
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 bg-[#DB4437] hover:bg-[#c53c30]
                         text-white rounded-md py-2.5 text-sm font-semibold transition-colors"
            >
              <span className="font-bold">G+</span>
              Đăng ký Google
            </button>

            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 bg-[#3B5998] hover:bg-[#334d84]
                         text-white rounded-md py-2.5 text-sm font-semibold transition-colors"
            >
              <span className="font-bold">f</span>
              Đăng ký Facebook
            </button>
          </div>
        </form>
      </div>
    </Container>
  );
}
