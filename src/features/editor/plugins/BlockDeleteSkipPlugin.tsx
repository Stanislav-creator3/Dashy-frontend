import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_HIGH,
  ElementNode,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
} from "lexical";
import { useEffect } from "react";

import { $isRootNode, LexicalNode } from "lexical";
import shouldProtectNode from "../utils/shouldProtectNode";

export function getTopLevelBlock(node: LexicalNode | null): ElementNode | null {
  if (!node) return null;

  let current: LexicalNode | null = node;

  while (current !== null) {
    const parent: ElementNode | null = current.getParent();

    if (parent === null || $isRootNode(parent)) {
      return current instanceof ElementNode ? current : parent;
    }

    current = parent;
  }

  return null;
}

export default function BlockDeleteSkipPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const removeDelete = editor.registerCommand(
      KEY_DELETE_COMMAND,
      () => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return false;

        const nodes = selection.getNodes();

        if (nodes.some(shouldProtectNode)) {
          return true;
        }

        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );

    const removeBackspace = editor.registerCommand(
      KEY_BACKSPACE_COMMAND,
      () => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return false;
        if (!selection.isCollapsed()) return false;

        const anchorNode = selection.anchor.getNode();
        const block = getTopLevelBlock(anchorNode);
        if (!block) return false;

        const prev = block.getPreviousSibling();

        if (shouldProtectNode(prev)) {
          if (block.getTextContent().length === 0) {
            block.remove();
            return true;
          }
        }

        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );

    return () => {
      removeDelete();
      removeBackspace();
    };
  }, [editor]);

  return null;
}
