import { Link } from "react-router-dom";
import Container from "../components/ui/Container";
import { useForm } from "../hooks/useForm";
import {
  combine,
  email,
  minLength,
  password,
  phone,
  required,
} from "../lib/validators";
import Button from "../components/ui/Button";
import FormField from "../components/ui/FormField";

export default function RegisterPage() {
  const { values, errors, handleChange, validateAll } = useForm(
    { fullName: "", phone: "", email: "", password: "" },
    {
      fullName: combine(required("Vui lòng nhập họ và tên"), minLength(1)),
      phone: combine(required("Vui lòng nhập số điện thoại"), phone()),
      email: combine(required("Vui lòng nhập email"), email()),
      password: combine(required("Vui lòng nhập mật khẩu"), password()),
    },
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateAll()) return;
  }

  return (
    <Container>
      <div className="bg-white rounded-md px-3 py-4 max-w-3xl mx-auto">
        <div className="border-b border-stone-200 pb-3">
          <h1 className="font-bold text-xl">ĐĂNG KÝ TÀI KHOẢN</h1>
          <div className="text-sm mt-1">
            Bạn đã có tài khoản? Đăng nhập{" "}
            <Link to={"/account/register"}>
              <span className="text-primary-500 underline">tại đây</span>
            </Link>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-3 mx-auto py-4 max-w-lg"
        >
          <h2 className="font-semibold text-lg text-center">
            THÔNG TIN CÁ NHÂN
          </h2>
          <FormField
            id="fullName"
            label="Họ và tên"
            type="text"
            placeholder="Họ và tên"
            value={values.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            error={errors.fullName}
          />
          <FormField
            id="phone"
            label="Số điện thoại"
            type="tel"
            placeholder="Số điện thoại"
            value={values.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            error={errors.phone}
          />
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

          <Button type="submit" variant="primary" size="md" className="w-full">
            Đăng ký
          </Button>

          <div className="flex gap-2">
            <button
              type="button"
              className="cursor-pointer flex-1 flex items-center justify-center gap-2 bg-[#DB4437] hover:bg-[#c53c30]
                         text-white rounded-md py-2.5 text-sm font-semibold transition-colors"
            >
              <span className="font-bold">G+</span>
              Đăng ký Google
            </button>

            <button
              type="button"
              className="cursor-pointer flex-1 flex items-center justify-center gap-2 bg-[#3B5998] hover:bg-[#334d84]
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
