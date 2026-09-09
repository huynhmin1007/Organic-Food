import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { isValidEmail, isValidPassword } from "../lib/validators";
import Container from "../components/ui/Container";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const errors: typeof fieldErrors = {};

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

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (!validate()) return;

    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Đăng nhập thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {};

  const handleFacebookLogin = () => {};

  return (
    <Container>
      <div className="bg-white rounded-md px-3 py-4 max-w-3xl mx-auto">
        <div className="border-b border-neutral-200 pb-3">
          <h1 className="font-bold text-xl">ĐĂNG NHẬP TÀI KHOẢN</h1>
          <div className="text-sm mt-1">
            Bạn chưa có tài khoản? Đăng ký{" "}
            <Link to="/account/register" className="underline text-primary-600">
              tại đây
            </Link>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto flex flex-col space-y-2 py-4 max-w-lg"
          noValidate
        >
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-md px-3 py-2 mb-2">
              {formError}
            </div>
          )}

          <label className="text-sm font-bold" htmlFor="email">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
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
            name="password"
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

          <div className="text-xs mt-1">
            Bạn quên mật khẩu? Nhấn vào{" "}
            <Link to="/account/reset-password" className="text-blue-500">
              đây
            </Link>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-primary-500 hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed
                       text-white rounded-md w-full py-2 text-lg font-semibold mt-3 transition-colors"
          >
            {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex-1 flex items-center justify-center gap-2 bg-[#DB4437] hover:bg-[#c53c30]
                         text-white rounded-md py-2.5 text-sm font-semibold transition-colors"
            >
              <span className="font-bold">G+</span>
              Đăng nhập Google
            </button>

            <button
              type="button"
              onClick={handleFacebookLogin}
              className="flex-1 flex items-center justify-center gap-2 bg-[#3B5998] hover:bg-[#334d84]
                         text-white rounded-md py-2.5 text-sm font-semibold transition-colors"
            >
              <span className="font-bold">f</span>
              Đăng nhập Facebook
            </button>
          </div>
        </form>
      </div>
    </Container>
  );
}
