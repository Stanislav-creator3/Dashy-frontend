"use client";

import { motion, Variants } from "motion/react";
import Link from "next/link";
import type {
  MouseEvent as ReactMouseEvent,
  ReactNode,
  Ref,
} from "react";

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
    scale: isActive ? 1.15 : 1,
    filter: "blur(0px)",
    opacity: 1,
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
    y: -4,
    scale: 0.3,
    filter: "blur(10px)",
    opacity: 0,
    transition: {
      duration: 0.75,
      delay: (totalIndex - index - 1) * 0.12,
      type: "spring",
      bounce: 0.35,
      filter: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  },
});

export function DropdownMenuItem({
  onClick,
  href,
  label,
  index,
  isActive,
  totalIndex,
  onMouseEnter,
  ref,
}: {
  onClick?: (
    event: ReactMouseEvent<HTMLAnchorElement | HTMLButtonElement>
  ) => void;
  href?: string;
  label: ReactNode;
  index: number;
  totalIndex: number;
  isActive: boolean;
  onMouseEnter?: () => void;
  ref?: Ref<HTMLDivElement>;
}) {
  return (
    <motion.div
      variants={variants({ index, totalIndex, isActive })}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-1 bg-white focus:outline-none"
      whileHover={{ scale: isActive ? 1.15 : 1 }}
      whileTap={{ scale: 1 }}
      whileFocus={{ scale: 1.15 }}
      onMouseEnter={onMouseEnter}
      ref={ref}
    >
      {href ? (
        <Link className="flex w-full" href={href} onClick={onClick}>
          <motion.div className="p-2 cursor-pointer">{label}</motion.div>
        </Link>
      ) : (
        <motion.button className="flex w-full p-2 cursor-pointer" onClick={onClick}>
          {label}
        </motion.button>
      )}
    </motion.div>
  );
}
