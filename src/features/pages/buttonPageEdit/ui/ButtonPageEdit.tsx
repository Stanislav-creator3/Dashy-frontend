"use client";

import { DropdownMenu } from "@/shared/ui";
import { cn } from "@/shared/utils/utils";
import { AnimatePresence, motion, Variants } from "motion/react";
import { useMenuEditItems } from "../hooks/useMenuEditItems";

const variants: Variants = {
  initial: {
    y: 10,
  },
  animate: (index) => ({
    y: 0,
    transition: {
      delay: index * 0.055,
      type: "spring",
      bounce: index * 0.25,
    },
  }),
};

export default function ButtonPageEdit({
  className,
  isHover = false,
  pageId,
  projectId,
  parentId,
  setIsEdit,
}: {
  className?: string;
  isHover?: boolean;
  pageId: string;
  projectId: string;
  parentId: string | null;
  setIsEdit: (value: boolean) => void;
}) {
  const itemMenu = useMenuEditItems(pageId, parentId, projectId, setIsEdit);

  return (
    <AnimatePresence>
      <DropdownMenu items={itemMenu}>
        {isHover && (
          <motion.button
            className={cn(
              "bg-[rgba(0,0,0,0)] flex cursor-pointer rounded-xl py-2 px-1 gap-[3px]",
              className,
            )}
            whileHover={{
              background: "var(--color-yellow)",
              transition: {
                duration: 0.3,
              },
            }}
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={variants}
                initial="initial"
                animate="animate"
                className="w-1 h-1 bg-black rounded-2xl"
              ></motion.div>
            ))}
          </motion.button>
        )}
      </DropdownMenu>
    </AnimatePresence>
  );
}
