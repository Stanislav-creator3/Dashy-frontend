"use client";

import { cn } from "@/lib/utils";
import { ButtonEdit, DropdownMenu } from "@/shared/ui";
import { mergeRefs } from "@/shared/utils/mergeRefs";
import { useSortable } from "@dnd-kit/react/sortable";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { useState } from "react";
import { useParams } from "next/navigation";
import {
  DatabaseColorId,
  getDatabaseColor,
} from "@/entities/database/model/databaseColors";
import { useColumnItemSetting } from "../hooks/useColumnItemSetting";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pagesApi } from "@/entities/pages/api/pages.api";
import toast from "react-hot-toast";
import { databaseApi } from "@/entities/database/api/database.api";
import { useBoard } from "../model/boardContext";
import { useOpenPageSidePanel } from "@/entities/pages/model/pageSidePanel.store";
import { KeyboardSensor, PointerSensor } from "@dnd-kit/react";

export function ColumnItem({
  id,
  index,
  column,
  text,
  pageId,
  color = "default",
  handleColorChange,
}: {
  id: string;
  index: number;
  column: string;
  text: string;
  pageId: string;
  color?: DatabaseColorId;
  handleColorChange: ({
    id,
    color,
  }: {
    id: string;
    color: DatabaseColorId;
  }) => void;
}) {
  const { id: projectId } = useParams<{ id: string }>();
  const { databaseId, setItemsByColumn, cardsById } = useBoard();
  const openSidePanel = useOpenPageSidePanel();

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: pagesApi.deletePage,

    onMutate: () => {
      queryClient.cancelQueries({
        queryKey: databaseApi.getById({ id: databaseId, projectId }).queryKey,
      });
      const prevDatabase = queryClient.getQueryData(
        databaseApi.getById({ id: databaseId, projectId }).queryKey,
      );

      queryClient.setQueryData(
        databaseApi.getById({ id: databaseId, projectId }).queryKey,
        (database) => {
          return database
            ? {
                ...database,
                rows: database.rows.filter((row) => row.pageId !== pageId),
              }
            : database;
        },
      );

      return { prevDatabase };
    },

    onSuccess: () => {
      toast.success("Страница перенесена в архив", {
        position: "bottom-right",
      });
    },
    onError: (_, __, context) => {
      toast.error("Произошла ошибка", {
        position: "bottom-right",
      });
      if (!context) return;

      queryClient.setQueryData(
        databaseApi.getById({ id: databaseId, projectId }).queryKey,
        context.prevDatabase,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(
        databaseApi.getById({ id: databaseId, projectId }),
      );
    },
  });

  const { ref, isDragging } = useSortable({
    id,
    index,
    type: "item",
    accept: "item",
    group: column,
    sensors: [
      PointerSensor.configure({
        preventActivation: (event) =>
          event.target instanceof Element &&
          !!event.target.closest("[data-dnd-nodrag]"),
      }),
      KeyboardSensor,
    ],
  });

  const items = useColumnItemSetting({
    id,
    color,
    onColorChange: handleColorChange,
    onDelete: () => {
      mutate({ id: pageId, projectId });
    },
  });

  const [isHover, setIsHover] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [scope, animate] = useAnimate();

  const colorStyle = getDatabaseColor(color);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, transition: { duration: 0.3 } }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
      ref={mergeRefs(scope, ref)}
      onClick={(event) => {
        if (event.defaultPrevented) return;
        openSidePanel(pageId, databaseId);
      }}
      style={{
        ["--bg" as string]: colorStyle.background,
        ["--darken" as string]: 0,
        backgroundColor: "oklch(from var(--bg) calc(l - var(--darken)) c h)",
        color: colorStyle.text,
        borderColor: colorStyle.border,
      }}
      whileHover={{ ["--darken"]: 0.05 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex w-62.5 justify-between p-1  cursor-pointer rounded-md border-1",
        isDragging && "opacity-50",
      )}
      onHoverStart={() => setIsHover(true)}
      onHoverEnd={() => setIsHover(false)}
    >
      <span className="max-w-50 truncate ">{text}</span>
      <AnimatePresence>
        {(isHover || isEdit) && (
          <motion.div
            key="edit"
            className="flex gap-1 items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.3, type: "spring", stiffness: 200 },
            }}
            onClick={(event) => event.stopPropagation()}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <DropdownMenu
              enabledClick
              onOpenChange={(open) => {
                setIsEdit(open);
              }}
              placement="bottom"
              trigger={
                <ButtonEdit isActive={isEdit} dotColor="var(--color-text)" />
              }
              items={items}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
