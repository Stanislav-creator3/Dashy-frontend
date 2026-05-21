import type { ElementTransformer } from "@lexical/markdown";
import {
  $createListItemNode,
  $createListNode,
  $isListNode,
  ListItemNode,
  ListNode,
} from "@lexical/list";
import { ElementNode, LexicalNode } from "lexical";
import {
  getBlockIdFromNode,
  getBlockTempIdFromNode,
  getOrderFromNode,
  setBlockIdForNode,
  setOrderForNode,
  setBlockTempIdForNode,
} from "../utils/nodeId";

export const BULLET_CUSTOM: ElementTransformer = {
  type: "element",
  dependencies: [ListNode, ListItemNode],
  regExp: /^[-*+]\s/,
  replace: (
    parent: ElementNode,
    children: LexicalNode[],
    _match: string[],
    isImport: boolean,
  ) => {
    const list = $createListNode("bullet");
    const listItem = $createListItemNode();

    setBlockIdForNode(list, getBlockIdFromNode(parent));
    setBlockTempIdForNode(
      list,
      getBlockTempIdFromNode(parent) ?? getBlockIdFromNode(parent),
    );
    setOrderForNode(list, getOrderFromNode(parent));

    listItem.append(...children);
    list.append(listItem);
    parent.replace(list);

    if (!isImport) {
      listItem.selectEnd();
    }
  },
  export: (node, exportChildren) => {
    if (!$isListNode(node) || node.getListType() !== "bullet") return null;

    return `- ${exportChildren(node)}\n`;
  },
};
