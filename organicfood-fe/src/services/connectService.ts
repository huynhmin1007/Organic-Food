import { apiClient } from "../lib/axios";

export async function connect(signal?: AbortSignal): Promise<string> {
  const { data } = await apiClient.get("/connect", { signal, timeout: 20000 });
  return data;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Gọi lặp tới khi BE trả về thành công. Trả false nếu quá maxMs hoặc bị hủy. */
export async function waitForBackend(
  signal: AbortSignal,
  { maxMs = 5 * 60_000, retryDelay = 3000 } = {},
): Promise<boolean> {
  const start = Date.now();

  while (!signal.aborted && Date.now() - start < maxMs) {
    try {
      await connect(signal);
      return true;
    } catch {
      // timeout, 502/503 lúc server đang khởi động... đều thử lại
      if (signal.aborted) return false;
      await sleep(retryDelay);
    }
  }
  return false;
}
