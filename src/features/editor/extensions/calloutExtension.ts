import {
  $getNodeByKey,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  defineExtension,
} from "lexical";
import { CalloutNode } from "../nodes/CalloutNode";

export const SET_CALLOUT_ICON_COMMAND = createCommand<{
  nodeKey: string;
  icon: string;
}>("SET_CALLOUT_ICON_COMMAND");

export const CalloutExtension = defineExtension({
  name: "@app/editor/callout",
  nodes: [CalloutNode],
  register(editor) {
    return editor.registerCommand(
      SET_CALLOUT_ICON_COMMAND,
      ({ nodeKey, icon }) => {
        const node = $getNodeByKey(nodeKey);

        if (!(node instanceof CalloutNode)) {
          return false;
        }

        node.setIcon(icon);
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  },
});
