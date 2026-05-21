import { LexicalNode } from "lexical";
import { $isBlockNode } from "../model/typeGuard";
import { getOrderFromNode } from "./nodeId";

export function calculateOrder(
  prev: LexicalNode | null,
  next: LexicalNode | null,
) {
  if (prev && next && $isBlockNode(prev) && $isBlockNode(next)) {
    return ((getOrderFromNode(prev) ?? 0) + (getOrderFromNode(next) ?? 0)) / 2;
  }

  if (!prev && next && $isBlockNode(next)) {
    return (getOrderFromNode(next) ?? 2) / 2;
  }

  if (prev && !next && $isBlockNode(prev)) {
    return (getOrderFromNode(prev) ?? 0) + 1;
  }

  return 1;
}
