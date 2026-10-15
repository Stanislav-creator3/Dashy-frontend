"use client";

import {
  useClosePageSidePanel,
  useDatabaseId,
  useIsOpenPageSidePanel,
  usePageId,
} from "../model/pageSidePanel.store";

export const usePageSidePanel = () => {
  const pageId = usePageId();
  const close = useClosePageSidePanel();
  const isOpen = useIsOpenPageSidePanel();
  const databaseId = useDatabaseId();

  return {
    isOpen,
    pageId,
    close,
    databaseId,
  };
};
