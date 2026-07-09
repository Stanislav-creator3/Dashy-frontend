"use client";
import {
  autoUpdate,
  flip,
  FloatingNode,
  FloatingPortal,
  FloatingTree,
  offset,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree,
  useHover,
  useInteractions,
  useTransitionStyles,
} from "@floating-ui/react";
import { useEffect, useState } from "react";
import type { Placement } from "@floating-ui/utils";

interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  offsetValue?: number;
  enabledClick?: boolean;
  placement?: Placement;
  delay?: number;
  setOpen?: (open: boolean) => void;
  open?: boolean;
  fallbackAxisSideDirection?: "none" | "start" | "end";
}

export default function Popover(props: PopoverProps) {
  const parentId = useFloatingParentNodeId();

  if (parentId === null) {
    return (
      <FloatingTree>
        <PopoverFlutingUI {...props} />
      </FloatingTree>
    );
  }

  return <PopoverFlutingUI {...props} />;
}

function PopoverFlutingUI({
  trigger,
  children,
  placement = "top-start",
  enabledClick = false,
  offsetValue = 10,
  setOpen,
  delay = 0,
  open,
  fallbackAxisSideDirection = "none",
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
  offsetValue?: number;
  enabledClick?: boolean;
  placement?: Placement;
  delay?: number;
  setOpen?: (open: boolean) => void;
  open?: boolean;
  fallbackAxisSideDirection?: "none" | "start" | "end";
}) {
  const [defaultOpen, setDefaultOpen] = useState(false);
  const tree = useFloatingTree();
  const nodeId = useFloatingNodeId();

  const isOpen = open ?? defaultOpen;

  const setIsOpen = (open: boolean) => {
    if (setOpen) {
      setOpen(open);
    } else {
      setDefaultOpen(open);
    }
  };

  const { refs, floatingStyles, context, isPositioned } = useFloating({
    nodeId,
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
      open: delay,
      close: 400,
    },
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

  useEffect(() => {
    if (isOpen) {
      tree?.nodesRef.current.forEach((node) => {
        if (node.id !== nodeId) {
          node.context?.onOpenChange(false);
        }
      });
    }
  }, [isOpen, nodeId, tree]);

  return (
    <FloatingNode id={nodeId}>
      <div ref={refs.setReference} {...getReferenceProps()}>
        {trigger}
      </div>

      <FloatingPortal>
        {isMounted && (
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              zIndex: 9999,
              ...styles,
            }}
            {...getFloatingProps()}
          >
            {children}
          </div>
        )}
      </FloatingPortal>
    </FloatingNode>
  );
}
