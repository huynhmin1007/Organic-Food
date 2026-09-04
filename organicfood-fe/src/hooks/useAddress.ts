import { useEffect, useState } from "react";
import type { Province, Ward } from "../lib/types/address";

const BASE_URL = "https://provinces.open-api.vn/api/v2";

export function useAddress() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [provinceCode, setProvinceCode] = useState<number | null>(null);
  const [wardCode, setWardCode] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${BASE_URL}/p`)
      .then((res) => res.json())
      .then((data: Province[]) => setProvinces(data))
      .catch((err) => console.error("Lỗi load provinces:", err));
  }, []);

  useEffect(() => {
    setWards([]);
    setWardCode(null);

    if (!provinceCode) return;

    fetch(`${BASE_URL}/p/${provinceCode}?depth=2`)
      .then((res) => res.json())
      .then((data: { wards: Ward[] }) => setWards(data.wards ?? []))
      .catch((err) => console.error("Lỗi load wards:", err));
  }, [provinceCode]);

  return {
    provinces,
    wards,
    provinceCode,
    wardCode,
    setProvinceCode,
    setWardCode,
  };
}
