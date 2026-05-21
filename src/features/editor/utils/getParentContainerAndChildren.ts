import {
  $getRoot,
  $isElementNode,
  ElementNode,
  LexicalNode,
} from "lexical";

export function getParentContainerAndChildren(
  block: ElementNode,
): { parentContainer: ElementNode; children: LexicalNode[] } | null {
  const parent = block.getParent();
  if (!parent) return null;

  if (parent.is($getRoot())) {
    return {
      parentContainer: parent,
      children: parent.getChildren(),
    };
  }

  if ($isElementNode(parent)) {
    return {
      parentContainer: parent,
      children: parent.getChildren(),
    };
  }

  return null;
}
