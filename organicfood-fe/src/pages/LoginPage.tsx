import { Link, Navigate, useNavigate } from "react-router-dom";
import Container from "../components/ui/Container";
import { useForm } from "../hooks/useForm";
import { combine, email, password, required } from "../lib/validators";
import Button from "../components/ui/Button";
import FormField from "../components/ui/FormField";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { ApiError } from "../types/api";
import clsx from "clsx";
import { useModal } from "../context/ModalContext";

export const TEST_ACCOUNT = {
  email: "manager0@organicfood.vn",
  password: "Password123@",
};

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const { openModal, closeModal } = useModal();

  useEffect(() => {
    if (isAuthenticated) return;
    openModal(<TestAccountModal />);
    return closeModal;
  }, [isAuthenticated, openModal, closeModal]);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { values, errors, handleChange, validateAll } = useForm(
    { email: TEST_ACCOUNT.email, password: TEST_ACCOUNT.password },
    {
      email: combine(required("Vui lòng nhập email"), email()),
      password: required("Vui lòng nhập mật khẩu"),
    },
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateAll()) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await login(values.email, values.password);
      navigate("/");
    } catch (err) {
      setSubmitError(
        err instanceof ApiError
          ? err.message
          : "Đăng nhập thất bại, vui lòng thử lại",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Container>
      <div className="bg-white rounded-md px-3 py-4 max-w-3xl mx-auto">
        <div className="border-b border-stone-200 pb-3">
          <h1 className="font-bold text-xl">ĐĂNG NHẬP TÀI KHOẢN</h1>
          <div className="text-sm mt-1">
            Bạn chưa có tài khoản? Đăng ký{" "}
            <Link to={"/account/register"}>
              <span className="text-primary-500 underline">tại đây</span>
            </Link>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-3 mx-auto py-4 max-w-lg"
        >
          <FormField
            id="email"
            label="Email"
            type="email"
            placeholder="Email"
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={errors.email}
          />

          <FormField
            id="password"
            label="Mật khẩu"
            type="password"
            placeholder="Mật khẩu"
            value={values.password}
            onChange={(e) => handleChange("password", e.target.value)}
            error={errors.password}
          />

          <div className="text-xs mt-1">
            Bạn quên mật khẩu? Nhấn vào{" "}
            <Link to="/account/reset-password" className="text-blue-500">
              đây
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>

          <div className="flex gap-2">
            <button
              type="button"
              className="cursor-pointer flex-1 flex items-center justify-center gap-2 bg-[#DB4437] hover:bg-[#c53c30]
                         text-white rounded-md py-2.5 text-sm font-semibold transition-colors"
            >
              <span className="font-bold">G+</span>
              Đăng nhập Google
            </button>

            <button
              type="button"
              className="cursor-pointer flex-1 flex items-center justify-center gap-2 bg-[#3B5998] hover:bg-[#334d84]
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

function TestAccountModal() {
  const { closeModal } = useModal();

  return (
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
      <h2 className="text-lg font-bold mb-2">Tài khoản dùng thử</h2>
      <p className="text-sm text-neutral-500 mb-4">
        Sử dụng tài khoản sau để đăng nhập và thực hiện test:
      </p>

      <div className="space-y-2 text-sm bg-neutral-50 border border-neutral-200 rounded-md p-3">
        <div className="flex justify-between gap-4">
          <span className="text-neutral-500">Email</span>
          <span className="font-medium select-all">{TEST_ACCOUNT.email}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-neutral-500">Mật khẩu</span>
          <span className="font-medium select-all">
            {TEST_ACCOUNT.password}
          </span>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={closeModal}>Đã hiểu</Button>
      </div>
    </div>
  );
}
