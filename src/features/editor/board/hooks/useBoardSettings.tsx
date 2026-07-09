import { useState } from "react";
import { ColorBoard } from "../ui/ColorBoard";

export function useBoardSettings() {
  const items = [
    {
      id: "colorColumn",
      tooltip: "Цвет колонок",
      render: () => <ColorBoard />,
    },
  ];

  return { items };
}
