export interface Province {
  code: number;
  name: string;
}
export interface Ward {
  code: number;
  name: string;
  province_code: number;
}

export type ParsedAddress = {
  street: string;
  provinceName: string | null;
  wardName: string | null;
};

const PREFIX = /^(tỉnh|thành phố|phường|xã|thị trấn)\s+/i;

const normalize = (str: string) => str.trim().replace(PREFIX, "").toLowerCase();

/** "123 Bung Ong Thoan, Phường Tam Chúc, Tỉnh Ninh Bình" -> street / ward / province */
export function parseAddressString(fullAddress: string): ParsedAddress {
  const parts = fullAddress
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length < 3) {
    return { street: fullAddress, provinceName: null, wardName: null };
  }

  return {
    street: parts.slice(0, -2).join(", "),
    wardName: parts.at(-2)!,
    provinceName: parts.at(-1)!,
  };
}

/** Dùng chung cho cả province và ward */
export function findByName<T extends { name: string }>(
  list: T[],
  name: string | null,
): T | undefined {
  if (!name) return undefined;
  const target = normalize(name);
  return list.find((item) => normalize(item.name) === target);
}
