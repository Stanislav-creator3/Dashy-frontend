"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { DraggableElement } from "../components/dnd/DraggableElement";
import { OnDragLine } from "../components/dnd/OnDragLine";
import { useDragListeners } from "../hooks/useDragListeners";
import { DRAGGABLE_WRAPPER_ID } from "../components/DraggableWrapper";
import { createPortal } from "react-dom";
import { useOnDrop } from "../hooks/useOnDrop";

export function DndPlugin({pageId, projectId} : {pageId: string, projectId: string}) {
  const [editor] = useLexicalComposerContext();

  useDragListeners();
  useOnDrop({pageId, projectId});

  const isEditable = editor.isEditable();

  const wrapperHtmlElement = document.getElementById(DRAGGABLE_WRAPPER_ID);

  if (!isEditable || !wrapperHtmlElement) return null;

  return createPortal(
    <>
      <DraggableElement />
      <OnDragLine />
    </>,
    wrapperHtmlElement,
  );
}


