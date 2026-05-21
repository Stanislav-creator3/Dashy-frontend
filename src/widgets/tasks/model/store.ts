
import { createJSONStorage, persist } from "zustand/middleware";
import { StateCreator } from "./../../../../node_modules/zustand/vanilla.d";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface IProcessStage {
  id: string;
  completedTask: number;
  totalTask: number;
  type: "output" | "onboarding" | "projects";
  tasks: {
    id: string;
    type: string;
    text: string;
    date: Date;
    completed: boolean;
  }[];
}

const array = [
  {
    type: "onboarding",
    completedTask: 3,
    totalTask: 5,
    tasks: [
      {
        id: "1",
        type: "TeamMeeting",
        text: "Text",
        date: "10 сентября 8:30",
        completed: true,
      },
      {
        id: "2",
        type: "TeamMeeting",
        text: "Text",
        date: "10 сентября 8:30",
        completed: true,
      },
      {
        id: "3",
        type: "TeamMeeting",
        text: "Text",
        date: "10 сентября 8:30",
        completed: true,
      },
      {
        id: "4",
        type: "TeamMeeting",
        text: "Text",
        date: "10 сентября 8:30",
        completed: false,
      },
      {
        id: "5",
        type: "TeamMeeting",
        text: "Text",
        date: "10 сентября 8:30",
        completed: false,
      },
    ],
    id: "1",
  },
  {
    type: "output",
    completedTask: 2,
    totalTask: 3,
    tasks: [
      {
        id: "1",
        type: "TeamMeeting",
        text: "Text",
        date: "10 сентября 8:30",
        completed: true,
      },
      {
        id: "2",
        type: "TeamMeeting",
        text: "Text",
        date: "10 сентября 8:30",
        completed: true,
      },
      {
        id: "3",
        type: "TeamMeeting",
        text: "Text",
        date: "10 сентября 8:30",
        completed: false,
      },
    ],
    id: "2",
  },
  {
    type: "projects",
    completedTask: 1,
    totalTask: 1,
    tasks: [
      {
        id: "5",
        type: "TeamMeeting",
        text: "Text",
        date: "10 сентября 8:30",
        completed: true,
      },
    ],
    id: "3",
  },
];

interface IActions {
  completedTask: (id: string, completed: boolean, stageType: string) => void;
  setCurrentProcessStage: (index: number, stage: string) => void;
}
interface IInitialState {
  processStage: IProcessStage[] | null | any;
  currentStage: string | null;
}

interface IState extends IActions, IInitialState {}

const initialState: IInitialState = {
  processStage: array,
  currentStage: null,
};

export const processStageStore: StateCreator<IState> = (set) => ({
  ...initialState,
  completedTask: (id, completed, stageType) =>
    set((state) => {
      if (!state.processStage) return {};
      const stageIndex = state.processStage.findIndex(
        (item) => item.type === stageType
      );
      if (stageIndex === -1) return {};

      const newProcessStage = [...state.processStage];
      const stage = { ...newProcessStage[stageIndex] };
      const newTasks = stage.tasks.map((task) =>
        task.id === id ? { ...task, completed: completed } : task
      );

      stage.tasks = newTasks;
      stage.completedTask = completed
        ? stage.completedTask + 1
        : stage.completedTask - 1;
      newProcessStage[stageIndex] = stage;

      return {
        ...state,
        processStage: newProcessStage,
      };
    }),
  setCurrentProcessStage: (index, stage) => {
    set((state) => {
      if (state.processStage) {
        return {
          ...state,
          currentStage: stage,
        };
      }
      return {};
    });
  },
});

export const useProcessStageStore = create<IState>()(
  devtools(
    persist(processStageStore, {
      name: "processStageStore",
      storage: createJSONStorage(() => localStorage),
    })
  )
);

export const useProcessStage = () =>
  useProcessStageStore((state) => state.processStage);

export const completedTask = (
  id: string,
  completed: boolean,
  stageType: string
) => useProcessStageStore.getState().completedTask(id, completed, stageType);

export const setCurrentProcessStage = (index: number, stage: string) =>
  useProcessStageStore.getState().setCurrentProcessStage(index, stage);
