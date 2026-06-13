"use client";

import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { setNodePlaceholderFromSelection } from "../utils/setNodePlaceholderFromSelection";

export function BlockPlaceholderPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      setNodePlaceholderFromSelection(editor);
    });
  }, [editor]);

  return null;
}
