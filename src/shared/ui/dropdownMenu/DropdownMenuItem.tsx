"use client";

import { motion, Variants } from "motion/react";
import Link from "next/link";
import { useContext, type Ref } from "react";
import { MenuContext } from "./DropdownMenu";
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useFloating,
  useFloatingTree,
  useListItem,
  useMergeRefs,
  useTransitionStyles,
} from "@floating-ui/react";

export interface DropdownMenuItemProps extends Omit<
  React.HTMLProps<HTMLElement>,
  "label" | "onClick" | "ref"
> {
  id?: string;
  onClick?: (event?: React.MouseEvent<HTMLElement>) => void;
  href?: string;
  label: React.ReactNode;
  index: number;
  totalIndex: number;
  submenu?: boolean;
  submenuOpen?: boolean;
  customBackground?: string;
  color?: string;
  ref?: Ref<HTMLElement>;
  hoverElement?: React.ReactNode;
}

const variants = ({
  isActive,
  customBackground,
  color,
}: {
  isActive: boolean;
  customBackground?: string;
  color?: string;
}): Variants => ({
  initial: { filter: "blur(10px)", pointerEvents: "none" },
  animate: {
    backgroundColor: isActive
      ? (customBackground ?? "var(--color-bg-hover)")
      : "var(--color-background)",
    filter: "blur(0px)",
    opacity: 1,
    pointerEvents: "auto",
    color: isActive ? color : "var(--color-text)",
    transition: {
      duration: 0.3,
      // delay: index * 0.1,
      type: "spring",
      bounce: 0.45,
      backgroundColor: { duration: 0.12, ease: "easeOut" },
      filter: {
        duration: 0.3,
        ease: "easeInOut",
      },
      color: { duration: 0.2, ease: "easeOut" },
    },
  },
  exit: {
    y: -4,
    filter: "blur(10px)",
    opacity: 0,
    transition: {
      duration: 0.3,
      // delay: (totalIndex - index - 1) * 0.12,
      type: "spring",
      bounce: 0.35,
      filter: {
        duration: 0.3,
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
  customBackground,
  color,
  ref,
  hoverElement,
  ...rest
}: DropdownMenuItemProps) {
  const menu = useContext(MenuContext);
  const tree = useFloatingTree();
  const item = useListItem({
    label: typeof label === "string" ? label : null,
  });

  const isActive = item.index === menu.activeIndex || submenuOpen;
  const isHoverOpen = !!hoverElement && isActive && menu.isOpen;

  const itemProps = menu.getItemProps({
    ...rest,
    onClick(event: React.MouseEvent<HTMLElement>) {
      onClick?.(event);
      if (!submenu) {
        setTimeout(() => tree?.events.emit("click"), 350);
      }
    },
  });

  const { refs, floatingStyles, context } = useFloating({
    open: isHoverOpen,
    placement: "right-start",
    middleware: [
      offset({ mainAxis: 10, alignmentAxis: -4 }),
      flip(),
      shift({ padding: 8 }),
    ],
    whileElementsMounted: autoUpdate,
  });
  const { isMounted, styles } = useTransitionStyles(context, { duration: 150 });

  const mergedRef = useMergeRefs([item.ref, ref, refs.setReference]);
  return (
    <motion.div
      variants={variants({
        isActive,
        customBackground,
        color,
      })}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative p-1 bg-background text-text rounded-xl min-w-[200px] outline-none"
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
      {isMounted && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{ ...floatingStyles, ...styles, zIndex: 11 }}
            className="pointer-events-none rounded-lg shadow-2xl p-2 glass"
          >
            {hoverElement}
          </div>
        </FloatingPortal>
      )}
    </motion.div>
  );
}
