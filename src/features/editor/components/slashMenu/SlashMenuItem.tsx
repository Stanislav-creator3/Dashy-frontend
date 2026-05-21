"use client";

import { motion, Variants } from "motion/react";
import { Ref } from "react";
import { SlashMenuOption } from "../../utils/slashItems";
import { getIcon } from "@/shared/utils/getIcon";
import { renderIcon } from "@/shared/utils/renderIcon";

const variants = ({
  index,
  totalIndex,
  isActive,
}: {
  index: number;
  totalIndex: number;
  isActive: boolean;
}): Variants => ({
  initial: { y: -10, scale: 0.3, filter: "blur(10px)", pointerEvents: "none" },
  animate: {
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    opacity: 1,
    backgroundColor: isActive ? "#37352f0f" : "",
    pointerEvents: "auto",
    transition: {
      duration: 0.75,
      delay: index * 0.1,
      type: "spring",
      bounce: 0.45,
      filter: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  },
  exit: {
    opacity: 0,
    x: index % 2 === 0 ? -40 : 40,
    scale: 0.9,
    filter: "blur(6px)",
  },
});

export function SlashMenuItem({
  option,
  index,
  totalIndex,
  isActive,
  setHighlightedIndex,
  selectOptionAndCleanUp,
}: {
  option: SlashMenuOption;
  key: string;
  index: number;
  totalIndex: number;
  isActive: boolean;
  ref: Ref<HTMLDivElement>;
  setHighlightedIndex: (index: number) => void;
  selectOptionAndCleanUp: (option: SlashMenuOption) => void;
}) {
  const icon = option.type ? getIcon(option.type) : null;
  return (
    <motion.li
      layout
      key={option.title}
      variants={variants({
        index,
        totalIndex,
        isActive,
      })}
      initial="initial"
      animate="animate"
      exit="exit"
      className="cursor-pointer rounded-lg px-2 py-1 flex items-center justify-between focus:outline-none"
      whileHover={{ backgroundColor: isActive ? "#37352f0f" : "" }}
      whileTap={{ backgroundColor: isActive ? "#37352f0f" : "" }}
      whileFocus={{ backgroundColor: isActive ? "#37352f0f" : "" }}
      tabIndex={-1}
      ref={option.setRefElement}
      onMouseEnter={() => setHighlightedIndex(index)}
      onClick={() => {
        setHighlightedIndex(index);
        selectOptionAndCleanUp(option);
      }}
    >
      <p className="text-sm text-black font-medium flex items-center gap-1.5">
        {icon && renderIcon(icon)}
        {option.title}
      </p>
      {option.markdown && (
        <p className="text-xs text-black/80">{option.markdown}</p>
      )}
    </motion.li>
  );
}
