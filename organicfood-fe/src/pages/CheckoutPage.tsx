import { Link, Navigate, useNavigate } from "react-router-dom";
import Container from "../components/ui/Container";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useForm } from "../hooks/useForm";
import FormField from "../components/ui/FormField";
import { findByName, parseAddressString } from "../lib/address";
import { useEffect, useRef, useState } from "react";
import { useAddress } from "../hooks/useAddress";
import Spinner from "../components/ui/Spinner";
import Button from "../components/ui/Button";
import SelectField from "../components/ui/SelectField";
import type { User } from "../types/user";
import { required } from "../lib/validators";
import { UserIcon } from "lucide-react";
import AddressFormModal from "../components/AddressFormModal";
import {
  formatVnd,
  getCartLineDisplay,
  pickBestLine,
} from "../lib/discountCalculator";
import SaleBadge from "../components/SaleBadge";
import { useModal } from "../context/ModalContext";
import type { PlaceOrderRequest } from "../types/order";
import { placeOrder } from "../services/orderService";

export default function CheckoutPage() {
  const { user, isAuthenticated, isInitializing } = useAuth();
  const { items, isLoading } = useCart();

  if (isInitializing) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  if (!isAuthenticated || !user)
    return <Navigate to="/account/login" replace />;

  if (!isLoading && items.length === 0) {
    return (
      <Container className="py-12 text-center">
        <p className="text-stone-500">Giỏ hàng của bạn đang trống</p>
        <Button to="/products" variant="outline" className="mt-4">
          Tiếp tục mua sắm
        </Button>
      </Container>
    );
  }

  return <CheckoutForm user={user} />;
}

const ADD_NEW = "__add_new__";

function CheckoutForm({ user }: { user: User }) {
  const { items, totalItems, totalAmount, discountAmount, clearCart } =
    useCart();
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const addresses = user.addresses ?? [];
  const defaultAddress = addresses.find((a) => a.default) ?? addresses[0];

  const [selectedAddress, setSelectedAddress] = useState(
    defaultAddress?.address ?? "",
  );
  const [showAddModal, setShowAddModal] = useState(false);

  const { values, errors, handleChange, validateAll } = useForm(
    {
      nameReceiver: user.fullName,
      phoneReceiver: user.phone,
      address: defaultAddress?.address ?? "",
      provinceCode: "",
      wardCode: "",
    },
    {
      nameReceiver: required("Vui lòng nhập tên người nhận"),
      phoneReceiver: required("Vui lòng nhập số điện thoại người nhận"),
      address: required("Vui lòng nhập địa chỉ nhận hàng"),
      provinceCode: required("Vui lòng chọn tỉnh / thành"),
      wardCode: required("Vui lòng chọn phường / xã"),
    },
  );

  const { provinces, wards, isLoadingWards } = useAddress(values.provinceCode);

  // Xã chờ áp dụng sau khi wards của tỉnh mới load xong
  const pendingWard = useRef<string | null>(null);

  function applyAddress(fullAddress: string) {
    const parsed = parseAddressString(fullAddress);
    const province = findByName(provinces, parsed.provinceName);
    const provinceCode = province ? String(province.code) : "";

    handleChange("address", parsed.street);
    handleChange("provinceCode", provinceCode);

    // Cùng tỉnh -> wards không load lại, chọn xã luôn
    if (province && provinceCode === values.provinceCode) {
      const ward = findByName(wards, parsed.wardName);
      handleChange("wardCode", ward ? String(ward.code) : "");
      pendingWard.current = null;
    } else {
      handleChange("wardCode", "");
      pendingWard.current = province ? parsed.wardName : null;
    }
  }

  // Lần đầu: provinces load xong -> áp dụng địa chỉ mặc định
  const initialApplied = useRef(false);
  useEffect(() => {
    if (initialApplied.current || provinces.length === 0) return;
    initialApplied.current = true;
    if (defaultAddress) applyAddress(defaultAddress.address);
  }, [provinces]); // eslint-disable-line react-hooks/exhaustive-deps

  // wards load xong -> chọn xã đang chờ
  useEffect(() => {
    if (!pendingWard.current || isLoadingWards || wards.length === 0) return;
    const ward = findByName(wards, pendingWard.current);
    pendingWard.current = null;
    if (ward) handleChange("wardCode", String(ward.code));
  }, [wards, isLoadingWards]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSelectAddress(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    if (value === ADD_NEW) {
      setShowAddModal(true); // giữ nguyên lựa chọn hiện tại
      return;
    }
    setSelectedAddress(value);
    if (value) applyAddress(value);
  }

  function handleProvinceChange(e: React.ChangeEvent<HTMLSelectElement>) {
    pendingWard.current = null;
    handleChange("provinceCode", e.target.value);
    handleChange("wardCode", "");
  }

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateAll()) return;

    const provinceName =
      provinces.find((p) => String(p.code) === values.provinceCode)?.name ?? "";
    const wardName =
      wards.find((w) => String(w.code) === values.wardCode)?.name ?? "";
    const fullAddress = [values.address.trim(), wardName, provinceName]
      .filter(Boolean)
      .join(", ");

    const request: PlaceOrderRequest = {
      idempotencyKey,
      phone: values.phoneReceiver.trim(),
      address: fullAddress,
      items: items.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
      })),
    };

    openModal(
      <ConfirmOrderModal
        receiver={values.nameReceiver}
        phone={request.phone}
        address={fullAddress}
        total={totalAmount - discountAmount}
        onConfirm={async () => {
          await sleep(1500); // giả lập thanh toán
          const order = await placeOrder(request);
          navigate(`/orders/${order.code}`, {
            state: { order },
            replace: true,
          });
          clearCart().catch(() => {});
        }}
      />,
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Container className="px-4 py-6">
        <Link to="/" className="text-2xl font-medium text-neutral-800">
          Cửa hàng thực phẩm hữu cơ Organicfood
        </Link>

        <div className="flex items-center gap-2 text-sm mt-3 text-neutral-500">
          <Link to="/thanh-toan" className="text-primary-500">
            Giỏ hàng
          </Link>
          <span>›</span>
          <span className="font-medium text-neutral-800">
            Thông tin giao hàng
          </span>
        </div>
        <h2 className="text-xl font-medium mt-6">Thông tin giao hàng</h2>

        <div className="grid grid-cols-[1fr_600px] gap-6 mt-5">
          <div className="flex flex-col space-y-5">
            <div className="flex items-center gap-3">
              <div className="bg-primary-100 w-10 h-10 rounded-full flex items-center justify-center">
                <UserIcon size={20} className="text-primary-500" />
              </div>
              <div className="flex flex-col space-y-2">
                <p className="text-sm font-medium">
                  {user.fullName} ({user.phone})
                </p>
                <span className="text-sm text-blue-500">{user.email}</span>
              </div>
            </div>
            <form
              className="flex flex-col space-y-3 w-full"
              onSubmit={handleSubmit}
            >
              <FormField
                id="nameReceiver"
                type="text"
                placeholder="Họ và tên người nhận"
                value={values.nameReceiver}
                onChange={(e) => handleChange("nameReceiver", e.target.value)}
                error={errors.nameReceiver}
              />
              <FormField
                id="phoneReceiver"
                type="tel"
                placeholder="Số điện thoại người nhận"
                value={values.phoneReceiver}
                onChange={(e) => handleChange("phoneReceiver", e.target.value)}
                error={errors.phoneReceiver}
              />
              <FormField
                id="address"
                type="text"
                placeholder="Địa chỉ"
                value={values.address}
                onChange={(e) => handleChange("address", e.target.value)}
                error={errors.address}
              />

              <div className="grid grid-cols-2 gap-3">
                <SelectField
                  id="province"
                  placeholder="Chọn tỉnh / thành"
                  value={values.provinceCode}
                  onChange={handleProvinceChange}
                  options={provinces.map((p) => ({
                    value: p.code,
                    label: p.name,
                  }))}
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
              <SelectField
                id="savedAddress"
                placeholder="Danh sách địa chỉ"
                value={selectedAddress}
                onChange={handleSelectAddress}
                options={[
                  ...addresses.map((a) => ({
                    value: a.address,
                    label: a.address,
                  })),
                  { value: ADD_NEW, label: "+ Thêm địa chỉ mới" },
                ]}
              />
              <div className="text-right w-full mt-4">
                <Button type="submit" disabled={totalItems <= 0}>
                  Đặt hàng
                </Button>
              </div>
            </form>
            {showAddModal && (
              <AddressFormModal
                editingAddress={null}
                onClose={() => setShowAddModal(false)}
                onSuccess={refreshUser}
              />
            )}
          </div>
          <div className="bg-white rounded-md h-fit border border-stone-200">
            <div className="py-2 max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-thumb]:rounded-full">
              <div className="flex flex-col divide-y divide-neutral-100 mx-4">
                {items.map((item) => {
                  const product = item.product;
                  const line = pickBestLine(product, item.quantity);
                  const view = getCartLineDisplay(line);

                  return (
                    <div
                      key={product.id}
                      className="flex items-start gap-3 py-3"
                    >
                      <img
                        src={product.thumbnailUrl}
                        alt={product.name}
                        className="w-16 h-16 shrink-0 object-contain border border-neutral-200 rounded-md"
                      />

                      <div className="flex-1 min-w-0">
                        <span className="text-sm line-clamp-2">
                          {product.name}
                        </span>

                        <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                          <span className="text-sm font-semibold">
                            {formatVnd(view.unitPrice)}
                          </span>
                          {view.originalUnitPrice && (
                            <span className="text-xs text-neutral-400 line-through">
                              {formatVnd(view.originalUnitPrice)}
                            </span>
                          )}
                          {view.badge && <SaleBadge text={view.badge} />}
                          <span className="text-xs text-neutral-500">
                            x {line.quantity}
                          </span>
                        </div>

                        {view.promoText && (
                          <p className="text-xs text-orange-400 mt-0.5">
                            {view.promoText}
                          </p>
                        )}
                        {view.savedAmount > 0 && (
                          <p className="text-xs text-neutral-500 mt-0.5">
                            Tiết kiệm {formatVnd(view.savedAmount)}
                          </p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-semibold">
                          {formatVnd(view.lineTotal)}
                        </span>
                        {view.originalLineTotal && (
                          <span className="block text-xs text-neutral-400 line-through">
                            {formatVnd(view.originalLineTotal)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mx-4 mt-6 border-t border-b border-neutral-200 space-y-2 text-sm py-3">
              <div className="flex justify-between">
                <span className="text-neutral-500">Tạm tính</span>
                <span className="text-right">
                  {totalAmount.toLocaleString("vi-VN")}đ
                </span>
              </div>
              {discountAmount && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">Giảm giá</span>
                  <span>{discountAmount.toLocaleString("vi-VN")}đ</span>
                </div>
              )}
            </div>
            <div className="mx-4 mt-3 py-3 flex justify-between">
              <span className="font-medium">Tổng cộng</span>
              <span className="text-xl text-primary-600 font-bold">
                {(totalAmount - discountAmount).toLocaleString("vi-VN")}đ
                {totalAmount - discountAmount < totalAmount && (
                  <span className="text-base line-through ml-2 text-neutral-500 font-normal items-baseline">
                    {totalAmount.toLocaleString("vi-VN")}đ
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

interface ConfirmOrderModalProps {
  receiver: string;
  phone: string;
  address: string;
  total: number;
  onConfirm: () => Promise<void>;
}

function ConfirmOrderModal({
  receiver,
  phone,
  address,
  total,
  onConfirm,
}: ConfirmOrderModalProps) {
  const { closeModal } = useModal();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setIsProcessing(true);
    setError(null);
    try {
      await onConfirm();
      closeModal();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Thanh toán thất bại, vui lòng thử lại",
      );
      setIsProcessing(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
      <h2 className="text-lg font-bold mb-4">Xác nhận đặt hàng</h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-neutral-500">Người nhận</span>
          <span className="text-right">{receiver}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-neutral-500">Số điện thoại</span>
          <span className="text-right">{phone}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-neutral-500 shrink-0">Địa chỉ</span>
          <span className="text-right">{address}</span>
        </div>
        <div className="flex justify-between gap-4 pt-2 border-t border-neutral-100">
          <span className="font-medium">Tổng thanh toán</span>
          <span className="font-bold text-primary-600">{formatVnd(total)}</span>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md px-3 py-2">
          {error}
        </div>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={closeModal} disabled={isProcessing}>
          Hủy
        </Button>
        <Button onClick={handleConfirm} disabled={isProcessing}>
          {isProcessing ? "Đang xử lý thanh toán..." : "Xác nhận thanh toán"}
        </Button>
      </div>
    </div>
  );
}
