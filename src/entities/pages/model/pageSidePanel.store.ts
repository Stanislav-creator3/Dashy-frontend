"use client";

import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface IState {
  isOpen: boolean;
  pageId: string | null;
  databaseId: string | null;
}

interface IActions {
  open: (pageId: string, databaseId: string, isOpen: boolean) => void;
  close: () => void;
}

interface IInitialState {
  isOpen: boolean;
  pageId: string | null;
  databaseId: string | null;
}

interface IState extends IActions, IInitialState {}

const initialState: IInitialState = {
  isOpen: false,
  pageId: null,
  databaseId: null,
};

export const pageSidePanelStore: StateCreator<IState> = (set) => ({
  ...initialState,
  open: (pageId, databaseId, isOpen) => set({ pageId, databaseId, isOpen }),
  close: () => set({ isOpen: false }),
});

export const usePageSidePanelStore = create<IState>()(
  devtools(
    persist(pageSidePanelStore, {
      name: "pageSidePanelStore",
    }),
  ),
);

export const useOpenPageSidePanel = () => {
  const setIsOpen = usePageSidePanelStore((state) => state.open);
  return (id: string, databaseId: string) => {
    if (id === null) return;
    setIsOpen(id, databaseId, true);
  };
};

export const useClosePageSidePanel = () =>
  usePageSidePanelStore((state) => state.close);

export const useIsOpenPageSidePanel = () =>
  usePageSidePanelStore((state) => state.isOpen);

export const usePageId = () => usePageSidePanelStore((state) => state.pageId);

export const useDatabaseId = () =>
  usePageSidePanelStore((state) => state.databaseId);
