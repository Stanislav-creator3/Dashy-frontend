"use client";

import React, { useEffect, useRef } from "react";

export const useOutsideClick = (
  callback: () => void,
  ignoreRefs: React.RefObject<HTMLElement | null>[] = [],
  options?: {
    ignoreSelectors?: string[];
  },
) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (
        target &&
        options?.ignoreSelectors?.some((selector) => target.closest(selector))
      ) {
        return;
      }
      if (ref.current?.contains(target)) return;

      for (const ignoreRef of ignoreRefs) {
        if (ignoreRef.current?.contains(target)) return;
      }

      callback();
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") callback();
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [callback, ref, ignoreRefs, options?.ignoreSelectors]);

  return ref;
};
