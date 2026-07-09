"use client";

import { cn } from "@/lib/utils";
import { ButtonEdit } from "@/shared/ui";
import { mergeRefs } from "@/shared/utils/mergeRefs";
import { useSortable } from "@dnd-kit/react/sortable";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { useState } from "react";
import { BoardColorId, useColor } from "../hooks/useColor";

export function ColumnItem({
  id,
  index,
  column,
  text,
  color = "default",
}: {
  id: string;
  index: number;
  column: string;
  text: string;
  color?: BoardColorId;
}) {
  const { ref, isDragging } = useSortable({
    id,
    index,
    type: "item",
    accept: "item",
    group: column,
  });

  const { color: colorStyle, colorId, colors, setColor } = useColor("yellow");
  const [isHover, setIsHover] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [scope, animate] = useAnimate();

  return (
    <motion.div
      ref={mergeRefs(scope, ref)}
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
        "flex justify-between p-1 cursor-pointer rounded-md border-1",
        isDragging && "opacity-50",
      )}
      onHoverStart={() => setIsHover(true)}
      onHoverEnd={() => setIsHover(false)}
    >
      <button>{"Test"}</button>
      <AnimatePresence>
        {isHover && (
          <motion.div
            key="edit"
            className="flex gap-1 items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.3, type: "spring", stiffness: 200 },
            }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <ButtonEdit />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
