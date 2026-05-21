import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  LexicalTypeaheadMenuPlugin,
  type MenuTextMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import {
  $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  TextNode,
  type LexicalEditor,
} from "lexical";
import { $createListItemNode, $isListNode } from "@lexical/list";
import { useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import SlashMenu from "../components/slashMenu/SlashMenu";
import {
  getNode,
  SLASH_COMMANDS,
  SlashCommandType,
  SlashMenuOption,
} from "../utils/slashItems";
import {
  getBlockIdFromNode,
  getOrderFromNode,
  setBlockIdForNode,
} from "../utils/nodeId";
import { $isCalloutNode } from "../nodes/CalloutNode";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IBlockCreate } from "../model/block.types";
import { blocksApi } from "../api/blocks.api";
import { pagesApi } from "@/entities/pages/api/pages.api";
import { $isBlockNode } from "../model/typeGuard";
import { getBlockTempId } from "../model/blockState";

export default function SlashMenuPlugin({
  pageId,
  projectId,
}: {
  pageId: string;
  projectId: string;
}) {
  const [editor] = useLexicalComposerContext();

  const queryClient = useQueryClient();

  const { mutateAsync: createBlocks } = useMutation({
    mutationFn: (data: IBlockCreate) =>
      blocksApi.createBlocks({ id: pageId, data }),
    onSettled: () => {
      queryClient.invalidateQueries(
        pagesApi.getByIdPage({
          id: pageId,
          projectId,
        }),
      );
    },
  });
  const [queryString, setQueryString] = useState<string | null>(null);

  const checkForTriggerMatch = useCallback(
    (text: string, editor: LexicalEditor): MenuTextMatch | null => {
      // Open slash-menu only when current block starts with "/query"
      // and has no text before slash.
      const match = text.match(/^\/([^\s]*)$/);
      if (!match) return null;

      let isSlashOnlyBlock = false;
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;
        const topLevel = selection.anchor.getNode().getTopLevelElementOrThrow();
        isSlashOnlyBlock = /^\/([^\s]*)$/.test(topLevel.getTextContent());
      });
      if (!isSlashOnlyBlock) return null;

      return {
        leadOffset: 0,
        matchingString: match[1] ?? "",
        replaceableString: match[0],
      };
    },
    [],
  );

  const options = useMemo(() => {
    const query = (queryString ?? "").trim().toLowerCase();

    if (!query) {
      return SLASH_COMMANDS.map((item) => new SlashMenuOption(item));
    }

    return SLASH_COMMANDS.filter((item) => {
      if (item.title.toLowerCase().includes(query)) return true;
      return item.keywords.some((keyword) =>
        keyword.toLowerCase().includes(query),
      );
    }).map((item) => new SlashMenuOption(item));
  }, [queryString]);

  const applyCommand = useCallback(
    (commandType: SlashCommandType, nodeToReplace: TextNode | null) => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const topLevel = selection.anchor.getNode().getTopLevelElementOrThrow();
      const nodeId = getBlockIdFromNode(topLevel) ?? "";
      const tempId = getBlockTempId(topLevel) ?? genId();
      const order = getOrderFromNode(topLevel) ?? 1;

      if (nodeToReplace && nodeToReplace.isAttached()) {
        nodeToReplace.remove();
      }

      const replacement = getNode(commandType, nodeId, order, tempId);

      const children = topLevel.getChildren();
      if ($isListNode(replacement)) {
        const listItem = $createListItemNode();
        children.forEach((child) => listItem.append(child));
        replacement.append(listItem);
        topLevel.replace(replacement);
        listItem.selectEnd();
        return;
      }

      children.forEach((child) => replacement.append(child));
      topLevel.replace(replacement);
      replacement.selectEnd();
    },
    [],
  );

  const onSelectOption = useCallback(
    (
      selectedOption: SlashMenuOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void,
    ) => {
      editor.update(() => {
        applyCommand(selectedOption.commandType, nodeToReplace);
        closeMenu();
      });
    },
    [applyCommand, editor],
  );

  return (
    <LexicalTypeaheadMenuPlugin
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForTriggerMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        {
          options: menuOptions,
          selectedIndex,
          selectOptionAndCleanUp,
          setHighlightedIndex,
        },
      ) =>
        anchorElementRef.current && menuOptions.length
          ? createPortal(
              <SlashMenu
                selectedIndex={selectedIndex ? selectedIndex : 0}
                menuOptions={menuOptions}
                setHighlightedIndex={setHighlightedIndex}
                selectOptionAndCleanUp={selectOptionAndCleanUp}
              />,
              anchorElementRef.current,
            )
          : null
      }
    />
  );
}
function genId(): string | null {
  throw new Error("Function not implemented.");
}
