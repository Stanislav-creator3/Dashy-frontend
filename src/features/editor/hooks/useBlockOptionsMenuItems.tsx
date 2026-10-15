"use client";

import { $getNodeByKey, $isElementNode, LexicalEditor } from "lexical";
import { hasSetBackgroundColor } from "../utils/hasSetBackgroundColo";
import { CgColorBucket } from "react-icons/cg";
import { SET_COLOR_STYLE_COMMAND } from "../plugins/ColorStylePlugin";
import { $isBlockNodeWithBackgroundColor } from "../model/typeGuard";
import { $isCustomTextNode } from "../nodes/CustomTextNode";
import { ColorItem } from "@/shared/ui";
import { useNodeLabel } from "./useNodeLabel";
import { backgroundColors, textColors } from "@/shared/utils/constants";

export function useBlockOptionsMenuItems({
  editor,
  nodeKey,
}: {
  editor: LexicalEditor;
  nodeKey: string | null;
}) {
  const blockData = editor.getEditorState().read(() => {
    const colors = new Set<string>();
    if (!nodeKey) return;
    const node = $getNodeByKey(nodeKey);
    if (!$isElementNode(node)) return;
    for (const text of node.getAllTextNodes()) {
      if (!$isCustomTextNode(text)) return;
      colors.add(text.getColor());
    }

    return {
      type: node.getType(),
      colorText: colors.size > 1 ? null : [...colors][0],
      backgroundColor: $isBlockNodeWithBackgroundColor(node)
        ? node.getBackgroundColor()
        : undefined,
    };
  });
  const handleColorSelect = (color: string) => {
    editor.dispatchCommand(SET_COLOR_STYLE_COMMAND, { color: color });
    // setOpen(false);
  };

  const handleBackgroundSelect = (color: string) => {
    editor.dispatchCommand(SET_COLOR_STYLE_COMMAND, { backgroundColor: color });
    // setOpen(false);
  };
  const itemsColorText = textColors.map((item) => ({
    id: item.label,
    label: (
      <ColorItem
        color={item?.color || "default"}
        label={item.label}
        active={blockData?.colorText}
        type="text"
      />
    ),
    onClick: () => handleColorSelect(item.color),
  }));
  const itemsColorBackground = backgroundColors.map((item) => ({
    id: item.label,
    label: (
      <ColorItem
        color={item.color || "default"}
        label={item.label}
        active={blockData?.backgroundColor}
        type="background"
      />
    ),
    onClick: () => handleBackgroundSelect(item.color),
  }));
  if (!nodeKey) return null;
  const items = [
    { type: "label", label: useNodeLabel(nodeKey), visible: true },
    {
      id: "colorNode",
      label: (
        <p className="flex gap-1 items-center">
          <span>
            <CgColorBucket size={20} />
          </span>
          Цвет
        </p>
      ),
      visible: hasSetBackgroundColor(nodeKey, editor),
      children: [
        { type: "label", label: "Цвет текста" },
        ...itemsColorText,
        { type: "label", label: "Цвет фона" },
        ...itemsColorBackground,
      ],
    },
  ];

  return items.filter((item) => item.visible);
}
