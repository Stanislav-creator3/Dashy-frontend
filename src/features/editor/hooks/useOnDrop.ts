import { useCallback, useContext, useEffect } from "react";
import { $getNodeByKey, COMMAND_PRIORITY_HIGH, DROP_COMMAND } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { DraggableContext, useDraggableContext } from "../model/draggableStore";
import { DRAGGABLE_KEY } from "./useDragListeners";
import { $isBlockNode } from "../model/typeGuard";
import { calculateOrder } from "../utils/calculateOrder";
import { useUpdateBlockOrder } from "./useUpdateBlockOrder";
import {
  getBlockIdFromNode,
  setOrderForNode,
  setParentBlockIdForNode,
} from "../utils/nodeId";

export const useOnDrop = ({
  pageId,
  projectId,
}: {
  pageId: string;
  projectId: string;
}) => {
  const [editor] = useLexicalComposerContext();
  const store = useContext(DraggableContext);
  if (!store) throw new Error("Missing DraggableContext.Provider in the tree");
  const { mutate } = useUpdateBlockOrder({ pageId, projectId });

  const handleOnDrop = useCallback(
    (dragEvent: DragEvent): boolean => {
      dragEvent.preventDefault();
      const { draggable, line } = store?.getState();

      const lineElement = line?.htmlElement;
      const position = line?.data.position;

      const closestToLineElementKey = lineElement?.getAttribute(DRAGGABLE_KEY);
      if (!closestToLineElementKey) {
        console.error("[ON DROP] no closestToLineElementKey");
        return false;
      }

      const draggableElement = draggable?.htmlElement;

      const draggableKey = draggableElement?.getAttribute(DRAGGABLE_KEY);
      if (!draggableKey) {
        console.error("NO DRAGGABLE KEY");
        return false;
      }

      const lineLexicalNode = $getNodeByKey(closestToLineElementKey);

      const draggableLexicalNode = $getNodeByKey(draggableKey);
      if (!draggableLexicalNode) {
        console.error("NO DRAGGABLE ELEMENT FOUND");
        return false;
      }

      if (!$isBlockNode(draggableLexicalNode) || !$isBlockNode(lineLexicalNode))
        return false;

      if (draggableLexicalNode.is(lineLexicalNode)) {
        return false;
      }

      const prev =
        position === "bottom"
          ? lineLexicalNode
          : lineLexicalNode.getPreviousSibling();
      const next =
        position === "bottom"
          ? lineLexicalNode.getNextSibling()
          : lineLexicalNode;

      const newOrder = calculateOrder(prev, next);

      if (position === "bottom") {
        lineLexicalNode?.insertAfter(draggableLexicalNode);
      } else {
        lineLexicalNode?.insertBefore(draggableLexicalNode);
      }

      const draggableBlockId = getBlockIdFromNode(draggableLexicalNode);
      if (!draggableBlockId) return false;

      setOrderForNode(draggableLexicalNode, newOrder);

      const parentId = getBlockIdFromNode(lineLexicalNode);
      if (parentId) {
        setParentBlockIdForNode(draggableLexicalNode, parentId);
      }

      mutate({
        body: [
          {
            id: draggableBlockId,
            order: newOrder,
            parentId: parentId,
          },
        ],
      });
      return true;
    },
    [store, mutate],
  );

  useEffect(() => {
    return editor.registerCommand(
      DROP_COMMAND,
      (event) => {
        return handleOnDrop(event);
      },
      COMMAND_PRIORITY_HIGH,
    );
  }, [editor, handleOnDrop]);

  return { handleOnDrop };
};
