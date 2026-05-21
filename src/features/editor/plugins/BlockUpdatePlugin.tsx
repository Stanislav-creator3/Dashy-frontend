// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
// import { $getNodeByKey, type LexicalNode } from "lexical";
// import { useEffect, useRef } from "react";
// import { IBlock } from "../model/block.types";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { blocksApi } from "../api/blocks.api";
// import useDebounce from "@/shared/hooks/useDebounce";
// import { pagesApi } from "@/entities/pages/api/pages.api";
// import { serializeBlock } from "../model/blockSerializer";
// import { $isBlockNode } from "../model/typeGuard";
// import { CustomTextNode } from "../nodes/CustomTextNode";

// function getOwningBlock(node: LexicalNode | null): LexicalNode | null {
//   let current = node;

//   while (current !== null) {
//     if ($isBlockNode(current)) {
//       return current;
//     }
//     current = current.getParent();
//   }

//   return null;
// }

// function addPendingBlock(node: LexicalNode | null, keys: Set<string>) {
//   if (!node) return;

//   const block = getOwningBlock(node);
//   if (block !== null) {
//     keys.add(block.getKey());
//   }
// }

// export function BlocksUpdatePlugin({
//   pageId,
//   debounceMs = 400,
//   projectId,
// }: {
//   pageId: string;
//   debounceMs?: number;
//   projectId: string;
// }) {
//   const queryClient = useQueryClient();
//   const [editor] = useLexicalComposerContext();

//   const { mutate: UpdateBlock, isSuccess } = useMutation({
//     mutationFn: blocksApi.updateBlocks,
//     onSettled: () => {
//       queryClient.invalidateQueries(
//         pagesApi.getByIdPage({
//           id: pageId,
//           projectId,
//         }),
//       );
//     },
//   });

//   const pendingKeysRef = useRef<Set<string>>(new Set());

//   const flushUpdate = useDebounce(() => {
//     const blocks: IBlock[] = [];

//     editor.getEditorState().read(() => {
//       pendingKeysRef.current.forEach((key) => {
//         const node = $getNodeByKey(key);
//         if (!node) return;
//         const data = serializeBlock(node);
//         if (!data) return;

//         blocks.push(data);
//       });
//     });

//     console.log(blocks);
//     pendingKeysRef.current.clear();

//     // if (blocks.length > 0) {
//     //   UpdateBlock({ body: blocks });
//     // }
//   }, debounceMs);

//   useEffect(() => {
//     return editor.registerUpdateListener(
//       ({ editorState, prevEditorState, dirtyElements, dirtyLeaves, tags }) => {
//         if (tags.has("from-backend")) return;

//         const candidateKeys = new Set<string>();

//         editorState.read(() => {
//           dirtyLeaves.forEach((isDirty, key) => {
//             if (!isDirty) return;

//             const node = $getNodeByKey(key);
//             const block = node?.getParent();
//             addPendingBlock(block, pendingKeysRef.current);
//           });

//           dirtyElements.forEach((isDirty, elementKey) => {
//             if (!isDirty) return;

//             const element = $getNodeByKey(elementKey);
//             addPendingBlock(element, pendingKeysRef.current);
//           });
//         });

//         flushUpdate();
//       },
//     );
//   }, [editor, flushUpdate]);

//   return null;
// }

"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getNodeByKey,
  $getRoot,
  $isElementNode,
  RootNode,
  type ElementNode,
  type LexicalNode,
} from "lexical";
import { useEffect, useRef } from "react";
import useDebounce from "@/shared/hooks/useDebounce";
import { serializeBlock } from "../model/blockSerializer";
import type { IBlock } from "../model/block.types";
import {
  getBlockIdFromNode,
  getBlockTempIdFromNode,
  setBlockIdForNode,
} from "../utils/nodeId";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { blocksApi } from "../api/blocks.api";
import { pagesApi } from "@/entities/pages/api/pages.api";
import { $isBlockNode } from "../model/typeGuard";

function getCurrentBlock(node: LexicalNode | null): ElementNode | null {
  let current: LexicalNode | null = node;

  while (current !== null) {
    const parent = current.getParent();
    if (!parent) return null;

    if (
      (parent.is($getRoot()) || parent.isShadowRoot?.()) &&
      $isElementNode(current)
    ) {
      return getBlockIdFromNode(current) || getBlockTempIdFromNode(current)
        ? current
        : null;
    }

    current = parent;
  }

  return null;
}

function areBlocksEqual(a: IBlock | null, b: IBlock | null): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return JSON.stringify(a) === JSON.stringify(b);
}

function replacementIdsFromBackend(
  node: LexicalNode,
  ids: Map<string, string>,
) {
  const tempId = getBlockTempIdFromNode(node);

  if (tempId) {
    const realId = ids.get(tempId);

    if (realId) {
      setBlockIdForNode(node, realId);
    }
  }

  if ($isElementNode(node)) {
    node.getChildren().forEach((child) => {
      replacementIdsFromBackend(child, ids);
    });
  }
}

export function BlocksUpdatePlugin({
  debounceMs = 400,
  pageId,
  projectId,
}: {
  debounceMs?: number;
  pageId: string;
  projectId: string;
}) {
  const [editor] = useLexicalComposerContext();

  const queryClient = useQueryClient();

  const { mutate: UpdateBlock, isSuccess } = useMutation({
    mutationFn: blocksApi.updateBlocks,
    onSuccess: ({ created }) => {
      const ids = new Map(created.map((item) => [item.tempId, item.id]));
      editor.update(() => {
        const root = $getRoot();
        root.getChildren().forEach(
          (node) => {
            replacementIdsFromBackend(node, ids);
          },
          { tag: "from-backend", discrete: true },
        );
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(
        pagesApi.getByIdPage({
          id: pageId,
          projectId,
        }),
      );
    },
  });
  const pendingKeysRef = useRef<Set<string>>(new Set());

  const flushUpdate = useDebounce(() => {
    const blocks: IBlock[] = [];

    editor.getEditorState().read(() => {
      pendingKeysRef.current.forEach((key) => {
        const node = $getNodeByKey(key);
        if (!node) return;
        const data = serializeBlock(node);
        if (!data) return;

        blocks.push(data);
      });
    });

    pendingKeysRef.current.clear();

    if (blocks.length > 0) {
      UpdateBlock({ blocks: blocks, pageId: pageId });
    }
  }, debounceMs);

  useEffect(() => {
    return editor.registerUpdateListener(
      ({ editorState, prevEditorState, dirtyElements, dirtyLeaves, tags }) => {
        if (tags.has("from-backend")) return;

        const candidateKeys = new Set<string>();

        editorState.read(() => {
          dirtyLeaves.forEach((leafKey) => {
            const node = $getNodeByKey(leafKey);
            const block = getCurrentBlock(node);
            if (!block) return;
            candidateKeys.add(block.getKey());
          });

          dirtyElements.forEach((isDirty, elementKey) => {
            if (!isDirty) return;

            const node = $getNodeByKey(elementKey);
            const block = getCurrentBlock(node);
            if (!block) return;
            candidateKeys.add(block.getKey());
          });
        });

        if (candidateKeys.size === 0) return;

        const nextBlocks = new Map<string, IBlock | null>();
        const prevBlocks = new Map<string, IBlock | null>();

        editorState.read(() => {
          candidateKeys.forEach((key) => {
            const node = $getNodeByKey(key);
            if (!node) return null;
            nextBlocks.set(key, serializeBlock(node));
          });
        });

        prevEditorState.read(() => {
          candidateKeys.forEach((key) => {
            const node = $getNodeByKey(key);
            if (!node) return null;
            prevBlocks.set(key, serializeBlock(node));
          });
        });

        candidateKeys.forEach((key) => {
          const next = nextBlocks.get(key) ?? null;
          const prev = prevBlocks.get(key) ?? null;

          if (!areBlocksEqual(next, prev)) {
            pendingKeysRef.current.add(key);
          }
        });

        flushUpdate();
      },
    );
  }, [editor, flushUpdate]);

  return null;
}
