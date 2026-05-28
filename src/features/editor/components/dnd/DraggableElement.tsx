"use client";

import { useCallback, DragEvent as ReactDragEvent, useState } from "react";
import { useDraggableStore, useReset } from "../../model/draggableStore";
import { MdDragIndicator } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { Popover } from "@/shared/ui";
import { DRAGGABLE_KEY } from "../../hooks/useDragListeners";
import { $createNodeSelection, $getNodeByKey, $getSelection, $setSelection } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { BlockOptionsMenu } from "../BlockOptionsMenu/BlockOptions";
import { $isBlockNode } from "../../model/typeGuard";

export function DraggableElement() {
  const [editor] = useLexicalComposerContext();
  const [blockElement, setBlockElement] = useState(null);

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const draggable = useDraggableStore();
  const reset = useReset();
  const handleOnDragStart = useCallback(
    ({ dataTransfer }: ReactDragEvent<HTMLDivElement>) => {
      if (!dataTransfer || !draggable?.htmlElement) {
        return;
      }

      dataTransfer.setDragImage(draggable.htmlElement, 0, 0);
    },
    [draggable?.htmlElement],
  );

  const activeDraggable = blockElement ?? draggable;

  const openPicker = useCallback(
    (open: boolean) => {
      if (!open) {
        setOptionsOpen(false);
        setBlockElement(null);
        return;
      }
      if (!draggable) return;
      setOptionsOpen(true);

      if (open && draggable) {
        setBlockElement(draggable);
      }
      const draggableElement = draggable?.htmlElement;
      const draggableKey = draggableElement?.getAttribute(DRAGGABLE_KEY);

      if (!draggableKey) {
        console.error("NO DRAGGABLE KEY");
        return false;
      }
      editor.update(() => {
        if (!draggable.htmlElement) return;
        const node = $getNodeByKey(draggableKey);
        if (!node) return
        if (!$isBlockNode(node)) return
        const selection = $createNodeSelection();
        selection.add(draggableKey);
        $setSelection(selection);

      });
    },
    [draggable, editor],
  );

  if (!activeDraggable?.data) {
    return null;
  }

  return (
    <div
      className="absolute flex items-center justify-between gap-1 transition-all duration-150"
      style={{
        top: activeDraggable.data.top,
        left: activeDraggable.data.left - 40,
        height: activeDraggable.data.height,
      }}
    >
      <Popover
        enabledClick={true}
        open={popoverOpen}
        setOpen={setPopoverOpen}
        trigger={
          <button
            // onClick={() => void}
            className="
       flex items-center justify-center
       p-1
       cursor-pointer
       bg-transparent
       rounded-sm
       transition-colors duration-150
       hover:bg-bg-hover
       w-6 h-6"
          >
            <FaPlus className="text-text" size={12} />
          </button>
        }
      >
        <p>test</p>
      </Popover>

      <BlockOptionsMenu
        nodeKey={activeDraggable?.htmlElement.getAttribute(DRAGGABLE_KEY)}
        open={optionsOpen}
        setOpen={openPicker}
        trigger={
          <div
            className="
       flex items-center justify-center
       w-6 h-6
       cursor-grab 
       rounded-sm
       transition-colors duration-150
       hover:bg-bg-hover"
            draggable={true}
            onDragStart={handleOnDragStart}
            onDragEnd={reset}
          >
            <span className="p-1">
              <MdDragIndicator
                className="text-black/40 dark:text-white"
                size={30}
              />
            </span>
          </div>
        }
      />
    </div>
  );
}
