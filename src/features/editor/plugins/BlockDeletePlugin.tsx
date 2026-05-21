"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $isElementNode, LexicalNode } from "lexical";
import { useEffect, useRef } from "react";
import { $isBlockNode } from "../model/typeGuard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { blocksApi } from "../api/blocks.api";
import useDebounce from "@/shared/hooks/useDebounce";
import { pagesApi } from "@/entities/pages/api/pages.api";
import { getBlockIdFromNode } from "../utils/nodeId";

function getBlockIds(node: LexicalNode, ids: Set<string>) {
  if ($isBlockNode(node)) {
    const id = getBlockIdFromNode(node);
    if (id) ids.add(id);
  }
  if ($isElementNode(node)) {
    node.getChildren().forEach((child) => getBlockIds(child, ids));
  }
}

export function BlockDeletePlugin({
  pageId,
  projectId,
  ms = 400,
}: {
  pageId: string;
  projectId: string;
  ms?: number;
}) {
  const queryClient = useQueryClient();
  const [editor] = useLexicalComposerContext();
  const prevIdsRef = useRef<Set<string>>(new Set());
  const deletedIdsRef = useRef<Set<string>>(new Set());

  const { mutate: mutateDelete } = useMutation({
    mutationFn: blocksApi.deleteBlocks,
    onSettled: () => {
      queryClient.invalidateQueries(
        pagesApi.getByIdPage({
          id: pageId,
          projectId,
        }),
      );
    },
  });

  const flushDelete = useDebounce(() => {
    const ids = Array.from(deletedIdsRef.current);
    if (ids.length > 0) {
      mutateDelete(ids);
      deletedIdsRef.current.clear();
    }
  }, ms);

  useEffect(() => {
    editor.getEditorState().read(() => {
      const ids = new Set<string>();
      $getRoot()
        .getChildren()
        .forEach((node) => {
          getBlockIds(node, ids);
        });
      prevIdsRef.current = ids;
    });
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState, tags }) => {
      if (tags.has("from-backend")) return;

      editorState.read(() => {
        const currentIds = new Set<string>();
        $getRoot()
          .getChildren()
          .forEach((node) => {
            getBlockIds(node, currentIds);
          });

        prevIdsRef.current.forEach((id) => {
          if (id.startsWith("temp-")) return;

          if (!currentIds.has(id)) deletedIdsRef.current.add(id);
        });

        prevIdsRef.current = currentIds;
      });

      flushDelete();
    });
  }, [editor, flushDelete]);

  return null;
}
