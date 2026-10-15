"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { DraggableElement } from "../components/dnd/DraggableElement";
import { OnDragLine } from "../components/dnd/OnDragLine";
import { useDragListeners } from "../hooks/useDragListeners";
import {
  DRAGGABLE_WRAPPER_ID,
  DRAGGABLE_WRAPPER_SELECTOR,
} from "../components/DraggableWrapper";
import { createPortal } from "react-dom";
import { useOnDrop } from "../hooks/useOnDrop";
import { useEffect, useState } from "react";

export function DndPlugin({
  pageId,
  projectId,
}: {
  pageId: string;
  projectId: string;
}) {
  const [editor] = useLexicalComposerContext();
  const [wrapper, setWrapper] = useState<HTMLElement | null>(null);

  useDragListeners();
  useOnDrop({ pageId, projectId });

  const isEditable = editor.isEditable();

  useEffect(() => {
    return editor.registerRootListener((root) => {
      setWrapper(
        root?.closest<HTMLElement>(DRAGGABLE_WRAPPER_SELECTOR) ?? null,
      );
    });
  }, [editor]);

  if (!isEditable || !wrapper) return null;

  return createPortal(
    <>
      <DraggableElement />
      <OnDragLine />
    </>,
    wrapper,
  );
}
