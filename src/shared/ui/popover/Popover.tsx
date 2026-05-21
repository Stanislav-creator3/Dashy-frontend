"use client";
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  useClick,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
  useTransitionStyles,
} from "@floating-ui/react";
import { useState } from "react";
import type { Placement } from "@floating-ui/utils";

export default function PopoverFlutingUI({
  trigger,
  children,
  placement = "top-start",
  enabledClick = false,
  offsetValue = 10,
  setOpen,
  open,
  fallbackAxisSideDirection = "none",
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
  offsetValue?: number;
  enabledClick?: boolean;
  placement?: Placement;
  setOpen?: (open: boolean) => void;
  open?: boolean;
  fallbackAxisSideDirection?: "none" | "start" | "end";
}) {
  const [defaultOpen, setDefaultOpen] = useState(false);

  const isOpen = open ?? defaultOpen;

  const setIsOpen = (open: boolean) => {
    if (setOpen) {
      setOpen(open);
    } else {
      setDefaultOpen(open);
    }
  };

  const { refs, floatingStyles, context, isPositioned } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: placement,
    middleware: [
      offset(offsetValue),
      flip({
        fallbackAxisSideDirection: fallbackAxisSideDirection,
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const { isMounted, styles } = useTransitionStyles(context);

  const hover = useHover(context, {
    enabled: enabledClick ? false : true,
    delay: {
      close: 400
    }
  });

  const click = useClick(context, {
    enabled: enabledClick,
  });

  const dismiss = useDismiss(context, {
    enabled: true,
    outsidePressEvent: "mousedown",
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    click,
    dismiss,
  ]);
  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        {trigger}
      </div>

      <FloatingPortal>
        {isMounted && (
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              zIndex: 10,
              ...styles,
            }}
            {...getFloatingProps()}
          >
            {children}
          </div>
        )}
      </FloatingPortal>
    </>
  );
}
