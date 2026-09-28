import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col space-y-2 px-4 items-center justify-center text-center">
      <p className="text-primary-500 text-sm font-semibold inline-flex">
        LỖI 404
      </p>
      <h1 className="font-bold text-slate-900 text-3xl">
        Không tìm thấy trang bạn cần
      </h1>
      <p className="text-slate-500 max-w-sm">
        Trang bạn truy cập có thể đã bị xóa, đổi tên, hoặc đường dẫn không chính
        xác
      </p>
      <Button to={"/"}>Về trang chủ</Button>
    </div>
  );
}
