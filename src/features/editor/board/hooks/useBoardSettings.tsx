import { useState } from "react";
import { ColorBoard } from "../ui/ColorBoard";
import { LexicalEditor } from "lexical";

export function useBoardSettings({
  editor,
  nodeKey,
}: {
  editor: LexicalEditor;
  nodeKey: string;
}) {
  const items = [
    {
      id: "colorColumn",
      label: "Цвет колонок",
      children: [
        {
          id: "colorColumn",
          label: <ColorBoard />,
          onClick: () => {},
        },
      ],
    },
  ];

  return { items };
}

//  onClick?: () => void;
//   href?: string;
//   label: React.ReactNode;
//   children?: DropdownMenuItemProps[];
