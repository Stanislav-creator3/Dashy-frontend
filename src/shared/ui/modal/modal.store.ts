import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

interface IActionStore {
  onOpen: () => void;
  onClose: () => void;
  pushModal: (id: string) => void;
  removeModal: (id: string) => void;
}
interface IInitialState {
  isOpen: boolean;
  stack: string[];
}
const initialState: IInitialState = {
  isOpen: true,
  stack: [],
};

interface IModalStore extends IInitialState, IActionStore {}

export const modalStore: StateCreator<IModalStore> = (set) => ({
  ...initialState,
  onClose: () => set((state) => ({ isOpen: false })),
  onOpen: () => set((state) => ({ isOpen: true })),
  pushModal: (id) =>
    set((state) =>
      state.stack.includes(id) ? state : { stack: [...state.stack, id] },
    ),
  removeModal: (id) =>
    set((state) => ({ stack: state.stack.filter((item) => item !== id) })),
});

export const useModalStore = create<IModalStore>()(devtools(modalStore));

export const useIsOpen = () => useModalStore((state) => state.isOpen);
export const onOpenModal = () => useModalStore((state) => state.onOpen);
export const onCloseModal = () => useModalStore((state) => state.onClose);
export const useModalStackIndex = (id: string) =>
  useModalStore((state) => state.stack.indexOf(id));
export const usePushModal = () => useModalStore((state) => state.pushModal);
export const useRemoveModal = () => useModalStore((state) => state.removeModal);
export const useLastModal = () =>
  useModalStore((state) =>
    state.stack.length ? state.stack[state.stack.length - 1] : null,
  );
