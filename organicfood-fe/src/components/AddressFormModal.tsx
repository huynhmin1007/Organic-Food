import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useAddress } from "../hooks/useAddress";
import { useForm } from "../hooks/useForm";
import { findByName, parseAddressString } from "../lib/address";
import { required } from "../lib/validators";
import { addUserAddress, updateUserAddress } from "../services/userService";
import type { Address } from "../types/user";
import Button from "./ui/Button";
import FormField from "./ui/FormField";
import SelectField from "./ui/SelectField";

interface AddressFormModalProps {
  editingAddress: Address | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddressFormModal({
  editingAddress,
  onClose,
  onSuccess,
}: AddressFormModalProps) {
  // Parse 1 lần lúc mở modal
  const [initial] = useState(() =>
    editingAddress ? parseAddressString(editingAddress.address) : null,
  );

  const { values, errors, handleChange, validateAll } = useForm(
    {
      street: initial?.street ?? "",
      provinceCode: "",
      wardCode: "",
    },
    {
      street: required("Vui lòng nhập địa chỉ"),
      provinceCode: required("Vui lòng chọn tỉnh / thành"),
      wardCode: required("Vui lòng chọn phường / xã"),
    },
  );

  const [isDefault, setIsDefault] = useState(editingAddress?.default ?? false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { provinces, wards, isLoadingWards } = useAddress(values.provinceCode);

  const applied = useRef({ province: false, ward: false });

  // provinces load xong -> chọn tỉnh của địa chỉ đang sửa
  useEffect(() => {
    if (applied.current.province || !initial || provinces.length === 0) return;
    applied.current.province = true;

    const province = findByName(provinces, initial.provinceName);
    if (province) handleChange("provinceCode", String(province.code));
    else applied.current.ward = true;
  }, [provinces]); // eslint-disable-line react-hooks/exhaustive-deps

  // wards của tỉnh đó load xong -> chọn xã
  useEffect(() => {
    if (
      !applied.current.province ||
      applied.current.ward ||
      !initial ||
      isLoadingWards ||
      wards.length === 0
    )
      return;
    applied.current.ward = true;

    const ward = findByName(wards, initial.wardName);
    if (ward) handleChange("wardCode", String(ward.code));
  }, [wards, isLoadingWards]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleProvinceChange(e: React.ChangeEvent<HTMLSelectElement>) {
    handleChange("provinceCode", e.target.value);
    handleChange("wardCode", "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validateAll()) return;

    const provinceName =
      provinces.find((p) => String(p.code) === values.provinceCode)?.name ?? "";
    const wardName =
      wards.find((w) => String(w.code) === values.wardCode)?.name ?? "";
    const fullAddress = [values.street.trim(), wardName, provinceName]
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
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-3 right-3 text-neutral-400 hover:text-neutral-600"
          aria-label="Đóng"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-bold mb-4">
          {editingAddress ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-md px-3 py-2">
              {formError}
            </div>
          )}

          <FormField
            id="street"
            type="text"
            placeholder="Số nhà, tên đường..."
            value={values.street}
            onChange={(e) => handleChange("street", e.target.value)}
            error={errors.street}
          />

          <div className="grid grid-cols-2 gap-3">
            <SelectField
              id="province"
              placeholder="Chọn tỉnh / thành"
              value={values.provinceCode}
              onChange={handleProvinceChange}
              options={provinces.map((p) => ({ value: p.code, label: p.name }))}
              error={errors.provinceCode}
            />
            <SelectField
              id="ward"
              placeholder="Chọn phường / xã"
              value={values.wardCode}
              onChange={(e) => handleChange("wardCode", e.target.value)}
              options={wards.map((w) => ({ value: w.code, label: w.name }))}
              disabled={!values.provinceCode || isLoadingWards}
              error={errors.wardCode}
            />
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

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Đang lưu..." : "Lưu địa chỉ"}
          </Button>
        </form>
      </div>
    </div>
  );
}
