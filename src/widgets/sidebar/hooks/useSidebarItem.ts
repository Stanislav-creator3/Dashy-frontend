"use client";

import { useIsOpenItem, useSetIsOpenItem } from "../model/store";

export function useSideBarItem({ id }: { id: string  | null }) {
  const isOpen = useIsOpenItem(id);
  const setIsOpen = useSetIsOpenItem();

  const open = () => setIsOpen(id, true);
  const close = () => setIsOpen(id, false);

  return {
    isOpen,
    open,
    close,
  };
}
