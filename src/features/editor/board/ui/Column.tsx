"use client";

import { CollisionPriority } from "@dnd-kit/abstract";
import { useSortable } from "@dnd-kit/react/sortable";
import { BoardColorId, getBoardColor } from "../model/boardColors";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useOutsideClick } from "@/shared/hooks/useOutsideClick";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { AiOutlineCheck } from "react-icons/ai";
import { ButtonEdit, DropdownMenu, Loading } from "@/shared/ui";
import { useColumnSetting } from "../hooks/useColumnSettings";
import { useBoard } from "../model/boardContext";
import { useUpdataColumn } from "../hooks/useUpdataColumn";
import { BoardCard, IBoardColumn } from "../model/board.types";
import { useDeleteFieldOptions } from "../hooks/useDeleteFieldOption";
import { DeleteColumnModal } from "./DeleteColumnModal";
import { useCreateCardBoard } from "../hooks/useCreateCardBoard";
import { GoPlus } from "react-icons/go";
export function Column({
  children,
  id,
  index,
  columnName,
  color = "default",
  columnItems,
  projectId,
  databaseId,
  groupByFieldId,
  otherColumnsProperty,
}: {
  children: React.ReactNode;
  id: string;
  index: number;
  groupByFieldId: string;
  columnName: string;
  dragActive?: boolean;
  color?: BoardColorId;
  otherColumnsProperty: IBoardColumn[];
  columnItems?: BoardCard[];
  projectId: string;
  databaseId: string;
}) {
  const {
    columnsItems,
    setColumnsItems,
    setItemsByColumn,
    itemsByColumn,
    cardsById,
  } = useBoard();

  const { createCard, isPending: isPendingCard } = useCreateCardBoard({
    projectId,
    databaseId,
    groupByFieldId,
  });

  const { onDeleteFieldOption } = useDeleteFieldOptions({
    databaseId,
    projectId,
  });
  const { updataColumn } = useUpdataColumn({
    projectId,
    databaseId,
  });

  const onDeleteColumn = ({
    fieldId,
    optionsId,
    moveToId,
  }: {
    fieldId: string;
    optionsId: string;
    moveToId: string | null;
  }) => {
    if (columnItems && columnItems?.length > 0) {
      setOpenModal(true);
    } else {
      onDeleteFieldOption({
        fieldId,
        optionsId,
        moveToId,
      });
      setColumnsItems((prev) => prev.filter((column) => column.id !== id));
      setItemsByColumn((prev) => {
        const newItemsByColumn = { ...prev };
        delete newItemsByColumn[id];
        return newItemsByColumn;
      });
    }
  };

  const [isEdit, setIsEdit] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleUpdateColor = (color: BoardColorId) => {
    updataColumn({
      fieldId: groupByFieldId,
      data: {
        config: {
          options: columnsItems?.map((item) =>
            item.id === id ? { ...item, color } : item,
          ),
        },
      },
    });
    setColumnsItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, color } : item)),
    );
  };

  const handleUpdateStatus = () => {
    const prevStatus = columnsItems?.find((item) => item.id === id)?.name;
    if (prevStatus === status) {
      setIsEdit(false);
      return;
    }
    updataColumn({
      fieldId: groupByFieldId,
      data: {
        config: {
          options: columnsItems?.map((item) =>
            item.id === id ? { ...item, name: status.trim() } : item,
          ),
        },
      },
    });
    setColumnsItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name: status } : item)),
    );
    setIsEdit(false);
  };

  const menuItems = useColumnSetting({
    columnId: id,
    color,
    onColorChange: handleUpdateColor,
    onDelete: () =>
      onDeleteColumn({
        fieldId: groupByFieldId,
        optionsId: id,
        moveToId: null,
      }),
  });
  const [status, setStatus] = useState(columnName);
  const colorStyle = getBoardColor(color);
  const { handleRef, ref, isDragging } = useSortable({
    id,
    index,
    type: "column",
    collisionPriority: CollisionPriority.Low,
    accept: ["item", "column"],
  });

  const onChangeUpdateStatus = (event: ChangeEvent<HTMLInputElement>) => {
    setStatus(event.target.value);
  };
  const refInput = useRef<HTMLInputElement | null>(null);
  const refButton = useRef<HTMLButtonElement | null>(null);
  const refOutside = useOutsideClick(() => setIsEdit(false), [refButton]);

  const onClickCreateCard = async () => {
    const card = await createCard(id);
    if (!card) return;
    setItemsByColumn((prev) => {
      const newItemsByColumn = { ...prev };
      newItemsByColumn[id] = [...newItemsByColumn[id], card.id];
      return newItemsByColumn;
    });

    cardsById.set(card.id, {
      id: card.id,
      pageId: card.pageId,
      title: card.page?.title ?? "Без названия",
      color: card.props?.color ?? null,
      position: card.position ?? itemsByColumn[id]?.length,
    });
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === "Enter") {
      event.preventDefault();
      handleUpdateStatus();
      setIsEdit(false);
    }
  };

  useEffect(() => {
    if (!isEdit) return;
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isEdit, handleKeyDown]);

  return (
    <>
      <LayoutGroup>
        <motion.li
          ref={ref}
          className="list-none flex items-start gap-1"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: [1, 0], scale: [1, 0.5] }}
          layout="position"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        >
          <div
            className="flex flex-col gap-1.5 min-h-10 p-1 min-w-65 text-black rounded-md border-1"
            style={{
              backgroundColor: colorStyle.background,
              color: colorStyle.text,
              borderColor: colorStyle.border,
            }}
          >
            <div
              ref={handleRef}
              className="relative flex items-center justify-between cursor-grab"
            >
              <div className="relative rounded-2xl p-1  hover:ring-2 hover:ring-white/50 hover:brightness-125">
                <button
                  ref={refButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEdit((prev) => !prev);
                  }}
                  className="font-bold flex items-center text-text justify-center gap-1 cursor-pointer px-2 rounded-2xl"
                  style={{
                    backgroundColor: colorStyle.status,
                  }}
                >
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: `oklch(from ${colorStyle.status} calc(l + 0.25) calc(c * 0.45) h)`,
                    }}
                  />
                  {columnName}
                  {!columnName && (
                    <span className="text-text"> Без статуса</span>
                  )}
                </button>
                <AnimatePresence>
                  {isEdit && (
                    <motion.div
                      ref={refOutside}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 5 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute flex gap-1 min-w-65 w-full"
                    >
                      <input
                        ref={refInput}
                        className="border-1 border-border bg-background text-text rounded-lg font-bold p-1 focus:outline-none"
                        placeholder="Статус"
                        autoFocus
                        value={status}
                        onChange={onChangeUpdateStatus}
                      />
                      <button
                        onClick={handleUpdateStatus}
                        className="flex items-center bg-blue-500 cursor-pointer justify-center rounded-lg w-10 h-10 border-1 p-1 border-border hover:opacity-80"
                      >
                        <AiOutlineCheck size={20} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <DropdownMenu
                enabledClick
                placement="bottom"
                trigger={<ButtonEdit dotColor="var(--color-text)" />}
                items={menuItems}
              />
            </div>
            {children}

            <motion.button
              layout="position"
              transition={{
                layout: { type: "spring", stiffness: 350, damping: 30 },
              }}
              disabled={isPendingCard}
              className="flex items-center h-8 justify-center gap-1 rounded-md p-1 text-text cursor-pointer hover:brightness-115"
              style={{
                backgroundColor: `oklch(from ${colorStyle.status} calc(l + 0.25) calc(c * 0.45) h)`,
              }}
              onClick={() => {
                onClickCreateCard();
              }}
            >
              {isPendingCard ? (
                <Loading size={15} />
              ) : (
                <span className="flex items-center gap-0.5">
                  <GoPlus size={20} /> Добавить карточку
                </span>
              )}
            </motion.button>
          </div>
        </motion.li>
      </LayoutGroup>
      <DeleteColumnModal
        columnId={id}
        databaseId={databaseId}
        openModal={openModal}
        setOpenModal={setOpenModal}
        columnItems={columnItems ?? []}
        otherColumnsProperty={otherColumnsProperty}
        groupByFieldId={groupByFieldId}
      />
    </>
  );
}
