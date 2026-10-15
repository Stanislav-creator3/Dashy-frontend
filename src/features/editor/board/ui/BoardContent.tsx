"use client";

import {
  PointerSensor,
  PointerActivationConstraints,
  AutoScroller,
} from "@dnd-kit/dom";
import { move } from "@dnd-kit/helpers";
import { DragDropProvider } from "@dnd-kit/react";
import { useParams } from "next/navigation";
import { DRAGGABLE_WRAPPER_SELECTOR } from "../../components/DraggableWrapper";
import { DRAGGABLE_KEY } from "../../hooks/useDragListeners";
import { useDraggableContext } from "../../model/draggableStore";
import { BoardProvider } from "../model/boardContext";
import { BoardSettings } from "./boardSettings";
import { ButtonNewColumn } from "./ButtonNewColumn";
import { ColumnItem } from "./ColumItem";
import { Column } from "./Column";
import { useState } from "react";
import { BoardCard, IBoardColumn } from "../model/board.types";
import { DatabaseColorId } from "@/entities/database/model/databaseColors";
import { useUpdateBoardCard } from "../hooks/useUpdataBoardCard";
import { useUpdataColumn } from "../hooks/useUpdataColumn";
import { AnimatePresence, motion } from "motion/react";
import { useDeleteFieldOptions } from "../hooks/useDeleteFieldOption";
import { calculatePosition } from "@/shared/utils/calculatePosition";
import { TitleDatabase } from "@/widgets/titleDatabase";

export function BoardContent({
  title,
  databaseId,
  groupByFieldId,
  columnsBoard = [],
  itemsByColumnBoard = {},
  cardsById,
}: {
  title?: string;
  databaseId: string;
  groupByFieldId: string;
  columnsBoard: IBoardColumn[];
  itemsByColumnBoard: Record<string, string[]>;
  cardsById: Map<string, BoardCard>;
}) {
  const { id: projectId } = useParams<{ id: string }>();
  const setDraggable = useDraggableContext((state) => state.setDraggable);

  const { updateCard } = useUpdateBoardCard({
    projectId,
    databaseId,
  });

  const { onDeleteFieldOption, onDeleteFieldOptionPending } =
    useDeleteFieldOptions({
      databaseId,
      projectId,
    });

  const { updataColumn } = useUpdataColumn({
    projectId,
    databaseId,
  });
  const [columnsItems, setColumnsItems] = useState(columnsBoard);
  const [itemsByColumn, setItemsByColumn] = useState(itemsByColumnBoard);

  const value = {
    columnsItems,
    itemsByColumn,
    setColumnsItems,
    setItemsByColumn,
    projectId,
    databaseId,
    groupByFieldId,
    cardsById,
  };

  const otherColumnsProperty = (id: string) => {
    return columnsItems.filter((column) => column.id !== id);
  };

  const handleColorChange = ({
    id,
    color,
    type,
  }: {
    id: string;
    color: DatabaseColorId;
    type?: "column" | "card";
  }) => {
    if (type === "column") return;

    updateCard({ rowId: id, data: { props: { color } } });
  };

  const createColumn = ({ fieldId }: { fieldId: string }) => {
    const id = crypto.randomUUID();
    const defaultColor: DatabaseColorId = "gray";
    const config = {
      options: [
        ...columnsItems,
        {
          id,
          name: "Новая колонка",
          color: defaultColor,
          position: columnsBoard.length,
        },
      ],
    };

    setColumnsItems(config.options);
    setItemsByColumn((prev) => ({
      ...prev,
      [id]: [],
    }));
    updataColumn({
      fieldId,
      data: {
        config: config,
      },
    });
  };

  const deleteColumn = (optionsId: string, moveToId?: string) => {
    setColumnsItems((prev) => prev.filter((item) => item.id !== optionsId));
    setItemsByColumn((prev) => {
      const newItemsByColumn = { ...prev };
      delete newItemsByColumn[optionsId];
      return newItemsByColumn;
    });
    onDeleteFieldOption({ fieldId: groupByFieldId, optionsId, moveToId });
  };

  return (
    <BoardProvider value={value}>
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center w-full pb-1">
          <div
            className="font-bold text-lg w-full cursor-pointer"
            onMouseEnter={(event) => {
              const block = event.currentTarget.closest(`[${DRAGGABLE_KEY}]`);
              if (!(block instanceof HTMLElement)) return;
              const wrapper = block.closest(DRAGGABLE_WRAPPER_SELECTOR)!;
              const wrapperRect = wrapper.getBoundingClientRect();
              const titleRect = event.currentTarget.getBoundingClientRect();

              setDraggable({
                htmlElement: block,
                data: {
                  top: titleRect.top - wrapperRect.top - wrapper.scrollTop,
                  left: titleRect.left - wrapperRect.left - 23,
                  height: titleRect.height,
                },
              });
            }}
          >
            <TitleDatabase
              title={title ?? "Без названия"}
              databaseId={databaseId}
              projectId={projectId}
            />
          </div>
          <div className="flex gap-2 justify-between ">
            <BoardSettings color={"yellow"} />
          </div>
        </div>
        <div className="w-[100cqw] ml-[calc(50%-50cqw)] overflow-x-auto">
          <DragDropProvider
            sensors={[
              PointerSensor.configure({
                activationConstraints(event, source) {
                  return [
                    new PointerActivationConstraints.Distance({ value: 5 }),
                  ];
                },
              }),
            ]}
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

              const moved = move(itemsByColumn, event);
              setItemsByColumn(moved);
            }}
            onDragEnd={(event) => {
              const { source, target } = event.operation;

              if (!source || !target) return;

              if (event.canceled) return;

              if (source.type === "column") {
                const moved = move(columnsItems, event);
                setColumnsItems(moved);
                const index = moved.findIndex(
                  (column) => column.id === source.id,
                );

                const prevIndex = moved[index - 1]?.position;
                const nextIndex = moved[index + 1]?.position;
                console.log(prevIndex, nextIndex);
                const newPosition = calculatePosition(prevIndex, nextIndex);
                console.log(newPosition);

                updataColumn({
                  fieldId: groupByFieldId,
                  data: {
                    config: {
                      options: moved.map((column) => ({
                        id: column.id,
                        name: column.name,
                        color: column.color,
                        position: column.position,
                      })),
                    },
                  },
                });

                return;
              }
              const cardId = String(source.id);

              const columnId = Object.keys(itemsByColumn).find((key) =>
                itemsByColumn[key].includes(cardId),
              );

              if (!columnId) return;

              const cardsIds = itemsByColumn[columnId];
              const index = cardsIds.indexOf(cardId);

              const prevCardId = cardsById.get(cardsIds[index - 1])?.position;
              const nextCardId = cardsById.get(cardsIds[index + 1])?.position;

              const newPosition = calculatePosition(prevCardId, nextCardId);

              updateCard({
                rowId: cardId,
                data: {
                  position: newPosition,
                  cells: [
                    {
                      fieldId: groupByFieldId,
                      value: columnId,
                    },
                  ],
                },
              });
            }}
          >
            <div className="flex p-1 gap-1 items-start w-max px-[calc(50cqw_-_372px)] ">
              <AnimatePresence initial={false}>
                {columnsItems.map((column, columnIndex) => (
                  <Column
                    projectId={projectId}
                    databaseId={databaseId}
                    key={column.id}
                    otherColumnsProperty={otherColumnsProperty(column.id)}
                    id={column.id}
                    groupByFieldId={groupByFieldId}
                    columnItems={itemsByColumn[column.id]
                      .map((cardId) => cardsById.get(cardId))
                      .filter((item) => item !== undefined)}
                    index={columnIndex}
                    color={column.color}
                    columnName={column.name}
                  >
                    <AnimatePresence initial={false}>
                      {(itemsByColumn[column.id] ?? []).map((cardId, index) => {
                        const card = cardsById.get(cardId);

                        if (!card) return null;
                        return (
                          <ColumnItem
                            key={card.id}
                            index={index}
                            id={card.id}
                            pageId={card.pageId}
                            column={column.id}
                            text={card.title}
                            color={card.color ?? column.color}
                            handleColorChange={handleColorChange}
                          />
                        );
                      })}
                    </AnimatePresence>
                  </Column>
                ))}
                <motion.div
                  key="new-column"
                  layout="position"
                  className="list-none"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                >
                  <ButtonNewColumn
                    createColumn={() =>
                      createColumn({ fieldId: groupByFieldId })
                    }
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </DragDropProvider>
        </div>
      </div>
    </BoardProvider>
  );
}
