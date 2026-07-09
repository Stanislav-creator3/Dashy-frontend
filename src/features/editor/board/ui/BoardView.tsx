"use client";

import { useState } from "react";
import { Column } from "./Column";
import { ColumnItem } from "./ColumItem";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { AutoScroller } from "@dnd-kit/dom";
import { DRAGGABLE_KEY } from "../../hooks/useDragListeners";
import { DRAGGABLE_WRAPPER_ID } from "../../components/DraggableWrapper";
import { draggableStore, useReset } from "../../model/draggableStore";
import { Button, LuSettings2, Popover } from "@/shared/ui";
import { motion, Variants } from "motion/react";
import { BoardSettings } from "./boardSettings";

interface Props {
  projectId?: string;
  pageId?: string;
}

export default function BoardView({ projectId, pageId }: Props) {
  const [items, setItems] = useState<Record<string, string[]>>({
    A: ["A0", "A1", "A2"],
    B: ["B0", "B1"],
    C: ["C0", "C1", "C2", "C3"],
    D: ["D0", "D1", "D2"],
    E: ["E0", "E1", "E2"],
  });

  const [columnOrder, setColumnOrder] = useState(() => Object.keys(items));

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center w-full p-4">
        <p
          className="font-bold text-lg w-full cursor-pointer"
          onMouseEnter={(event) => {
            const block = event.currentTarget.closest(`[${DRAGGABLE_KEY}]`);
            if (!(block instanceof HTMLElement)) return;
            const wrapper = document.getElementById(DRAGGABLE_WRAPPER_ID)!;
            const wrapperRect = wrapper.getBoundingClientRect();
            const titleRect = event.currentTarget.getBoundingClientRect();

            draggableStore.getState().setDraggable({
              htmlElement: block,
              data: {
                top: titleRect.top - wrapperRect.top - wrapper.scrollTop,
                left: titleRect.left - wrapperRect.left - 23,
                height: titleRect.height,
              },
            });
          }}
        >
          Board Title
        </p>
        <div className="flex gap-2 justify-between ">
          <Popover
            placement="top"
            offsetValue={4}
            delay={400}
            trigger={<BoardSettings />}
          >
            <div className="p-1 bg-foreground rounded-lg text-white text-sm">
              Настройки
            </div>
          </Popover>
        </div>
      </div>
      <div className="w-[100cqw] ml-[calc(50%-50cqw)] overflow-x-auto">
        <DragDropProvider
          plugins={(defaults) => [
            ...defaults.filter((p) => p !== AutoScroller),
            AutoScroller.configure({
              acceleration: 12,
              threshold: { x: 0.2, y: 0.2 },
            }),
          ]}
          onDragOver={(event) => {
            const { source, target } = event.operation;

            if (source?.type === "column") return;

            setItems((items) => move(items, event));
          }}
          onDragEnd={(event) => {
            const { source, target } = event.operation;

            if (!source || !target) return;

            if (event.canceled || source.type !== "column") return;

            setColumnOrder((columns) => move(columns, event));
          }}
        >
          <div className="flex gap-1 items-start w-max px-[calc(50cqw_-_372px)] ">
            {columnOrder.map((column, columnIndex) => (
              <Column
                key={column}
                id={column}
                index={columnIndex}
                columnName={column}
              >
                {items[column].map((id, index) => (
                  <ColumnItem
                    key={id}
                    index={index}
                    id={id}
                    column={column}
                    text={"itemId"}
                  />
                ))}
                <Button>Новая задача +</Button>
              </Column>
            ))}
          </div>
        </DragDropProvider>
      </div>
    </div>
  );
}
