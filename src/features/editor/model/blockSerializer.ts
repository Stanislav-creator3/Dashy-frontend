import { $isHeadingNode, $isQuoteNode } from "@lexical/rich-text";
import {
  $createLineBreakNode,
  $isElementNode,
  $isLineBreakNode,
  $isTextNode,
  ElementNode,
  IS_BOLD,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_UNDERLINE,
  LexicalNode,
} from "lexical";

import { IBlock, ITextSegment } from "./block.types";
import {
  getBlockIdFromNode,
  getBlockTempIdFromNode,
  getOrderFromNode,
} from "../utils/nodeId";
import {
  $createCustomTextNode,
  $isCustomTextNode,
} from "../nodes/CustomTextNode";
import { $isListItemNode, $isListNode } from "@lexical/list";
import { $isCalloutNode } from "../nodes/CalloutNode";
import { $isBlockNode } from "./typeGuard";
import { $isCustomParagraphNode } from "../nodes/CustomParagraphNode";
import { $isCustomHeadingNode } from "../nodes/CustomHeadingNode";

export function $createTextNodeFromSegment(segment: ITextSegment) {
  const textNode = $createCustomTextNode(
    segment.text,
    segment.color,
    segment.backgroundColor,
  );

  let format = 0;
  if (segment.bold) format |= IS_BOLD;
  if (segment.italic) format |= IS_ITALIC;
  if (segment.strikethrough) format |= IS_STRIKETHROUGH;
  if (segment.underline) format |= IS_UNDERLINE;

  if (format) textNode.setFormat(format);

  return textNode;
}

export function appendTextSegments(
  node: ElementNode,
  segments: ITextSegment[],
) {
  for (const segment of segments) {
    const textParts = segment.text.split("\n");

    textParts.forEach((text, index) => {
      if (index > 0) {
        node.append($createLineBreakNode());
      }

      if (text.length > 0) {
        node.append(
          $createTextNodeFromSegment({
            ...segment,
            text,
          }),
        );
      }
    });
  }
}

function appendSerializedTextSegment(
  segments: ITextSegment[],
  node: LexicalNode,
): void {
  if ($isCustomTextNode(node)) {
    segments.push(node.getData());
    return;
  }

  if ($isTextNode(node)) {
    segments.push({
      text: node.getTextContent(),
      bold: node.hasFormat("bold"),
      italic: node.hasFormat("italic"),
      strikethrough: node.hasFormat("strikethrough"),
      underline: node.hasFormat("underline"),
    });
    return;
  }

  if ($isLineBreakNode(node)) {
    segments.push({
      text: "\n",
    });
    return;
  }

  if ($isElementNode(node)) {
    node
      .getChildren()
      .forEach((child) => appendSerializedTextSegment(segments, child));
  }
}

function serializeTextChildren(node: ElementNode): ITextSegment[] {
  const segments: ITextSegment[] = [];

  for (const child of node.getChildren()) {
    appendSerializedTextSegment(segments, child);
  }

  return segments;
}

function getParentBlockId(node: LexicalNode): string | null {
  const parent = node.getParent();

  if (!parent || !$isElementNode(parent)) {
    return null;
  }

  return $isBlockNode(parent) ? getBlockIdFromNode(parent) : null;
}

export function serializeBlock(node: LexicalNode): IBlock | null {
  if (!$isElementNode(node)) return null;

  const id = getBlockIdFromNode(node);
  const tempId = getBlockTempIdFromNode(node) ?? id;
  if (!tempId) return null;

  const order = getOrderFromNode(node) ?? undefined;

  const parentId = getParentBlockId(node);

  if ($isCustomParagraphNode(node)) {
    return {
      id,
      order,
      tempId,
      type: "Paragraph",
      parentId,
      content: serializeTextChildren(node),
      props: {
        backgroundColor: node.getBackgroundColor(),
      },
    };
  }

  if ($isCustomHeadingNode(node)) {
    return {
      id,
      tempId,
      order,
      type: "Heading",
      parentId,
      content: serializeTextChildren(node),
      props: {
        level: Number(node.getTag().slice(1)),
        backgroundColor: node.getBackgroundColor(),
      },
    };
  }

  if ($isListNode(node) && node.getListType() === "bullet") {
    if (node.getListType() !== "bullet") return null;

    return {
      id,
      order,
      parentId,
      tempId,
      type: "Bullet",
      content: node.getChildren().flatMap((child) => {
        if (!$isListItemNode(child)) return [];

        return [
          {
            content: serializeTextChildren(child),
            indent: child.getIndent(),
          },
        ];
      }),
      props: {},
    };
  }

  if ($isListNode(node) && node.getListType() === "number") {
    return {
      id,
      order,
      parentId,
      tempId,
      type: "ListNumber",
      content: node.getChildren().flatMap((child) => {
        if (!$isListItemNode(child)) return [];

        return [
          {
            content: serializeTextChildren(child),
            indent: child.getIndent(),
          },
        ];
      }),
      props: {},
    };
  }

  if ($isListNode(node) && node.getListType() === "check") {
    return {
      id,
      order,
      parentId,
      tempId,
      type: "TodoList",
      content: node.getChildren().flatMap((child) => {
        if (!$isListItemNode(child)) return [];

        return [
          {
            content: serializeTextChildren(child),
            checked: child.getChecked(),
            indent: child.getIndent(),
          },
        ];
      }),
      props: {},
    };
  }

  if ($isQuoteNode(node)) {
    return {
      id,
      order,
      parentId,
      tempId,
      type: "Quote",
      content: serializeTextChildren(node),
      props: {},
    };
  }

  if ($isCalloutNode(node)) {
    return {
      id,
      order,
      parentId,
      tempId,
      type: "Callout",
      childrenFlag: true,
      props: {
        icon: node.getIcon(),
        backgroundColor: node.getBackgroundColor(),
      },
    };
  }

  return null;
}

export function serializeBlocks(nodes: LexicalNode[]): IBlock[] {
  return nodes
    .map((node) => serializeBlock(node))
    .filter((block): block is IBlock => block !== null);
}
