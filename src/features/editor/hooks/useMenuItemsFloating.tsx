import { Tooltip } from "@/shared/ui";
import { FORMAT_TEXT_COMMAND, LexicalEditor } from "lexical";

import { FiUnderline, FiItalic, FiBold } from "react-icons/fi";
import { GoStrikethrough } from "react-icons/go";
import { TextColorItem } from "../components/TextColorItem";

interface IMenuState {
  isBold: boolean;
  isCode: boolean;
  isItalic: boolean;
  isStrikethrough: boolean;
  isUnderline: boolean;
}

export function useMenuItemsFloating({
  editor,
  state,
}: {
  editor: LexicalEditor;
  state: IMenuState;
}) {
  return [
    {
      id: "bold",
      isActive: state.isBold,
      render: () => (
        <Tooltip content="Жирный" direction="bottom" delay={1500}>
          <button
            className="p-2 cursor-pointer rounded-md hover:bg-black hover:text-white"
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
          >
            <FiBold />
          </button>
        </Tooltip>
      ),
    },
    {
      id: "italic",
      isActive: state.isItalic,
      render: () => (
        <Tooltip content="Курсив" direction="bottom" delay={1500}>
          <button
            className="p-2 cursor-pointer rounded-md hover:bg-black hover:text-white"
            onClick={() =>
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
            }
          >
            <FiItalic />
          </button>
        </Tooltip>
      ),
    },
    {
      id: "GoStrikethrough",
      isActive: state.isStrikethrough,
      render: () => (
        <Tooltip content="Зачеркнуть" direction="bottom" delay={1500}>
          <button
            className="p-2 cursor-pointer  rounded-md hover:bg-black hover:text-white"
            onClick={() =>
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
            }
          >
            <GoStrikethrough />
          </button>
        </Tooltip>
      ),
    },

    {
      id: "Underline,",
      isActive: state.isUnderline,
      render: () => (
        <Tooltip content="Подчеркнуть" direction="bottom" delay={1500}>
          <button
            className="p-2 cursor-pointer rounded-md hover:bg-black hover:text-white"
            onClick={() =>
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
            }
          >
            <FiUnderline />
          </button>
        </Tooltip>
      ),
    },
    {
      id: "color",
      tooltip: "Цвет",
      render: () => <TextColorItem editor={editor} />,
    },
  ];
}
