"use client";

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
import { useBlockOptionsMenuItems } from "../../hooks/useBlockOptionsMenuItems";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { BlockOptionsMenuItem } from "./BlockOptionsMenuItem";
import { useState } from "react";
import { useNodeLabel } from "../../hooks/useNodeLabel";

export function BlockOptionsMenu({
  trigger,
  placement = "left",
  offsetValue = 10,
  setOpen,
  open,
  nodeKey,
}: {
  nodeKey: string | null;
  trigger: React.ReactNode;
  offsetValue?: number;
  placement?: Placement;
  setOpen: (open: boolean) => void;
  open?: boolean;
}) {
  const [editor] = useLexicalComposerContext();
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const items = useBlockOptionsMenuItems({ editor, nodeKey });
  const label = useNodeLabel(nodeKey);
  const { refs, floatingStyles, context } = useFloating({
    open: open,
    onOpenChange: setOpen,
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
        {trigger}
      </div>

      <FloatingPortal>
        {isMounted && (
          <FloatingOverlay className="z-10">
            <FloatingFocusManager context={context}>
              <div
                className="flex flex-col w-35 bg-background rounded-lg border-border border-1 shadow-2xl p-1"
                ref={refs.setFloating}
                style={{
                  ...floatingStyles,
                  zIndex: 10,
                  ...styles,
                }}
                {...getFloatingProps()}
              >
                {label && (
                  <div className="text-sm font-medium text-gray p-2">
                    {label}
                  </div>
                )}
                {items && items.map((item, index) => (
                  <BlockOptionsMenuItem
                    key={item.id}
                    isActive={activeItem === item.id}
                    setActiveItem={() => setActiveItem(item.id)}
                  >
                    {item.render()}
                  </BlockOptionsMenuItem>
                ))}
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </>
  );
}
