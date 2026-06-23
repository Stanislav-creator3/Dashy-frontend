"use client";

import { UniqueIdentifier } from "@dnd-kit/abstract";
import { JSX } from "react";

export function SidebarTreeItemOverlay({
  id,
  count,
  iconElement,
  title,
}: {
  id: UniqueIdentifier;
  count: number;
  iconElement: JSX.Element | null;
  title: string;
}) {
  return (
    <div
      className="flex items-center bg-dnd-dragging justify-between min-w-40 text-black text-sm whitespace-nowrap overflow-hidden text-ellipsis gap-2 p-2 cursor-pointer rounded-4xl"
      data-overlay
    >
      <div className="flex w-full">
        <p className="flex gap-2 items-center">
          {iconElement}
          {title}
        </p>
      </div>
      {count > 0 ? (
        <span className="absolute -top-1 -right-1 w-6 h-6 text-white bg-bg-primary flex items-center justify-center rounded-full">
          {count}
        </span>
      ) : null}
    </div>
  );
}
