import { $getSelection, $isRangeSelection, $isTextNode, ElementNode } from "lexical";

export function isSelectionAtEndOfElement(
  element: ElementNode,
  selection: ReturnType<typeof $getSelection>
): boolean {
  if (!$isRangeSelection(selection) || !selection.isCollapsed()) return false;

  const anchorNode = selection.anchor.getNode();
  const lastDescendant = element.getLastDescendant();

  if ($isTextNode(lastDescendant)) {
    return (
      anchorNode.is(lastDescendant) &&
      selection.anchor.offset === lastDescendant.getTextContentSize()
    );
  }

  return anchorNode.is(element);
}