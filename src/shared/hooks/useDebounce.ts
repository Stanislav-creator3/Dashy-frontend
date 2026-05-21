import { useEffect, useMemo, useRef } from "react";
import { debounce } from "../utils/debounce";

export default function useDebounce<T extends (...args: any[]) => void>(
  callback:  T,
  delay = 500
) {
  const ref = useRef(callback);

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = (...args: Parameters<T>) => {
      ref.current?.(...args);
    };

    return debounce(func, delay);
  }, []);

  useEffect(() => {
    return () => {
      debouncedCallback.cancel();
    };
  }, [debouncedCallback]);

  return debouncedCallback;
}
