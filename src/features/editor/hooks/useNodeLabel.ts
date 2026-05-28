"use client";

import { $isCodeNode } from "@lexical/code";
import { $isListNode } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isHeadingNode, $isQuoteNode } from "@lexical/rich-text";
import { $getNodeByKey, $isParagraphNode, LexicalNode } from "lexical";
import { $isCalloutNode } from "../nodes/CalloutNode";
import { $isLinkPageNode } from "../nodes/LinkPage";

function getNodeLabel(node: LexicalNode) {
  if ($isHeadingNode(node)) return "Заголовок";
  if ($isParagraphNode(node)) return "Текст";
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
