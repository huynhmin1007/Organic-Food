import axios from "axios";
import { useEffect, useState } from "react";
import { ApiError } from "../types/api";

export function useFetch<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: unknown[] = [],
  enabled = true,
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    async function run() {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetcher(controller.signal);
        if (!controller.signal.aborted) setData(result);
      } catch (err) {
        if (axios.isCancel(err) || controller.signal.aborted) return;
        setError(err instanceof ApiError ? err.message : "Unknown exception");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    run();

    return () => controller.abort();
  }, [...deps, enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, isLoading, error };
}
