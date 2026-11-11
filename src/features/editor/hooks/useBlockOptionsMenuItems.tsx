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
import { DropdownMenuItemProps } from "@/shared/ui/dropdownMenu/DropdownMenu";
import { LuLayoutPanelLeft } from "react-icons/lu";
import { $isImageBlockNode } from "../image/node/ImageBlockNode";
import { isImageLayout } from "@/widgets/imageBlock/model/types";
import { randomColorOklch } from "@/shared/utils/randomColorOklch";
import { MdDeleteOutline } from "react-icons/md";

const gridArea = (count: number) => {
  switch (count) {
    case 1:
      return `"image1"`;
    case 2:
      return `"image1 image2"`;
    case 3:
      return `"image1 image2"
              "image3 image2"`;
    case 4:
      return `"image1 image2"
              "image3 image4"`;
  }
};

export function useBlockOptionsMenuItems({
  editor,
  nodeKey,
}: {
  editor: LexicalEditor;
  nodeKey: string | null;
}) {
  if (!nodeKey) return null;

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

  const itemsLayoutImage = [1, 2, 3, 4].map((number) => ({
    id: number.toString(),
    label: `${number} элемента`,
    hoverElement: (
      <div
        className="grid gap-0.5"
        style={{
          gridTemplateColumns: `repeat(${number > 2 ? 2 : number}, minmax(0, 1fr))`,
          gridTemplateAreas: gridArea(number),
        }}
      >
        {Array.from({ length: number }).map((_, index) => {
          return (
            <div
              key={index}
              className="rounded-lg min-h-10 w-10 bg-background border border-border"
              style={{
                gridArea: index < 4 ? `image${index + 1}` : "",
              }}
            ></div>
          );
        })}
      </div>
    ),
    onClick: () => {
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if (!$isImageBlockNode(node)) return;
        node.setProps({
          ...node.getProps(),
          layout: isImageLayout(number) ? number : 1,
        });
      });
    },
  }));

  const items: DropdownMenuItemProps[] = [
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
    {
      id: "image",
      label: (
        <p className="flex gap-1 items-center">
          <span>
            <LuLayoutPanelLeft size={20} />
          </span>
          Макет
        </p>
      ),
      visible: editor.getEditorState().read(() => {
        const node = $getNodeByKey(nodeKey);
        return $isImageBlockNode(node);
      }),

      children: itemsLayoutImage,
    },
    {
      id: "delete",
      label: (
        <p className="flex gap-1 items-center">
          <MdDeleteOutline size={20} />
          Удалить
        </p>
      ),
      color: "var(--color-error)",
      visible: true,
      onClick: () => {
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          if (!node) return;
          node.remove();
        });
      },
    },
  ];

  return items.filter((item) => item.visible);
}
