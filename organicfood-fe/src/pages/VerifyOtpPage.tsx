import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Container from "../components/ui/Container";
import {
  register,
  resendRegisterOtp,
  verifyRegisterOtp,
} from "../services/authService";
import { toE164VietnamesePhone } from "../lib/validators";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

type LocationState = {
  email: string;
  password: string;
  fullName?: string;
  phone?: string; // dạng +84... đã convert, giữ lại để resend nếu BE cần gọi lại /auth/register
};

export default function VerifyOtpPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const { email, password } = (state as LocationState) ?? {};

  const [otpDigits, setOtpDigits] = useState<string[]>(
    Array(OTP_LENGTH).fill(""),
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [resending, setResending] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  if (!email || !password) {
    return (
      <Container>
        <div className="text-center py-10 text-neutral-500">
          Phiên đăng ký không hợp lệ. Vui lòng{" "}
          <button
            onClick={() => navigate("/account/register")}
            className="text-primary-500 underline"
          >
            quay lại trang đăng ký
          </button>
          .
        </div>
      </Container>
    );
  }

  const handleDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1); // chỉ giữ 1 ký tự số cuối cùng gõ vào

    setOtpDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;

    const next = Array(OTP_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setOtpDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const otp = otpDigits.join("");
    if (otp.length !== OTP_LENGTH) {
      setError("Vui lòng nhập đầy đủ 6 số OTP");
      return;
    }

    setSubmitting(true);
    try {
      await verifyRegisterOtp({ email, otp });
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xác thực OTP thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return;

    setResending(true);
    setError(null);
    try {
      await resendRegisterOtp(email);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gửi lại OTP thất bại");
    } finally {
      setResending(false);
    }
  };

  return (
    <Container>
      <div className="bg-white rounded-md px-3 py-4 max-w-md mx-auto">
        <h1 className="font-bold text-xl border-b border-neutral-200 pb-3">
          XÁC THỰC TÀI KHOẢN
        </h1>

        <p className="text-sm text-neutral-600 mt-3">
          Mã OTP đã được gửi tới email{" "}
          <span className="font-semibold">{email}</span>
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center mt-4"
        >
          {error && (
            <div className="w-full bg-red-50 border border-red-200 text-red-600 text-sm rounded-md px-3 py-2 mb-3">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-11 h-12 text-center text-lg font-semibold border border-neutral-300
                           rounded-md outline-none focus:border-primary-500"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed
                       text-white rounded-md py-2 text-lg font-semibold mt-5 transition-colors"
          >
            {submitting ? "Đang xác thực..." : "Xác thực"}
          </button>

          <div className="text-sm mt-3">
            {resendCooldown > 0 ? (
              <span className="text-neutral-400">
                Gửi lại mã sau {resendCooldown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-primary-500 underline disabled:opacity-60"
              >
                {resending ? "Đang gửi..." : "Gửi lại mã OTP"}
              </button>
            )}
          </div>
        </form>
      </div>
    </Container>
  );
}
