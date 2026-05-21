import { create, StateCreator } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface IActions {
  startTimer: (id: string, date: number) => void;
  stopTimer: (id: string, pause: number) => void;
  setTimerData: (id: string, date: number, isActive: boolean) => void;
  reset: () => void;
}
interface IInitialState {
  isTimerActive: boolean;
  timerId: string | null;
  timeDate: number | null;
  timePause: number;
}

interface IState extends IActions, IInitialState {}

const initialState: IInitialState = {
  isTimerActive: false,
  timerId: null,
  timeDate: null,
  timePause: 0,
};
export const timeTrackerStore: StateCreator<IState> = (set, _, store) => ({
  ...initialState,
  startTimer: (id: string, date: number) => {
    set((state) => {
      return {
        ...state,
        isTimerActive: true,
        timerId: id,
        timeDate: date,
      };
    });
  },
  stopTimer: (id: string, pause: number) => {
    set((state) => {
      return {
        ...state,
        isTimerActive: false,
        timerId: id,
        timePause: pause,
      };
    });
  },
  setTimerData: (id: string, date: number, isActive: boolean) => {
    set((state) => {
      return {
        ...state,
        isTimerActive: isActive,
        timerId: id,
        timeDate: date,
      };
    });
  },
  reset: () => {
    set(store.getInitialState());
  },
});

export const useTimeTrackerStore = create<IState>()(
  devtools(
    persist(timeTrackerStore, {
      name: "timeTrackerStore",
      storage: createJSONStorage(() => localStorage),
    })
  )
);

export const useTimeTracker = () =>
  useTimeTrackerStore((state) => state.isTimerActive);

export const setStartTimer = (id: string, date: number) =>
  useTimeTrackerStore.getState().startTimer(id, date);

export const setStopTimer = (id: string, pause: number) =>
  useTimeTrackerStore.getState().stopTimer(id, pause);

export const setTimerData = (id: string, date: number, isActive: boolean) =>
  useTimeTrackerStore.getState().setTimerData(id, date, isActive);

export const resetState = () => useTimeTrackerStore.getState().reset();
