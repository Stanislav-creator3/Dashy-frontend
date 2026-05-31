import {
  $getNodeByKey,
  $isRootNode,
  ElementNode,
  LexicalEditor,
} from "lexical";
import { getParentContainerAndChildren } from "./getParentContainerAndChildren";
import { IBlockCreate } from "../model/block.types";
import { calculateOrder } from "./calculateOrder";
import {
  getBlockIdFromNode,
  setBlockIdForNode,
  setOrderForNode,
} from "./nodeId";
import { $isBlockNode } from "../model/typeGuard";
import { setBlockTempId } from "../model/blockState";
import { $createCustomParagraphNode } from "../nodes/CustomParagraphNode";

function genId(parentId?: string) {
  const suffix = globalThis.crypto?.randomUUID?.() ?? String(Date.now());

  if (parentId) {
    return `${parentId}:content:${suffix}`;
  }

  return `temp-${suffix}`;
}

export function createNewBlockAfter(
  currentBlock: ElementNode,
  editor: LexicalEditor,
  createBlocks: (data: IBlockCreate) => Promise<any>,
) {
  const context = getParentContainerAndChildren(currentBlock);
  if (!context) return;
  const { parentContainer, children } = context;
  const currentChild = children.find((node) => node.is(currentBlock));

  const order = calculateOrder(
    currentBlock,
    currentChild?.getNextSibling() ?? null,
  );

  let parentId: string | undefined;
  if (!$isRootNode(parentContainer)) {
    parentId = getBlockIdFromNode(parentContainer) ?? undefined;
  }

  const tempId = genId(parentId);

  const newParagraph = $createCustomParagraphNode();
  setOrderForNode(newParagraph, order);
  setBlockTempId(newParagraph, tempId);
  const nodeKey = newParagraph.getKey();

  currentBlock.insertAfter(newParagraph);
  newParagraph.select();

  createBlocks({
    tempId,
    content: [],
    type: "Paragraph",
    order,
    parentId,
  })
    .then((response) => {
      editor.update(
        () => {
          const node = $getNodeByKey(nodeKey);
          if (node && $isBlockNode(node)) {
            setBlockIdForNode(node, response.id);
          }
        },
        { tag: "from-backend", discrete: true },
      );
    })
    .catch((error) => {
      console.error("Ошибка создания блока:", error);
    });

  editor.focus();
}
