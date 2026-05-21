"use client";

import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { create, StateCreator } from "zustand";

interface IActions {
  setProjectId: (id: string) => void;
}

interface IInitialState {
  projectId: string | null;
}

interface IState extends IActions, IInitialState {}

const initialState: IInitialState = {
  projectId: null,
};

export const projectStore: StateCreator<IState> = (set) => ({
  ...initialState,
  setProjectId: (projectId) => set({ projectId }),
});

export const useProjectStore = create<IState>()(
  devtools(
    persist(projectStore, {
      name: "projectStore",
      storage: createJSONStorage(() => localStorage),
    })
  )
);

export const useProjectId = () => useProjectStore((state) => state.projectId);

export const useSetProjectId = () =>
  useProjectStore((state) => state.setProjectId);
