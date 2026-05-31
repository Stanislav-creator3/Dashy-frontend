// plugins/ToolbarPlugin.tsx
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode, type HeadingTagType } from "@lexical/rich-text";
import { $getSelection, $isRangeSelection } from "lexical";
import {
  getBlockTempIdFromNode,
  getBlockIdFromNode,
  getOrderFromNode,
  setBlockIdForNode,
  setOrderForNode,
  setBlockTempIdForNode,
} from "../utils/nodeId";
import { $createCustomHeadingNode } from "../nodes/CustomHeadingNode";

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const formatHeading = (level: number) => {
    editor.update(() => {
      const selection = $getSelection();

      if (!$isRangeSelection(selection)) {
        return;
      }

      const topLevel = selection.anchor.getNode().getTopLevelElementOrThrow();
      const existingId = getBlockIdFromNode(topLevel);
      const tempId =
        getBlockTempIdFromNode(topLevel) ??
        existingId ??
        `temp-${crypto.randomUUID()}`;
      const headingNode = $createCustomHeadingNode(
        `h${level}` as HeadingTagType,
      );
      setBlockIdForNode(headingNode, existingId ?? tempId);
      setBlockTempIdForNode(headingNode, tempId);
      setOrderForNode(headingNode, getOrderFromNode(topLevel) ?? 1);

      topLevel.getChildren().forEach((child) => headingNode.append(child));
      topLevel.replace(headingNode);

      headingNode.selectEnd();
    });
  };

  return (
    <div className="toolbar flex gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
      <button
        onClick={() => formatHeading(1)}
        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
        title="Заголовок 1"
      >
        H1
      </button>
      <button
        onClick={() => formatHeading(2)}
        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
        title="Заголовок 2"
      >
        H2
      </button>
      <button
        onClick={() => formatHeading(3)}
        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
        title="Заголовок 3"
      >
        H3
      </button>
    </div>
  );
}
