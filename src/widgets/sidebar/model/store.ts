import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { create, StateCreator } from "zustand";

export interface SidebarState {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}
interface IActions {
  setIsOpen: (value: boolean) => void;
  setIsOpenItem: (id: string, value: boolean) => void;
}

interface IInitialState {
  isOpen: boolean;
  isOpenItem: Record<string, boolean>;
}

interface IState extends IActions, IInitialState {}

const initialState: IInitialState = {
  isOpen: true,
  isOpenItem: {},
};

export const sidebarStore: StateCreator<IState> = (set) => ({
  ...initialState,
  setIsOpen: (value) => set({ isOpen: value }),
  setIsOpenItem: (id, value) =>
    set((state) => ({
      isOpenItem: { ...state.isOpenItem, [id]: value },
    })),
});

export const useSidebarStore = create<IState>()(
  devtools(
    persist(sidebarStore, {
      name: "sidebarStore",
      storage: createJSONStorage(() => localStorage),
    }),
  ),
);

export const useIsOpen = () => useSidebarStore((state) => state.isOpen);

export const useIsOpenItem = (id: string | null) =>
  useSidebarStore((state) => {
    if (id === null) return true;
    return state.isOpenItem[id] ?? false;
  });

export const useSetIsOpenItem = () => {
  const setIsOpenItem = useSidebarStore.getState().setIsOpenItem;
  return (id: string | null, value: boolean) => {
    if (id === null) return;
    setIsOpenItem(id, value);
  };
};
export const useSetIsOpen = () => useSidebarStore((state) => state.setIsOpen);
