import { LexicalNode } from "lexical";
import {
  getBlockIdFromNode,
  getBlockTempIdFromNode,
  getOrderFromNode,
} from "../utils/nodeId";

export function $isBlockNode(node: LexicalNode | null): node is LexicalNode {
  if (node === null) return false;

  const id = getBlockIdFromNode(node);
  const tempId = getBlockTempIdFromNode(node);
  const order = getOrderFromNode(node);

  return (Boolean(id) || Boolean(tempId)) && order != null;
}
