"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  FloatingMenuCoords,
  FloatingMenuEditor,
} from "../components/FloatingMenuEditor";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { createPortal } from "react-dom";
import { usePointerInteractions } from "../hooks/usePointerInteractions";
import { $getSelection, $isRangeSelection } from "lexical";
import { computePositionInContainer } from "../utils/computePositionInContainer";

export function FloatingMenuPlugin() {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const [coords, setCoords] = useState<FloatingMenuCoords>(undefined);
  const [editor] = useLexicalComposerContext();
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const el = document.getElementById("editor-root");
    if (el) {
      containerRef.current = el;
      setPortalElement(el);
    }
  }, []);

  const { isPointerDown, isPointerReleased } = usePointerInteractions();

  const calculatePosition = useCallback(() => {
    const domSelection = getSelection();
    const domRange =
      domSelection?.rangeCount !== 0 && domSelection?.getRangeAt(0);

    if (!domRange || !ref.current || isPointerDown || !containerRef.current)
      return setCoords(undefined);

    const pos = computePositionInContainer(
      domRange,
      ref.current,
      containerRef.current
    );
    setCoords(pos);
  }, [isPointerDown]);

  const $handleSelectionChange = useCallback(() => {
    if (
      editor.isComposing() ||
      editor.getRootElement() !== document.activeElement
    ) {
      setCoords(undefined);
      return;
    }

    const selection = $getSelection();

    if ($isRangeSelection(selection) && !selection.anchor.is(selection.focus)) {
      calculatePosition();
    } else {
      setCoords(undefined);
    }
  }, [editor, calculatePosition]);

  useEffect(() => {
    const unregisterListener = editor.registerUpdateListener(
      ({ editorState }) => {
        editorState.read(() => $handleSelectionChange());
      }
    );
    return unregisterListener;
  }, [editor, $handleSelectionChange]);

  const show = coords !== undefined;

  useEffect(() => {
    if (!show && isPointerReleased) {
      editor.getEditorState().read(() => $handleSelectionChange());
    }
  }, [isPointerReleased, $handleSelectionChange, editor]);

  useEffect(() => {
    if (!coords) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current) return;

      if (!ref.current.contains(e.target as Node)) {
        setCoords(undefined);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [coords]);

  if (!portalElement) return null;

  return createPortal(
    <FloatingMenuEditor ref={ref} editor={editor} coords={coords} />,
    portalElement
  );
}
