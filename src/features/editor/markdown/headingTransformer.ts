import type { ElementTransformer } from "@lexical/markdown";
import { $isTextNode, ElementNode, LexicalNode } from "lexical";
import {
  $createHeadingNode,
  $isHeadingNode,
  HeadingNode,
  type HeadingTagType,
} from "@lexical/rich-text";
import {
  getBlockIdFromNode,
  getBlockTempIdFromNode,
  getOrderFromNode,
  setBlockIdForNode,
  setOrderForNode,
  setBlockTempIdForNode,
} from "../utils/nodeId";

export const HEADING_CUSTOM: ElementTransformer = {
  type: "element",
  dependencies: [HeadingNode],
  regExp: /^(#{1,6})\s/,
  replace: (
    parent: ElementNode,
    children: LexicalNode[],
    match: string[],
    _isImport: boolean
  ) => {
    const hashes = match[1];
    const level = Math.min(6, hashes.length);
    const existingId = getBlockIdFromNode(parent);
    const tempId = getBlockTempIdFromNode(parent) ?? existingId;
    const order = getOrderFromNode(parent);

    const heading = $createHeadingNode(`h${level}` as HeadingTagType);
    setBlockIdForNode(heading, existingId);
    setBlockTempIdForNode(heading, tempId);
    setOrderForNode(heading, order);

    const first = children[0];
    if ($isTextNode(first)) {
      const text = first.getTextContent();
      const after = text.slice(match[0].length);
      if (after.length > 0) first.setTextContent(after);
      else first.remove();
    }

    children.forEach((child) => heading.append(child));

    parent.replace(heading);

    heading.selectEnd();
  },
  export: (node, exportChildren) => {
    if ($isHeadingNode(node)) {
      const level = Number(node.getTag().slice(1));
      const content = exportChildren(node);
      return `${"#".repeat(level)} ${content}\n`;
    }
    return null;
  },
};
