"use client";

import {
  autoUpdate,
  flip,
  offset,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { COMMAND_PRIORITY_EDITOR } from "lexical";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { EmojiPicker } from "@/widgets/emojiPicker";
import { SET_CALLOUT_ICON_COMMAND } from "../extensions/calloutExtension";
import {
  CLOSE_EDITOR_PANEL_COMMAND,
  OPEN_EDITOR_PANEL_COMMAND,
  type OpenEditorPanelPayload,
} from "../model/editorPanel.commands";

type PanelActionFactoryArgs = {
  anchorEl: HTMLElement;
  nodeKey: string;
};

const PANEL_ACTIONS: Record<
  string,
  (args: PanelActionFactoryArgs) => OpenEditorPanelPayload
> = {
  "open-emoji-picker:callout-icon": ({ anchorEl, nodeKey }) => ({
    anchorEl,
    render: ({ close, editor }) => (
      <EmojiPicker
        open
        onEmojiClick={(emoji) => {
          editor.dispatchCommand(SET_CALLOUT_ICON_COMMAND, {
            nodeKey,
            icon: emoji.emoji,
          });
          close();
        }}
      />
    ),
  }),
};

export function EditorPanelPlugin() {
  const [editor] = useLexicalComposerContext();
  const [panel, setPanel] = useState<OpenEditorPanelPayload | null>(null);
  const open = panel !== null;

  const { refs, floatingStyles, context } = useFloating({
    middleware: [offset(8), flip()],
    onOpenChange(nextOpen) {
      if (!nextOpen) {
        setPanel(null);
      }
    },
    open,
    placement: "bottom-start",
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    if (panel?.anchorEl) {
      refs.setReference(panel.anchorEl);
    }
  }, [panel, refs]);

  const dismiss = useDismiss(context);
  const { getFloatingProps } = useInteractions([dismiss]);

  useEffect(() => {
    return editor.registerCommand(
      OPEN_EDITOR_PANEL_COMMAND,
      (payload) => {
        setPanel((prevPanel) =>
          prevPanel?.anchorEl === payload.anchorEl ? null : payload,
        );
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      CLOSE_EDITOR_PANEL_COMMAND,
      () => {
        setPanel(null);
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      const trigger = (event.target as HTMLElement | null)?.closest(
        "[data-editor-action]",
      );

      if (trigger) {
        event.preventDefault();
      }
    };

    const onClick = (event: MouseEvent) => {
      const trigger = (event.target as HTMLElement | null)?.closest(
        "[data-editor-action]",
      );

      if (!(trigger instanceof HTMLElement)) {
        return;
      }

      const action = trigger.dataset.editorAction;
      const target = trigger.dataset.editorTarget;
      const nodeKey = trigger.dataset.nodeKey;

      if (!action || !target || !nodeKey) {
        return;
      }

      const panelFactory = PANEL_ACTIONS[`${action}:${target}`];
      if (!panelFactory) {
        return;
      }

      editor.dispatchCommand(
        OPEN_EDITOR_PANEL_COMMAND,
        panelFactory({
          anchorEl: trigger,
          nodeKey,
        }),
      );
    };

    return editor.registerRootListener((rootElement, prevRootElement) => {
      prevRootElement?.removeEventListener("mousedown", onMouseDown);
      prevRootElement?.removeEventListener("click", onClick);
      rootElement?.addEventListener("mousedown", onMouseDown);
      rootElement?.addEventListener("click", onClick);
    });
  }, [editor]);

  if (!panel) {
    return null;
  }

  return createPortal(
    <div
      ref={refs.setFloating}
      style={{
        ...floatingStyles,
        zIndex: 40,
      }}
      {...getFloatingProps()}
    >
      {panel.render({
        close: () => {
          setPanel(null);
        },
        editor,
      })}
    </div>,
    document.body,
  );
}
