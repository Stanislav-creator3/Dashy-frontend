import { $getSelection, $isRangeSelection } from "lexical";
import { $isCustomTextNode } from "../nodes/CustomTextNode";

export function getSelectionTextStyle(): {
  color?: string;
  backgroundColor?: string;
  isMixed?: boolean;
} {
  const selection = $getSelection();

  if (!$isRangeSelection(selection)) {
    return {
      color: undefined,
      backgroundColor: undefined,
    };
  }

  const nodes = selection.getNodes();

  const colors = new Set<string>();
  const backgrounds = new Set<string>();
  let color = undefined;
  let backgroundColor = undefined;
  let isMixed = false;

  if (nodes.length === 0) {
    return {
      color: undefined,
      backgroundColor: undefined,
    };
  }

  for (const node of nodes) {
    if ($isCustomTextNode(node)) {
      const color = node.getColor();
      const bg = node.getBackgroundColor();

      colors.add(color);
      backgrounds.add(bg);
    }
  }

  if (colors.size === 1 && backgrounds.size === 1) {
    color = [...colors][0];
    backgroundColor = [...backgrounds][0];
    isMixed = false;
  }

  if (colors.size > 1 || backgrounds.size > 1) {
    isMixed = true;
  }

  return {
    color: color,
    backgroundColor: backgroundColor,
    isMixed: isMixed,
  };
}
