import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { create, StateCreator } from "zustand";

export type ITheme = "dark" | "light" | "system";
export type IResolvedTheme = "light" | "dark";

interface IActions {
  setTheme: (value: "dark" | "light" | "system") => void;
  toggleTheme: () => void;
  setResolvedTheme: (theme: IResolvedTheme) => void;
}

interface IInitialState {
  theme: ITheme;
  resolvedTheme: IResolvedTheme;
}

interface IState extends IActions, IInitialState {}

const initialState: IInitialState = {
  theme: "system",
  resolvedTheme: "light",
};

export const themeStore: StateCreator<IState> = (set) => ({
  ...initialState,
  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
  setResolvedTheme: (resolvedTheme) => set({ resolvedTheme }),
});

export const useThemeStore = create<IState>()(
  devtools(
    persist(themeStore, {
      name: "themeStore",
      storage: createJSONStorage(() => localStorage),
    }),
  ),
);

export const useTheme = () => useThemeStore((state) => state.theme);
export const useSetTheme = (theme: "dark" | "light" | "system") =>
  useThemeStore.getState().setTheme(theme);
export const useToggleTheme = () => useThemeStore.getState().toggleTheme();
export const useResolvedTheme = () =>
  useThemeStore((state) => state.resolvedTheme);
export const useSetResolvedTheme = (theme: IResolvedTheme) =>
  useThemeStore.getState().setResolvedTheme(theme);
