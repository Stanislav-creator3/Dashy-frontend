import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $isElementNode, LexicalNode } from "lexical";
import { useCallback, useEffect, useState } from "react";
import { useReset } from "../model/draggableStore";
import { $isBlockNode } from "../model/typeGuard";
import { $isCalloutNode } from "../nodes/CalloutNode";

export function useEditorKeys() {
  const [editor] = useLexicalComposerContext();
  const resetState = useReset();

  const getKeys = (node: LexicalNode, keys: string[]) => {
    if ($isBlockNode(node)) {
      keys.push(node.getKey());
    }

    if ($isElementNode(node)) {
      node.getChildren().forEach((child) => {
        getKeys(child, keys);
      });
    }
  };
  const getEditorKeys = useCallback(() => {
    return editor.getEditorState().read(() => {
      const keys: string[] = [];

      $getRoot()
        .getChildren()
        .forEach((node) => {
          getKeys(node, keys);
        });

      return keys;
    });
  }, [editor]);

  const [keys, setKeys] = useState<string[]>(getEditorKeys());
  useEffect(() => {
    return editor.registerUpdateListener(() => {
      setKeys(getEditorKeys());
      resetState();
    });
  }, [editor, getEditorKeys, resetState]);

  return { keys };
}
