"use client";

import { useIsOpen, useSetIsOpen } from "../model/store";

export function useSideBar() {
  const isOpen = useIsOpen();
  const setIsOpen = useSetIsOpen();

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen,
    open,
    close,
  };
}
