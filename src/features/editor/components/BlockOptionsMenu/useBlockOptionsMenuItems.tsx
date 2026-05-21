"use client";

import { LexicalEditor, LexicalNode } from "lexical";
import { TextColorOptions } from "./TextColorOptions";

export function useBlockOptionsMenuItems({
  editor,
  nodeKey,
}: {
  editor: LexicalEditor;
  nodeKey: string | null;
}) {
  return [
    {
      id: "color",
      tooltip: "Цвет",
      render: () => <TextColorOptions editor={editor} nodeKey={nodeKey} />,
    },
  ];
}
