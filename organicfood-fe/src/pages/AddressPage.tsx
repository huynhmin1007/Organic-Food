import { Pencil, Plus, Trash2 } from "lucide-react";
import AddressFormModal from "../components/layout/AddressFormModal";
import { deleteUserAddress, updateUserAddress } from "../services/userService";
import type { UserAddress } from "../lib/types/user";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function AddressPage() {
  const { user, refreshUser } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(
    null,
  );
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingAddress(null);
    setModalOpen(true);
  };

  const openEditModal = (addr: UserAddress) => {
    setEditingAddress(addr);
    setModalOpen(true);
  };

  const handleDelete = async (addr: UserAddress) => {
    if (!confirm(`Xoá địa chỉ "${addr.address}"?`)) return;

    setProcessingId(addr.id);
    setError(null);
    try {
      await deleteUserAddress(addr.id);
      await refreshUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xoá địa chỉ thất bại");
    } finally {
      setProcessingId(null);
    }
  };

  const handleSetDefault = async (addr: UserAddress) => {
    if (addr.default) return;

    setProcessingId(addr.id);
    setError(null);
    try {
      await updateUserAddress(addr.id, {
        address: addr.address,
        isDefault: true,
      });
      await refreshUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cập nhật thất bại");
    } finally {
      setProcessingId(null);
    }
  };

  if (!user) return null;

  return (
    <div>
      <div className="flex items-center justify-between border-b border-neutral-200 pb-2 mb-4">
        <h2 className="text-lg font-bold">Địa chỉ</h2>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white
                     text-sm font-medium px-3 py-2 rounded-md transition-colors"
        >
          <Plus size={16} />
          Thêm địa chỉ mới
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-md px-3 py-2 mb-3">
          {error}
        </div>
      )}

      {user.addresses.length === 0 ? (
        <p className="text-center text-neutral-500 py-10">
          Chưa có địa chỉ nào.
        </p>
      ) : (
        <div className="space-y-3">
          {user.addresses.map((addr) => (
            <div
              key={addr.id}
              className="border border-neutral-200 rounded-md p-4 flex items-start justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm text-neutral-800">{addr.address}</p>
                  {addr.default && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-50 text-primary-600">
                      Mặc định
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!addr.default && (
                  <button
                    onClick={() => handleSetDefault(addr)}
                    disabled={processingId === addr.id}
                    className="text-xs text-primary-600 hover:underline disabled:opacity-50"
                  >
                    Đặt mặc định
                  </button>
                )}
                <button
                  onClick={() => openEditModal(addr)}
                  aria-label="Sửa"
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(addr)}
                  disabled={processingId === addr.id}
                  aria-label="Xoá"
                  className="text-neutral-500 hover:text-red-600 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <AddressFormModal
          editingAddress={editingAddress}
          onClose={() => setModalOpen(false)}
          onSuccess={refreshUser}
        />
      )}
    </div>
  );
}
