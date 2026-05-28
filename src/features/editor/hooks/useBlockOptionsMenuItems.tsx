"use client";

import { LexicalEditor } from "lexical";
import { TextColorOptions } from "../components/BlockOptionsMenu/TextColorOptions";
import { hasSetBackgroundColor } from "../utils/hasSetBackgroundColo";

export function useBlockOptionsMenuItems({
  editor,
  nodeKey,
}: {
  editor: LexicalEditor;
  nodeKey: string | null;
}) {
  if (!nodeKey) return null;
  const items = [
    {
      id: "color",
      tooltip: "Цвет",
      visible: hasSetBackgroundColor(nodeKey, editor),
      render: () => <TextColorOptions editor={editor} />,
    },
  ];

  return items.filter((item) => item.visible);
}
