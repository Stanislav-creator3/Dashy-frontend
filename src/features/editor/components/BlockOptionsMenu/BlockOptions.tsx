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
import { DropdownMenu } from "@/shared/ui";

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

  return (
    <>
      {items && items.length > 0 && (
        <DropdownMenu
          placement="left"
          enabledClick
          onOpenChange={setOpen}
          trigger={trigger}
          items={items}
        />
      )}

      {/* <FloatingPortal>
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
      </FloatingPortal> */}
    </>
  );
}
