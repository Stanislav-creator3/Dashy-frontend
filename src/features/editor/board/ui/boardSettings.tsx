"use client";

import { Card, LuSettings2 } from "@/shared/ui";
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
}: {
  placement?: Placement;
  offsetValue?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const { items } = useBoardSettings();
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
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        <motion.button
          initial="default"
          whileHover="hover"
          variants={buttonVariants}
          className="flex items-center p-1 rounded-md cursor-pointer"
        >
          <LuSettings2 size={20} />
        </motion.button>
      </div>
      <FloatingPortal>
        {isMounted && (
          <FloatingOverlay className="z-10">
            <FloatingFocusManager context={context}>
              <div
                ref={refs.setFloating}
                style={{
                  ...floatingStyles,
                  zIndex: 10,
                  ...styles,
                }}
                {...getFloatingProps()}
              >
                <Card>
                  {items.map((item) => (
                    <div key={item.id} title={item.tooltip}>
                      {item.render()}
                    </div>
                  ))}
                </Card>
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </>
  );
}
