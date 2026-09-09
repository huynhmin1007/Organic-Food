import type { Province, Ward } from "./types/address";

const PROVINCE_PREFIX = /^(tỉnh|thành phố)\s+/i;
const WARD_PREFIX = /^(phường|xã|thị trấn)\s+/i;

function normalize(str: string): string {
  return str.trim().toLowerCase();
}

function stripPrefix(str: string, prefixRegex: RegExp): string {
  return str.trim().replace(prefixRegex, "").trim();
}

export type ParsedAddress = {
  street: string;
  provinceName: string | null; // tên phần đuôi tách được, chưa chắc khớp provinces list
  wardName: string | null;
};

/** Tách "123 Bung Ong Thoan, Phường Tam Chúc, Tỉnh Ninh Bình" -> street/ward/province */
export function parseAddressString(fullAddress: string): ParsedAddress {
  const parts = fullAddress
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length < 3) {
    return { street: fullAddress, provinceName: null, wardName: null };
  }

  const provincePart = parts[parts.length - 1];
  const wardPart = parts[parts.length - 2];
  const street = parts.slice(0, parts.length - 2).join(", ");

  return {
    street,
    provinceName: stripPrefix(provincePart, PROVINCE_PREFIX),
    wardName: stripPrefix(wardPart, WARD_PREFIX),
  };
}

export function findProvinceByName(
  provinces: Province[],
  name: string,
): Province | null {
  const target = normalize(name);
  return (
    provinces.find(
      (p) => normalize(stripPrefix(p.name, PROVINCE_PREFIX)) === target,
    ) ?? null
  );
}

export function findWardByName(wards: Ward[], name: string): Ward | null {
  const target = normalize(name);
  return (
    wards.find((w) => normalize(stripPrefix(w.name, WARD_PREFIX)) === target) ??
    null
  );
}
