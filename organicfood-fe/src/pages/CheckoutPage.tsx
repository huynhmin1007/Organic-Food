import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCartDetails } from "../hooks/useCartDetails";
import { useAddress } from "../hooks/useAddress";
import { isValidVietnamesePhone } from "../lib/validators";

type FieldErrors = {
  fullName?: string;
  phone?: string;
  address?: string;
  province?: string;
  district?: string;
  ward?: string;
};

const SUGGESTED_VOUCHERS = [
  // "Giảm 50,000đ",
  // "Giảm 70,000đ",
  // "Giảm 100,000đ",
  // "Giảm 30,000đ",
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice, loading } = useCartDetails();
  const { user, logout } = useAuth();
  const {
    provinces,
    wards,
    provinceCode,
    wardCode,
    setProvinceCode,
    setWardCode,
  } = useAddress();

  const [addressMode, setAddressMode] = useState<"new" | number>("new");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleSelectSavedAddress = (value: string) => {
    if (value === "new") {
      setAddressMode("new");
      return;
    }
    const idx = Number(value);
    setAddressMode(idx);
    setAddress(user?.addresses[idx]?.address ?? "");
  };

  const validate = (): boolean => {
    const errors: FieldErrors = {};

    if (!fullName.trim()) errors.fullName = "Vui lòng nhập họ và tên";

    if (!phone.trim()) {
      errors.phone = "Số điện thoại không được trống";
    } else if (!isValidVietnamesePhone(phone)) {
      errors.phone = "Số điện thoại không hợp lệ";
    }

    if (!address.trim()) errors.address = "Địa chỉ không được trống";
    if (!provinceCode) errors.province = "Vui lòng chọn tỉnh thành";
    if (!wardCode) errors.ward = "Vui lòng chọn phường xã";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) return;

    navigate("/checkout/method");
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Link to="/" className="text-2xl font-semibold text-neutral-800">
          Cửa hàng thực phẩm hữu cơ Organicfood.vn
        </Link>

        <div className="flex items-center gap-2 text-sm mt-3 text-neutral-500">
          <Link to="/cart" className="text-primary-600">
            Giỏ hàng
          </Link>
          <span>›</span>
          <span className="font-semibold text-neutral-800">
            Thông tin giao hàng
          </span>
          <span>›</span>
          <span>Phương thức thanh toán</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 mt-6">
          {/* Bên trái: form giao hàng */}
          <div>
            <h1 className="text-xl font-semibold mb-4">Thông tin giao hàng</h1>

            {user && (
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                  <User size={20} className="text-primary-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {user.fullName} ({user.phone})
                  </p>
                  <button
                    onClick={logout}
                    className="text-xs text-blue-500 hover:underline"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}

            {user && user.addresses.length > 0 && (
              <select
                value={addressMode}
                onChange={(e) => handleSelectSavedAddress(e.target.value)}
                className="w-full border border-neutral-300 rounded-md px-3 py-2.5 mb-3 outline-none"
              >
                <option value="new">Thêm địa chỉ mới...</option>
                {user.addresses.map((addr, idx) => (
                  <option key={idx} value={idx}>
                    {addr.address}
                    {addr.isDefault ? " (Mặc định)" : ""}
                  </option>
                ))}
              </select>
            )}

            <div className="space-y-3">
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Họ và tên"
                className={`w-full border rounded-md px-3 py-2.5 outline-none ${
                  fieldErrors.fullName ? "border-red-400" : "border-neutral-300"
                }`}
              />
              {fieldErrors.fullName && (
                <p className="text-xs text-red-500 -mt-2">
                  {fieldErrors.fullName}
                </p>
              )}

              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Số điện thoại"
                className={`w-full border rounded-md px-3 py-2.5 outline-none ${
                  fieldErrors.phone ? "border-red-400" : "border-neutral-300"
                }`}
              />
              {fieldErrors.phone && (
                <p className="text-xs text-red-500 -mt-2">
                  {fieldErrors.phone}
                </p>
              )}

              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Địa chỉ (số nhà, tên đường...)"
                className={`w-full border rounded-md px-3 py-2.5 outline-none ${
                  fieldErrors.address ? "border-red-400" : "border-neutral-300"
                }`}
              />
              {fieldErrors.address && (
                <p className="text-xs text-red-500 -mt-2">
                  {fieldErrors.address}
                </p>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <select
                    value={provinceCode ?? ""}
                    onChange={(e) =>
                      setProvinceCode(
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                    className={`w-full border rounded-md px-3 py-2.5 outline-none ${
                      fieldErrors.province
                        ? "border-red-400"
                        : "border-neutral-300"
                    }`}
                  >
                    <option value="">Chọn tỉnh / thành</option>
                    {provinces.map((p) => (
                      <option key={p.code} value={p.code}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.province && (
                    <p className="text-xs text-red-500 mt-1">
                      {fieldErrors.province}
                    </p>
                  )}
                </div>

                <div>
                  <select
                    value={wardCode ?? ""}
                    onChange={(e) =>
                      setWardCode(
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                    disabled={!provinceCode}
                    className={`w-full border rounded-md px-3 py-2.5 outline-none disabled:bg-neutral-100 ${
                      fieldErrors.ward ? "border-red-400" : "border-neutral-300"
                    }`}
                  >
                    <option value="">Chọn phường / xã</option>
                    {wards.map((w) => (
                      <option key={w.code} value={w.code}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.ward && (
                    <p className="text-xs text-red-500 mt-1">
                      {fieldErrors.ward}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <Link
                to="/cart"
                className="text-primary-600 text-sm hover:underline"
              >
                Giỏ hàng
              </Link>

              <button
                onClick={handleContinue}
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold
                           px-6 py-2.5 rounded-md transition-colors"
              >
                Tiếp tục đến phương thức thanh toán
              </button>
            </div>
          </div>

          {/* Bên phải: tóm tắt đơn hàng */}
          <div className="bg-white rounded-lg shadow-sm p-4 h-fit">
            {loading ? (
              <p className="text-center text-sm text-neutral-400 py-8">
                Đang tải giỏ hàng...
              </p>
            ) : (
              <div
                className="max-h-80 overflow-y-auto divide-y divide-neutral-100
                           [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent
                           [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-thumb]:rounded-full"
              >
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-3 py-3"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={item.thumbnailUrl}
                        alt={item.name}
                        className="w-14 h-14 object-contain border border-neutral-200 rounded-md"
                      />
                      <span className="absolute -top-1.5 -right-1.5 bg-neutral-400 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-neutral-700 line-clamp-2">
                        {item.name}
                      </p>
                      {item.pricing.belowPriceText && (
                        <p className="text-xs text-primary-600 mt-0.5">
                          {item.pricing.belowPriceText}
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium">
                        {item.pricing.lineFinalTotal.toLocaleString("vi-VN")}đ
                      </p>
                      {item.pricing.savings > 0 && (
                        <p className="text-xs text-neutral-400 line-through">
                          {item.pricing.lineOriginalTotal.toLocaleString(
                            "vi-VN",
                          )}
                          đ
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <input
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                placeholder="Mã giảm giá"
                className="flex-1 border border-neutral-300 rounded-md px-3 py-2 text-sm outline-none"
              />
              <button
                disabled={!voucherCode.trim()}
                className="bg-neutral-200 text-neutral-500 disabled:opacity-60 rounded-md px-4 text-sm font-medium
                           hover:bg-neutral-300 transition-colors"
              >
                Sử dụng
              </button>
            </div>

            <button className="text-primary-500 text-sm mt-2 hover:underline">
              ⊟ Xem thêm mã giảm giá
            </button>

            <div className="flex flex-wrap gap-2 mt-2">
              {SUGGESTED_VOUCHERS.map((label) => (
                <button
                  key={label}
                  onClick={() => setVoucherCode(label)}
                  className="border border-primary-300 text-primary-600 text-xs font-medium
                             px-3 py-1.5 rounded-md hover:bg-primary-50 transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="border-t border-neutral-200 mt-4 pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Tạm tính</span>
                <span>{totalPrice.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Phí vận chuyển</span>
                <span>—</span>
              </div>
            </div>

            <div className="border-t border-neutral-200 mt-3 pt-3 flex items-center justify-between">
              <span className="font-medium">Tổng cộng</span>
              <span className="text-xl font-bold text-primary-600">
                <span className="text-xs font-normal text-neutral-500 mr-1">
                  VND
                </span>
                {totalPrice.toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
