"use client";

import { motion, Variants } from "motion/react";
import Link from "next/link";
import { useContext, type Ref } from "react";
import { MenuContext } from "./DropdownMenu";
import { useFloatingTree, useListItem, useMergeRefs } from "@floating-ui/react";

interface DropdownMenuItemProps extends Omit<
  React.HTMLProps<HTMLElement>,
  "label" | "onClick" | "ref"
> {
  onClick?: (event?: React.MouseEvent<HTMLElement>) => void;
  href?: string;
  label: React.ReactNode;
  index: number;
  totalIndex: number;
  submenu?: boolean;
  submenuOpen?: boolean;
  ref?: Ref<HTMLElement>;
}

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
    backgroundColor: isActive
      ? "var(--color-bg-hover)"
      : "var(--color-background)",
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
  label,
  href,
  onClick,
  index,
  totalIndex,
  submenu = false,
  submenuOpen = false,
  ref,
  ...rest
}: DropdownMenuItemProps) {
  const menu = useContext(MenuContext);
  const tree = useFloatingTree();
  const item = useListItem({
    label: typeof label === "string" ? label : null,
  });

  const isActive = item.index === menu.activeIndex || submenuOpen;
  const mergedRef = useMergeRefs([item.ref, ref]);

  const itemProps = menu.getItemProps({
    ...rest,
    onClick(event: React.MouseEvent<HTMLElement>) {
      onClick?.(event);
      if (!submenu) {
        setTimeout(() => tree?.events.emit("click"), 350);
      }
    },
  });
  return (
    <motion.div
      variants={variants({ index, totalIndex, isActive })}
      initial="initial"
      animate="animate"
      exit="exit"
      whileTap={{ scale: 0.9 }}
      className="p-1 bg-background rounded-xl min-w-[200px] outline-none"
    >
      {href ? (
        <Link
          ref={mergedRef}
          href={href}
          role="menuitem"
          tabIndex={isActive ? 0 : -1}
          className="flex px-2 w-full outline-none"
          {...itemProps}
        >
          {label}
        </Link>
      ) : (
        <button
          className="flex w-full px-2 cursor-pointer outline-none"
          ref={mergedRef}
          role="menuitem"
          tabIndex={isActive ? 0 : -1}
          {...itemProps}
        >
          {label}
        </button>
      )}
    </motion.div>
  );
}
