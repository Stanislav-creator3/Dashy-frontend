"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { FloatingMenuItem } from "./FloatingMenuEditorItem";
import { useMenuItemsFloating } from "../hooks/useMenuItemsFloating";

export type FloatingMenuCoords = { x: number; y: number } | undefined;

interface IMenuState {
  isBold: boolean;
  isCode: boolean;
  isItalic: boolean;
  isStrikethrough: boolean;
  isUnderline: boolean;
}

interface IMenuProps {
  editor: ReturnType<typeof useLexicalComposerContext>[0];
  coords: FloatingMenuCoords;
  ref: React.RefObject<HTMLDivElement | null>;
}

export function FloatingMenuEditor({ editor, coords, ref }: IMenuProps) {
  const shouldShow = !!coords

  const [state, setState] = useState<IMenuState>({
    isBold: false,
    isCode: false,
    isItalic: false,
    isStrikethrough: false,
    isUnderline: false,
  });

  const items = useMenuItemsFloating({ editor, state });

  useEffect(() => {
    const unregisterListener = editor.registerUpdateListener(
      ({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;

          setState({
            isBold: selection.hasFormat("bold"),
            isCode: selection.hasFormat("code"),
            isItalic: selection.hasFormat("italic"),
            isStrikethrough: selection.hasFormat("strikethrough"),
            isUnderline: selection.hasFormat("underline"),
          });
        });
      }
    );
    return unregisterListener;
  }, [editor]);

  return (
    <motion.div
      className="flex gap-3 items-center border-2 border-black shadow-2xl glass-panel rounded-md p-1"
      ref={ref}
      initial={false}
      animate={{
        opacity: shouldShow ? 1 : 0,
        y: shouldShow ? 0 : -20,
      }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      style={{
        position: "absolute",
        top: coords?.y ?? 0,
        left: coords?.x ?? 0,
        visibility: shouldShow ? "visible" : "hidden",
        pointerEvents: shouldShow ? "auto" : "none",
        zIndex: 5,
      }}
      aria-hidden={!shouldShow}
    >
      {
        items.map((item, index) => (
          <FloatingMenuItem
            key={item.id}
            index={index}
            isActive={item.isActive}
            shouldShow={shouldShow}
          >
            {item.render()}
          </FloatingMenuItem>
        ))
      }

    </motion.div>
  );
}
