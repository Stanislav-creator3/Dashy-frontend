"use client";

import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $isElementNode, ElementNode, LexicalNode } from "lexical";
import style from "../ui/BlockEditor.module.css";
import { $isListNode } from "@lexical/list";
import { $isCustomParagraphNode } from "../nodes/CustomParagraphNode";
import { $isCustomHeadingNode } from "../nodes/CustomHeadingNode";

function isEmptyBlock(node: LexicalNode): boolean {
  if (!$isElementNode(node)) return false;

  const textContent = node.getTextContent().trim();
  return textContent.length === 0;
}

function getPlaceholderText(node: LexicalNode): string {
  if ($isCustomHeadingNode(node)) {
    const level = Number(node.getTag().slice(1));
    return `Заголовок ${level}`;
  }

  if ($isListNode(node)) {
    return `Список`;
  }
  if ($isCustomParagraphNode(node)) {
    return `Наберите "/" для вставки`;
  }
  return `Наберите "/" для вставки`;
}

export function BlockPlaceholderPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const updatePlaceholders = () => {
      editor.getEditorState().read(() => {
        const root = $getRoot();
        const children = (root as ElementNode).getChildren();

        children.forEach((node) => {
          if (!$isElementNode(node)) return;

          const dom = editor.getElementByKey(node.getKey());
          if (!dom) return;

          const isEmpty = isEmptyBlock(node);
          const placeholderText = getPlaceholderText(node);

          if (isEmpty) {
            dom.setAttribute("data-placeholder", placeholderText);
            dom.classList.add(style.placeholder);
          } else {
            dom.removeAttribute("data-placeholder");
            dom.classList.remove(style.placeholder);
          }
        });
      });
    };

    updatePlaceholders();

    return editor.registerUpdateListener(() => {
      updatePlaceholders();
    });
  }, [editor]);

  return null;
}
