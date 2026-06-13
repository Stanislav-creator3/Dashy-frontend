import { LexicalNode } from "lexical";
import { $isCustomHeadingNode } from "../nodes/CustomHeadingNode";
import { $isListItemNode } from "@lexical/list";
import { $isCustomParagraphNode } from "../nodes/CustomParagraphNode";

export const getPlaceholderText = (node: LexicalNode): string | null => {
  if ($isCustomHeadingNode(node)) {
    const level = Number(node.getTag().slice(1));
    return `Заголовок ${level}`;
  }

  if ($isListItemNode(node)) {
    return `Список`;
  }
  if ($isCustomParagraphNode(node)) {
    return `Наберите "/" для вставки`;
  }
  return null;
};
