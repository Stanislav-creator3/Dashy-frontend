"use client";

import { Card, DropdownMenu, LuSettings2, Popover } from "@/shared/ui";
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  offset,
  Placement,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useTransitionStyles,
} from "@floating-ui/react";
import { motion, Variants } from "motion/react";
import { useState } from "react";
import { useBoardSettings } from "../hooks/useBoardSettings";
import { BoardColorId } from "../model/boardColors";

const buttonVariants: Variants = {
  default: {
    backgroundColor: "oklch(0.93 0 0 / 0)",
    transition: { duration: 0.2 },
  },
  hover: {
    backgroundColor: "oklch(0.93 0 0 / 1)",
    transition: { duration: 0.2 },
  },
};

export function BoardSettings({
  placement = "left",
  offsetValue = 10,
  color,
}: {
  placement?: Placement;
  offsetValue?: number;
  color: BoardColorId;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: placement,
    middleware: [
      offset(offsetValue),
      flip({
        fallbackAxisSideDirection: "none",
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const { isMounted, styles } = useTransitionStyles(context);

  const click = useClick(context);

  const dismiss = useDismiss(context, {
    outsidePressEvent: "mousedown",
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);
  return (
    <DropdownMenu
      enabledClick={true}
      trigger={
        <Popover
          placement="top"
          trigger={
            <motion.button
              initial="default"
              whileHover="hover"
              variants={buttonVariants}
              className="flex items-center p-1 rounded-md cursor-pointer"
            >
              <LuSettings2 size={20} />
            </motion.button>
          }
        >
          <div className="p-1 bg-foreground rounded-lg text-white text-sm">
            Настройки
          </div>
        </Popover>
      }
      items={[]}
    />
  );
}
