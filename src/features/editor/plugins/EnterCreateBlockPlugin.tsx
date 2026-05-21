"use client";

import { useEffect } from "react";
import {
  COMMAND_PRIORITY_HIGH,
  $getSelection,
  $isRangeSelection,
  KEY_ENTER_COMMAND,
  ElementNode,
  $isElementNode,
  $isTextNode,
  $getNodeByKey,
  $getRoot,
  $createParagraphNode,
  LexicalNode,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { blocksApi } from "../api/blocks.api";
import { IBlockCreate } from "../model/block.types";
import { $isBlockNode } from "../model/typeGuard";
import { pagesApi } from "@/entities/pages/api/pages.api";
import {
  getBlockIdFromNode,
  getOrderFromNode,
  setBlockIdForNode,
  setOrderForNode,
} from "../utils/nodeId";
import { $isListNode } from "@lexical/list";
import {
  $createCalloutParagraphNode,
  $isCalloutNode,
} from "../nodes/CalloutNode";
import { getParentContainerAndChildren } from "../utils/getParentContainerAndChildren";
import { isSelectionAtEndOfElement } from "../utils/isSelectionAtEndOfElement";
import { createNewBlockAfter } from "../utils/createNewBlockAfter";

function getCurrentBlock(node: LexicalNode): ElementNode | null {
  let current: LexicalNode | null = node;

  while (current !== null) {
    const parent: ElementNode | null = current.getParent();
    if (!parent) return null;

    // Если родитель — корень или контейнер, то current — это искомый блок
    if (
      parent.is($getRoot()) ||
      $isCalloutNode(parent) ||
      parent.isShadowRoot?.()
    ) {
      if ($isElementNode(current)) {
        return current;
      }
      return null;
    }

    current = parent;
  }

  return null;
}

export function EnterCreateBlockPlugin({
  pageId,
  projectId,
}: {
  pageId: string;
  projectId: string;
}) {
  const [editor] = useLexicalComposerContext();
  const queryClient = useQueryClient();

  const { mutateAsync: createBlocks } = useMutation({
    mutationFn: (data: IBlockCreate) =>
      blocksApi.createBlocks({ id: pageId, data }),
    onSettled: () => {
      queryClient.invalidateQueries(
        pagesApi.getByIdPage({
          id: pageId,
          projectId,
        }),
      );
    },
  });

  useEffect(() => {
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        if (
          typeof document !== "undefined" &&
          document.getElementById("typeahead-menu")
        ) {
          return false;
        }

        const selection = $getSelection();
        if (!$isRangeSelection(selection) || !selection.isCollapsed())
          return false;
        if (event?.shiftKey) return false;

        const anchorNode = selection.anchor.getNode();
        const currentBlock = getCurrentBlock(anchorNode);

        if (!currentBlock) return false;
        if (!isSelectionAtEndOfElement(currentBlock, selection)) return false;
        if ($isListNode(currentBlock)) return false;


        createNewBlockAfter(currentBlock, editor, createBlocks);

        event?.preventDefault();
        return true;
      },
      COMMAND_PRIORITY_HIGH,
    );
  }, [editor, createBlocks, pageId, projectId]);

  return null;
}
