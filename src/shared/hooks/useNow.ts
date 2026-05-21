"use client";
import { useLayoutEffect, useRef, useState } from "react";

export function useNow(
  updateInterval: number,
  enabled: number | null,
  cb?: () => void
): number {
  const cbRef = useRef(cb);
  cbRef.current = cb;

  const [now, setNow] = useState(Date.now());

  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }
    setNow(Date.now());
    cbRef.current?.();

    const interval = setInterval(() => {
      setNow(Date.now());
      cbRef.current?.();
    }, updateInterval);

    return () => {
      clearInterval(interval);
    };
  }, [updateInterval, enabled]);

  return now;
}
