import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { $isCustomTextNode } from "../nodes/CustomTextNode";

export type TextStylePayload = {
  color?: string;
  backgroundColor?: string;
};

export const SET_TEXT_STYLE_COMMAND = createCommand("SET_TEXT_STYLE_COMMAND");

export function TextStylePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      SET_TEXT_STYLE_COMMAND,
      (payload: TextStylePayload) => {
        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;

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
        });

        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
