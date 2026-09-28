import { useEffect, useState } from "react";
import type { Province, Ward } from "../lib/address";

const ADDRESS_API_URL = "https://provinces.open-api.vn/api/v2";

export function useAddress(provinceCode: string) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [isLoadingWards, setIsLoadingWards] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${ADDRESS_API_URL}/p`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data: Province[]) => setProvinces(data))
      .catch((err) => {
        if (err.name !== "AbortError")
          console.error("Lỗi load provinces:", err);
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    setWards([]); // never show the previous province's wards while the new list loads
    if (!provinceCode) return;

    const controller = new AbortController();
    setIsLoadingWards(true);

    fetch(`${ADDRESS_API_URL}/p/${provinceCode}?depth=2`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data: { wards: Ward[] }) => setWards(data.wards ?? []))
      .catch((err) => {
        if (err.name !== "AbortError") console.error("Lỗi load wards:", err);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoadingWards(false);
      });

    return () => controller.abort();
  }, [provinceCode]);

  return { provinces, wards, isLoadingWards };
}
