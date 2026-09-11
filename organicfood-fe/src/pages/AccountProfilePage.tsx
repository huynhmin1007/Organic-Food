import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useRef, useState } from "react";
import { Camera, User } from "lucide-react";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ALLOWED_TYPES = ["image/jpeg", "image/png"];

export default function AccountProfilePage() {
  const { user } = useAuth();

  const [fullName, setFullName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFullName(user?.fullName ?? "");
  }, [user]);

  const handleSelectImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setAvatarError("Chỉ chấp nhận file .JPEG, .PNG");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setAvatarError("Kích thước file tối đa 1MB");
      e.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const avatarInitial = user.fullName.trim().charAt(0).toUpperCase();

  return (
    <div className="flex flex-col space-y-3">
      <div className="border-b border-neutral-200 pb-2 mb-4">
        <h2 className="text-lg font-bold">Tài Khoản</h2>
        <span className="text-sm">
          Xin chào <span className="font-bold">{user.fullName}</span>
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-8 text-sm items-start"
      >
        <div className="flex-1 flex flex-col space-y-6">
          <div className="flex items-center gap-4">
            <label htmlFor="fullName">Họ và Tên</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="text-xs rounded-md border py-2 px-4 outline-none flex-1"
            />
          </div>

          <div className="flex items-center gap-4">
            <label>Email</label>
            <span className="text-xs">{user.email}</span>
            <Link
              to="/account/change-email"
              className="text-primary-500 underline"
            >
              Change
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <label>Số điện thoại</label>
            <span className="text-xs">{user.phone}</span>
            <Link
              to="/account/change-phone"
              className="text-primary-500 underline"
            >
              Change
            </Link>
          </div>

          <button
            type="submit"
            className="text-white bg-primary-500 hover:bg-primary-600 rounded-md py-2 font-semibold"
          >
            Lưu
          </button>
        </div>

        <div className="flex flex-col items-center shrink-0 md:w-60">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200 flex items-center justify-center">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User
                  size={52}
                  strokeWidth={1.5}
                  className="text-neutral-400"
                />
              )}
            </div>
            <button
              type="button"
              onClick={handleSelectImage}
              aria-label="Đổi ảnh đại diện"
              className="absolute bottom-0 right-0 bg-white border border-neutral-300 rounded-full p-1.5 hover:bg-neutral-50"
            >
              <Camera size={14} />
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={handleSelectImage}
            className="mt-4 border border-neutral-300 rounded-md px-4 py-2 text-sm font-medium hover:bg-neutral-50"
          >
            Select Image
          </button>

          <div className="text-xs text-neutral-400 mt-3 text-center">
            <p>File size: maximum 1 MB</p>
            <p>File extension: .JPEG, .PNG</p>
          </div>

          {avatarError && (
            <p className="text-xs text-red-500 mt-2">{avatarError}</p>
          )}
        </div>
      </form>
    </div>
  );
}
