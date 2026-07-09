import { useCallback, useMemo, useState } from "react";

export type BoardColorId =
  | "default"
  | "gray"
  | "brown"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "red";

export interface BoardColor {
  id: BoardColorId;
  label: string;
  background: string;
  text: string;
  border: string;
}
export const BOARD_COLORS: BoardColor[] = [
  {
    id: "default",
    label: "По умолчанию",
    background: "var(--board-default-bg)",
    text: "var(--board-default-text)",
    border: "var(--board-default-border)",
  },
  {
    id: "gray",
    label: "Серый",
    background: "var(--board-gray-bg)",
    text: "var(--board-gray-text)",
    border: "var(--board-gray-border)",
  },
  {
    id: "brown",
    label: "Коричневый",
    background: "var(--board-brown-bg)",
    text: "var(--board-brown-text)",
    border: "var(--board-brown-border)",
  },
  {
    id: "orange",
    label: "Оранжевый",
    background: "var(--board-orange-bg)",
    text: "var(--board-orange-text)",
    border: "var(--board-orange-border)",
  },
  {
    id: "yellow",
    label: "Желтый",
    background: "var(--board-yellow-bg)",
    text: "var(--board-yellow-text)",
    border: "var(--board-yellow-border)",
  },
  {
    id: "green",
    label: "Зеленый",
    background: "var(--board-green-bg)",
    text: "var(--board-green-text)",
    border: "var(--board-green-border)",
  },
  {
    id: "blue",
    label: "Синий",
    background: "var(--board-blue-bg)",
    text: " var(--board-blue-text)",
    border: "var(--board-blue-border)",
  },
];

export const DEFAULT_ID: BoardColorId = "default";

export interface UseColorResult {
  color: BoardColor;
  colorId: BoardColorId;
  colors: BoardColor[];
  setColor: (id: BoardColorId) => void;
}

export function useColor(initial: BoardColorId = DEFAULT_ID): UseColorResult {
  const [colorId, setColorId] = useState<BoardColorId>(initial);
  const setColor = (id: BoardColorId) => {
    setColorId(id);
  };

  const color = BOARD_COLORS.find((c) => c.id === colorId) ?? BOARD_COLORS[0];

  return { color, colorId, colors: BOARD_COLORS, setColor };
}
