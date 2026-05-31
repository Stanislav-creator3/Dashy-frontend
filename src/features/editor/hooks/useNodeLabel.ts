"use client";

import { $isCodeNode } from "@lexical/code";
import { $isListNode } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isHeadingNode, $isQuoteNode } from "@lexical/rich-text";
import { $getNodeByKey, LexicalNode } from "lexical";
import { $isCalloutNode } from "../nodes/CalloutNode";
import { $isLinkPageNode } from "../nodes/LinkPage";
import { $isCustomParagraphNode } from "../nodes/CustomParagraphNode";
import { $isCustomHeadingNode } from "../nodes/CustomHeadingNode";

function getNodeLabel(node: LexicalNode) {
  if ($isCustomHeadingNode(node)) {
    const tag = node.getTag();
    if (tag === "h1") return "Заголовок 1";
    if (tag === "h2") return "Заголовок 2";
    if (tag === "h3") return "Заголовок 3";
  }
  if ($isCustomParagraphNode(node)) return "Текст";
  if ($isQuoteNode(node)) return "Цитата";
  if ($isCodeNode(node)) return "Код";
  if ($isCalloutNode(node)) return "Выноска";
  if ($isLinkPageNode(node)) return "Страница";

  if ($isListNode(node)) {
    const listType = node.getListType();

    if (listType === "bullet") return "Список";
    if (listType === "number") return "Нумерованный список";
    if (listType === "check") return "Todo";
  }

  return node.getType();
}

export function useNodeLabel(nodeKey: string | null) {
  const [editor] = useLexicalComposerContext();

  return editor.getEditorState().read(() => {
    if (!nodeKey) return null;
    const node = $getNodeByKey(nodeKey);

    if (!node) return null;
    return getNodeLabel(node);
  });
}
