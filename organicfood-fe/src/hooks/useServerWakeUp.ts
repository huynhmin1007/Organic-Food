import { useEffect, useRef, useState } from "react";

const CONNECT_CHECK_URL =
  (import.meta.env.VITE_API_URL ?? "http://localhost:8081/organicfood/api/v1") +
  "/connect";

const POLL_INTERVAL_MS = 3000;
const SHOW_OVERLAY_DELAY_MS = 1500;

export function useServerWakeUp() {
  const [isReady, setIsReady] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    let cancelled = false;
    let pollTimer: number;
    let showOverlayTimer: number;
    let tickTimer: number;

    showOverlayTimer = window.setTimeout(() => {
      if (!cancelled) setShowOverlay(true);
    }, SHOW_OVERLAY_DELAY_MS);

    tickTimer = window.setInterval(() => {
      if (!cancelled) {
        setElapsedSeconds(
          Math.floor((Date.now() - startTimeRef.current) / 1000),
        );
      }
    }, 1000);

    const ping = async () => {
      try {
        const res = await fetch(CONNECT_CHECK_URL, { method: "GET" });
        if (res.ok && !cancelled) {
          setIsReady(true);
          setShowOverlay(false);
          clearTimeout(showOverlayTimer);
          clearInterval(tickTimer);
          return;
        }
        throw new Error("Not ready");
      } catch {
        if (!cancelled) {
          pollTimer = window.setTimeout(ping, POLL_INTERVAL_MS);
        }
      }
    };

    ping();

    return () => {
      cancelled = true;
      clearTimeout(pollTimer);
      clearTimeout(showOverlayTimer);
      clearInterval(tickTimer);
    };
  }, []);

  return { isReady, showOverlay, elapsedSeconds };
}
