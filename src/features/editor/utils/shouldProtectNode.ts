import { LexicalNode } from "lexical";
import { LinkPageNode } from "../nodes/LinkPage";

export default function shouldProtectNode(node: LexicalNode | null): boolean {
  if (!node) return false;

  if (node instanceof LinkPageNode) {
    return true;
  }
  return false;
}
