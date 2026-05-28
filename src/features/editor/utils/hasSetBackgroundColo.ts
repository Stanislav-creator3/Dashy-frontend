import { $getNodeByKey, LexicalEditor } from "lexical";
import { $isBlockNode } from "../model/typeGuard";

export function hasSetBackgroundColor(nodeKey: string, editor: LexicalEditor) {
  const value = editor.getEditorState().read(() => {
    if (!nodeKey) return;
    const node = $getNodeByKey(nodeKey);
    if (!node) return;
    return (
      $isBlockNode(node) &&
      typeof (node as any).setBackgroundColor === "function"
    );
  });
  if (!value) return;

  return value;
}
