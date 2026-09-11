import { useEffect, useState } from "react";
import { useAddress } from "../../hooks/useAddress";
import type { UserAddress } from "../../lib/types/user";
import {
  findProvinceByName,
  findWardByName,
  parseAddressString,
} from "../../lib/addressParser";
import { addUserAddress, updateUserAddress } from "../../services/userService";
import { X } from "lucide-react";

type AddressFormModalProps = {
  editingAddress: UserAddress | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddressFormModal({
  editingAddress,
  onClose,
  onSuccess,
}: AddressFormModalProps) {
  const {
    provinces,
    wards,
    provinceCode,
    wardCode,
    setProvinceCode,
    setWardCode,
  } = useAddress();

  const [street, setStreet] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [errors, setErrors] = useState<{
    street?: string;
    province?: string;
    ward?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [pendingWardName, setPendingWardName] = useState<string | null>(null);

  useEffect(() => {
    if (!editingAddress || provinces.length === 0) return;

    const parsed = parseAddressString(editingAddress.address);
    setStreet(parsed.street);
    setIsDefault(editingAddress.default);

    if (parsed.provinceName) {
      const matched = findProvinceByName(provinces, parsed.provinceName);
      if (matched) {
        setProvinceCode(matched.code);
        setPendingWardName(parsed.wardName);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingAddress, provinces]);

  // Auto-chọn ward sau khi wards của tỉnh vừa chọn load xong
  useEffect(() => {
    if (!pendingWardName || wards.length === 0) return;
    const matched = findWardByName(wards, pendingWardName);
    if (matched) setWardCode(matched.code);
    setPendingWardName(null);
  }, [wards, pendingWardName, setWardCode]);

  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (!street.trim()) errs.street = "Vui lòng nhập địa chỉ";
    if (!provinceCode) errs.province = "Vui lòng chọn tỉnh thành";
    if (!wardCode) errs.ward = "Vui lòng chọn phường xã";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    const provinceName =
      provinces.find((p) => p.code === provinceCode)?.name ?? "";
    const wardName = wards.find((w) => w.code === wardCode)?.name ?? "";
    const fullAddress = [street.trim(), wardName, provinceName]
      .filter(Boolean)
      .join(", ");

    setSubmitting(true);
    try {
      if (editingAddress) {
        await updateUserAddress(editingAddress.id, {
          address: fullAddress,
          isDefault,
        });
      } else {
        await addUserAddress({ address: fullAddress, isDefault });
      }
      onSuccess();
      onClose();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Lưu địa chỉ thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-600"
          aria-label="Đóng"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-bold mb-4">
          {editingAddress ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-md px-3 py-2">
              {formError}
            </div>
          )}

          <div>
            <input
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Số nhà, tên đường..."
              className={`w-full border rounded-md px-3 py-2.5 outline-none ${
                errors.street ? "border-red-400" : "border-neutral-300"
              }`}
            />
            {errors.street && (
              <p className="text-xs text-red-500 mt-1">{errors.street}</p>
            )}
          </div>

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
                  errors.province ? "border-red-400" : "border-neutral-300"
                }`}
              >
                <option value="">Chọn tỉnh / thành</option>
                {provinces.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>
              {errors.province && (
                <p className="text-xs text-red-500 mt-1">{errors.province}</p>
              )}
            </div>

            <div>
              <select
                value={wardCode ?? ""}
                onChange={(e) =>
                  setWardCode(e.target.value ? Number(e.target.value) : null)
                }
                disabled={!provinceCode}
                className={`w-full border rounded-md px-3 py-2.5 outline-none disabled:bg-neutral-100 ${
                  errors.ward ? "border-red-400" : "border-neutral-300"
                }`}
              >
                <option value="">Chọn phường / xã</option>
                {wards.map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.name}
                  </option>
                ))}
              </select>
              {errors.ward && (
                <p className="text-xs text-red-500 mt-1">{errors.ward}</p>
              )}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="w-4 h-4 accent-primary-500"
            />
            Đặt làm địa chỉ mặc định
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60
                       text-white font-semibold py-2.5 rounded-md transition-colors mt-2"
          >
            {submitting ? "Đang lưu..." : "Lưu địa chỉ"}
          </button>
        </form>
      </div>
    </div>
  );
}
