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
import { DropdownMenuItemProps } from "@/shared/ui/dropdownMenu/DropdownMenuItem";

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
    </>
  );
}
