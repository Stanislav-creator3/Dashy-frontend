import { $createCodeNode } from "@lexical/code";
import { $createListItemNode, $createListNode } from "@lexical/list";
import {
  $createHeadingNode,
  $createQuoteNode,
  type HeadingTagType,
} from "@lexical/rich-text";
import { $createParagraphNode, type LexicalNode } from "lexical";
import { getIcon } from "@/shared/utils/getIcon";
import { renderIcon } from "@/shared/utils/renderIcon";
import { type IBlock } from "../model/block.types";
import { appendTextSegments } from "../model/blockSerializer";
import { $createCalloutNode } from "../nodes/CalloutNode";
import { $createLinkPageNode } from "../nodes/LinkPage";
import { setBlockIdForNode, setOrderForNode } from "./nodeId";
import { setBlockTempId, setParentBlockId } from "../model/blockState";

function applyBlockMeta<T extends LexicalNode>(node: T, block: IBlock): T {
  setBlockIdForNode(node, block.id);
  setOrderForNode(node, block.order ?? 1);
  setBlockTempId(node, block.tempId ?? null);
  setParentBlockId(node, block.parentId ?? null);

  return node;
}

export function buildBlockNode(block: IBlock, projectId: string): LexicalNode {
  switch (block.type) {
    case "Paragraph": {
      const node = applyBlockMeta($createParagraphNode(), block);
      appendTextSegments(node, block.content);
      return node;
    }

    case "Heading": {
      const level = Math.min(Math.max(block.props.level ?? 1, 1), 6);
      const node = applyBlockMeta(
        $createHeadingNode(`h${level}` as HeadingTagType),
        block,
      );
      appendTextSegments(node, block.content);
      return node;
    }

    case "Quote": {
      const node = applyBlockMeta($createQuoteNode(), block);
      appendTextSegments(node, block.content);
      return node;
    }

    case "Code": {
      const node = applyBlockMeta($createCodeNode(), block);
      appendTextSegments(node, block.content);
      return node;
    }

    case "Bullet": {
      const node = applyBlockMeta($createListNode("bullet"), block);

      for (const item of block.content) {
        const listItem = $createListItemNode();
        listItem.setIndent(item.indent ?? 0);
        appendTextSegments(listItem, item.content);
        node.append(listItem);
      }

      return node;
    }

    case "ListNumber": {
      const node = applyBlockMeta($createListNode("number"), block);

      for (const item of block.content) {
        const listItem = $createListItemNode();
        listItem.setIndent(item.indent ?? 0);
        appendTextSegments(listItem, item.content);
        node.append(listItem);
      }

      return node;
    }

    case "TodoList": {
      const node = applyBlockMeta($createListNode("check"), block);

      for (const item of block.content) {
        const listItem = $createListItemNode(item.checked ?? false);
        listItem.setIndent(item.indent ?? 0);
        appendTextSegments(listItem, item.content);
        node.append(listItem);
      }

      return node;
    }

    case "LinkPage": {
      const node = applyBlockMeta($createLinkPageNode(), block);
      const icon = block.content.icon ?? block.content.typePage;
      const typeIcon = getIcon(icon);

      node.setProps({
        href: `/projects/${projectId}/pages/${block.content.id}`,
        text: block.content.text,
        icon: renderIcon(typeIcon) ?? null,
        pageId: block.content.id,
        projectId,
        typePage: block.content.typePage,
      });

      return node;
    }

    case "Callout": {
      const node = applyBlockMeta($createCalloutNode(block.props.icon), block);
      node.setBackgroundColor(block.props.backgroundColor ?? "transparent");

      if (block.children.length > 0) {
        node.clear();

        for (const child of block.children) {
          node.append(buildBlockNode(child, projectId));
        }
      }

      return node;
    }
  }
}
