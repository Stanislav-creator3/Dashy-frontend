"use client";

import { useEffect } from "react";
import {
  COMMAND_PRIORITY_HIGH,
  $getNodeByKey,
  $getRoot,
  LexicalCommand,
  createCommand,
  CLICK_COMMAND,
  $isParagraphNode,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { blocksApi } from "../api/blocks.api";
import { IBlockCreate } from "../model/block.types";
import { $isBlockNode } from "../model/typeGuard";
import { pagesApi } from "@/entities/pages/api/pages.api";
import {
  getOrderFromNode,
  setBlockIdForNode,
  setOrderForNode,
} from "../utils/nodeId";
import { setBlockTempId } from "../model/blockState";
import {
  $createCustomParagraphNode,
  $isCustomParagraphNode,
} from "../nodes/CustomParagraphNode";

const genId = () =>
  `temp-${globalThis.crypto?.randomUUID?.() ?? String(Date.now())}`;

export const CLICK_CREATE_COMMAND: LexicalCommand<string> = createCommand(
  "CLICK_CREATE_COMMAND",
);

export function CreateOnClickPlugin({
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
    return editor.registerCommand<MouseEvent>(
      CLICK_COMMAND,
      (event) => {
        const clickY = event.clientY;

        editor.update(() => {
          const root = $getRoot();
          const lastNode = root.getLastChild();
          if (!lastNode) return;
          const lastDom = editor.getElementByKey(lastNode.getKey());
          if (!lastDom) return;
          const lastRect = lastDom.getBoundingClientRect();

          if (clickY > lastRect.bottom) {
            if (
              $isCustomParagraphNode(lastNode) &&
              lastNode.getTextContent() === ""
            ) {
              lastNode.select();
            } else {
              let order = 1;
              const tempId = genId();
              let nodeKey;
              if ($isBlockNode(lastNode)) {
                order = (getOrderFromNode(lastNode) ?? 0) + 1;
              }
              const paragraph = $createCustomParagraphNode();
              setOrderForNode(paragraph, order);
              setBlockTempId(paragraph, tempId);
              nodeKey = paragraph.getKey();
              root.append(paragraph);
              paragraph.select();

              createBlocks({
                tempId,
                content: [],
                type: "Paragraph",
                order: order,
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
            }
            return true;
          }
          return false;
        });

        return false;
      },
      COMMAND_PRIORITY_HIGH,
    );
  }, [editor, pageId, projectId]);
  return null;
}
