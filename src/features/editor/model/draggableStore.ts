"use client";

import { devtools } from "zustand/middleware";
import { create } from "zustand";

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

export const draggableStore = create<
  MiniLibraryStoreProps,
  [["zustand/devtools", never]]
>(
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
    { name: "draggableStore" },
  ),
);

import { useShallow } from "zustand/react/shallow";

export const useDraggableStore = () =>
  draggableStore(useShallow((state) => state.draggable));

export const useReset = () => draggableStore.getState().resetState;

export const useLineStore = () =>
  draggableStore(useShallow((state) => state.line));
