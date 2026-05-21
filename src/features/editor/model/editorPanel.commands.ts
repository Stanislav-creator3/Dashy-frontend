import type { LexicalEditor } from "lexical";
import { createCommand } from "lexical";
import type { ReactNode } from "react";

export type OpenEditorPanelPayload = {
  anchorEl: HTMLElement;
  render: (ctx: {
    close: () => void;
    editor: LexicalEditor;
  }) => ReactNode;
};

export const OPEN_EDITOR_PANEL_COMMAND =
  createCommand<OpenEditorPanelPayload>("OPEN_EDITOR_PANEL_COMMAND");

export const CLOSE_EDITOR_PANEL_COMMAND = createCommand(
  "CLOSE_EDITOR_PANEL_COMMAND",
);
