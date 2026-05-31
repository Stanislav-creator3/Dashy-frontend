import { $getRoot } from "lexical";
import { useEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { IBlock } from "../model/block.types";
import { setBlockOrder, setBlockTempId } from "../model/blockState";
import { buildBlockNode } from "../utils/buildBlockNode";
import { $createCustomParagraphNode } from "../nodes/CustomParagraphNode";

export function InitializeEditorPlugin({
  blocks,
  isLoading,
  projectId,
}: {
  blocks: IBlock[] | undefined;
  isLoading: boolean;
  projectId: string;
}) {
  const [editor] = useLexicalComposerContext();
  const initializedRef = useRef(false);
  useEffect(() => {
    if (isLoading || !blocks || initializedRef.current) return;

    initializedRef.current = true;

    editor.update(
      () => {
        const root = $getRoot();

        root.getChildren().forEach((child) => child.remove());

        for (const block of blocks) {
          const node = buildBlockNode(block, projectId);

          if (node) root.append(node);
        }

        // защита
        if (root.getChildrenSize() === 0) {
          const tempId = `temp-${crypto.randomUUID()}`;
          const p = $createCustomParagraphNode();
          setBlockOrder(p, 1);
          setBlockTempId(p, tempId);
          root.append(p);
          p.select();
        }
      },
      { tag: "from-backend" },
    );
  }, [editor, blocks]);

  return null;
}
