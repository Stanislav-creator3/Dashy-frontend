"use client";

import { LuPlus } from "react-icons/lu";

export function ButtonNewColumn({
  createColumn,
}: {
  createColumn: () => void;
}) {
  return (
    <button
      onClick={() => createColumn()}
      className="h-80 bg-bg-hover cursor-pointer border-1 border-border shadow-sm flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-bg-secondary"
    >
      <p>Новая колонка</p>
      <LuPlus size={40} />
    </button>
  );
}
