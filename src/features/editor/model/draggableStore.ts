"use client";

import { devtools } from "zustand/middleware";
import { create, createStore, useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { createContext, useContext } from "react";

type Draggable = {
  htmlElement: HTMLElement;
  data: {
    top: number;
    left: number;
    height: number;
  };
};

type Line = {
  htmlElement: HTMLElement;
  data: {
    top: number;
    left: number;
    height: number;
    width: number;
    position: "top" | "bottom";
  };
};

interface MiniLibraryStoreProps {
  draggable?: Draggable;
  setDraggable: (value: Draggable) => void;
  line?: Line;
  setLine: (value: Line) => void;
  resetState: () => void;
}

export const createDraggableStore = (name = "draggableStore") =>
  createStore<MiniLibraryStoreProps>()(
    devtools(
      (setState, getState) => ({
        draggable: undefined,
        setDraggable: (value) => {
          setState(
            {
              draggable: value,
            },
            false,
            { type: "setDraggable", value },
          );
        },
        resetState: () => {
          setState(
            {
              draggable: undefined,
              line: undefined,
            },
            false,
            { type: "resetState" },
          );
        },
        line: undefined,
        setLine: (newLine) => {
          const prevLine = getState().line?.data;

          if (
            prevLine?.top === newLine.data.top &&
            prevLine?.left === newLine.data.left &&
            prevLine?.height === newLine.data.height &&
            prevLine?.width === newLine.data.width &&
            prevLine?.position === newLine.data.position
          ) {
            return;
          }

          setState(
            {
              line: newLine,
            },
            false,
            { type: "setLine", value: newLine },
          );
        },
      }),
      { name },
    ),
  );

export type DraggableStore = ReturnType<typeof createDraggableStore>;

export const DraggableContext = createContext<DraggableStore | null>(null);

export function useDraggableContext<T>(
  selector: (state: MiniLibraryStoreProps) => T,
): T {
  const store = useContext(DraggableContext);
  if (!store) throw new Error("Missing DraggableContext.Provider in the tree");
  return useStore(store, selector);
}

export const useDraggableStore = () =>
  useDraggableContext(useShallow((state) => state.draggable));

export const useReset = () => useDraggableContext((state) => state.resetState);

export const useLineStore = () =>
  useDraggableContext(useShallow((state) => state.line));
