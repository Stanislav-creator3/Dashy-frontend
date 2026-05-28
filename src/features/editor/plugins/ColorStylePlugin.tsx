import {
  $getSelection,
  $isBlockElementNode,
  $isElementNode,
  $isNodeSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalNode,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { $isCustomTextNode } from "../nodes/CustomTextNode";
import { $hasSetBackgroundColor } from "../model/typeGuard";

export type ColorStylePayload = {
  color?: string;
  backgroundColor?: string;
};

export const SET_COLOR_STYLE_COMMAND = createCommand("SET_COLOR_STYLE_COMMAND");

function getChildren(node: LexicalNode): LexicalNode[] {
  if (!$isElementNode(node)) return [];

  const children = node.getChildren();

  return children.flatMap((child) => [
    child,
    ...getChildren(child),
  ]);
}

export function ColorStylePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      SET_COLOR_STYLE_COMMAND,
      (payload: ColorStylePayload) => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const extractedNodes = selection.extract();
            for (const node of extractedNodes) {
              if (!$isCustomTextNode(node)) continue;

              if (payload.color !== undefined) {
                node.setColor(payload.color);
              }

              if (payload.backgroundColor !== undefined) {
                node.setBackgroundColor(payload.backgroundColor);
              }
            }
          };

          if ($isNodeSelection(selection)) {
            const node = selection.getNodes()[0];
            if (!$isBlockElementNode(node)) return;
            if (payload.backgroundColor !== undefined && $hasSetBackgroundColor(node)) {
              node.setBackgroundColor(payload.backgroundColor);
            }

            if (payload.color !== undefined) {
              for (const child of getChildren(node)) {
                if (!$isCustomTextNode(child)) continue;
                child.setColor(payload.color)
              }
            }
          }
        });

        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
