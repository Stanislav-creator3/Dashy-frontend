"use client";

import { CollisionPriority } from "@dnd-kit/abstract";
import { useSortable } from "@dnd-kit/react/sortable";
import { MdDragIndicator } from "react-icons/md";
import { BoardColorId, useColor } from "../hooks/useColor";

export function Column({
  children,
  id,
  index,
  columnName,
  color = "default",
}: {
  children: React.ReactNode;
  id: string;
  index: number;
  columnName: string;
  dragActive?: boolean;
  color?: BoardColorId;
}) {
  const { color: colorStyle } = useColor("blue");
  const { handleRef, ref, isDragging } = useSortable({
    id,
    index,
    type: "column",
    collisionPriority: CollisionPriority.Low,
    accept: ["item", "column"],
  });

  return (
    <div
      ref={ref}
      className="flex flex-col gap-1.5 p-1 min-w-65 text-black rounded-md border-1"
      style={{
        backgroundColor: colorStyle.background,
        color: colorStyle.text,
        borderColor: colorStyle.border,
      }}
    >
      <div
        ref={handleRef}
        className="flex items-center justify-between cursor-grab"
      >
        <p className="font-bold">{columnName}</p>
        <MdDragIndicator />
      </div>
      {children}
    </div>
  );
}
