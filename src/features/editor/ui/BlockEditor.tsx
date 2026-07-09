"use client";

import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { ORDERED_LIST, TRANSFORMERS, UNORDERED_LIST } from "@lexical/markdown";
import { CodeExtension } from "@lexical/code";
import { LinkExtension } from "@lexical/link";
import { CheckListExtension } from "@lexical/list";
import { HeadingNode, RichTextExtension } from "@lexical/rich-text";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { HEADING_CUSTOM } from "../markdown/headingTransformer";
import { BULLET_CUSTOM } from "../markdown/bulletTransformer";
import { EnterCreateBlockPlugin } from "../plugins/EnterCreateBlockPlugin";
import { $createCustomTextNode, CustomTextNode } from "../nodes/CustomTextNode";
import { BlockPlaceholderPlugin } from "../plugins/BlockPlaceholderPlugin";
import { InitializeEditorPlugin } from "../plugins/InitializeEditorPlugin";
import {
  configExtension,
  defineExtension,
  ParagraphNode,
  TextNode,
} from "lexical";
import { BlocksUpdatePlugin } from "../plugins/BlockUpdatePlugin";
import { BlockDeletePlugin } from "../plugins/BlockDeletePlugin";
import { FloatingMenuPlugin } from "../plugins/FloatingMenuPlugin";
import { ColorStylePlugin } from "../plugins/ColorStylePlugin";
import { IBlock } from "../model/block.types";
import { DndPlugin } from "../plugins/DndPlugin";
import { useMemo } from "react";
import { DraggableWrapper } from "../components/DraggableWrapper";
import { LinkPageNode } from "../nodes/LinkPage";
import BlockDeleteSkipPlugin from "../plugins/BlockDeleteSkipPlugin";
import { CreateOnClickPlugin } from "../plugins/CreateOnClickPlugin";
import SlashMenuPlugin from "../plugins/SlashMenuPlugin";
import { HistoryExtension } from "@lexical/history";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { CalloutExtension } from "../extensions/calloutExtension";
import { EditorPanelPlugin } from "../plugins/EditorPanelPlugin";
import styles from "./BlockEditor.module.css";
import {
  $createCustomParagraphNode,
  CustomParagraphNode,
} from "../nodes/CustomParagraphNode";
import {
  $createCustomHeadingNode,
  CustomHeadingNode,
} from "../nodes/CustomHeadingNode";
import {
  $createCustomQuoteNode,
  CustomQuoteNode,
} from "../nodes/CustomQuoteNode";
import { QuoteNode } from "@lexical/rich-text";
import { ReactExtension } from "@lexical/react/ReactExtension";
import { BoardNode } from "../board";

const EditorExtension = defineExtension({
  name: "NotionLikeEditor",
  namespace: "NotionLikeEditor",
  onError: (error: Error) => console.error(error),
  theme: {
    heading: {
      h1: "text-4xl font-extrabold my-4",
      h2: "text-3xl font-bold my-3",
      h3: "text-2xl font-semibold my-2",
    },
    text: {
      bold: "font-bold",
      italic: "italic",
      underline: "border-b border-b-2 border-text",
      strikethrough: "line-through",
    },
    quote:
      "relative before:content-[''] before:border-l-4 before:absolute before:left-1 before:top-1 before:bottom-1 before:border-foreground pl-4 text-text my-2",
    list: {
      ul: "list-disc",
      ol: "list-decimal",
      listitem: "ml-4",
      checklist: styles.editorChecklist,
      listitemChecked: styles.editorListItemChecked,
      listitemUnchecked: styles.editorListItemUnchecked,
    },
  },
  nodes: [
    CustomTextNode,
    CustomParagraphNode,
    CustomHeadingNode,
    CustomQuoteNode,
    BoardNode,
    LinkPageNode,
    {
      replace: TextNode,
      with: (node: TextNode) => {
        const custom = $createCustomTextNode(node.getTextContent());
        custom.setFormat(node.getFormat());
        return custom;
      },
      withKlass: CustomTextNode,
    },
    {
      replace: ParagraphNode,
      with: () => $createCustomParagraphNode(),
      withKlass: CustomParagraphNode,
    },
  ],
  dependencies: [
    RichTextExtension,
    HistoryExtension,
    CodeExtension,
    LinkExtension,
    CheckListExtension,
    CalloutExtension,
    configExtension(ReactExtension, { contentEditable: null }),
  ],
});

const CUSTOM_TRANSFORMERS = [
  HEADING_CUSTOM,
  BULLET_CUSTOM,
  ...TRANSFORMERS.filter(
    (t) =>
      t !== UNORDERED_LIST &&
      t !== ORDERED_LIST &&
      !(t as any).regExp?.toString?.().includes("^(#{1,6})\\s"),
  ),
];

export default function BlockEditor({
  pageId,
  projectId,
  blocks,
}: {
  pageId: string;
  projectId: string;
  blocks: IBlock[] | undefined;
}) {
  const CustomContent = useMemo(() => {
    return (
      <DraggableWrapper>
        <div
          style={{
            position: "relative",
          }}
        >
          <ContentEditable className="min-h-20 flex flex-col gap-2 pb-[30vh] editor box-border whitespace-pre-wrap wrap-anywhere focus:outline-none max-w-none text-[color:var(--color-text)] caret-[color:var(--color-text)] [&_p]:min-h-[1rem][&_p]:my-1" />
        </div>
      </DraggableWrapper>
    );
  }, []);
  return (
    <LexicalExtensionComposer
      extension={EditorExtension}
      contentEditable={CustomContent}
    >
      <EditorPanelPlugin />
      <InitializeEditorPlugin
        blocks={blocks}
        isLoading={false}
        projectId={projectId}
      />
      <SlashMenuPlugin pageId={pageId} projectId={projectId} />
      <EnterCreateBlockPlugin pageId={pageId} projectId={projectId} />
      <CreateOnClickPlugin pageId={pageId} projectId={projectId} />
      <BlocksUpdatePlugin pageId={pageId} projectId={projectId} />
      <BlockDeleteSkipPlugin />
      <BlockDeletePlugin pageId={pageId} projectId={projectId} />
      <BlockPlaceholderPlugin />
      <FloatingMenuPlugin />
      <ColorStylePlugin />
      <MarkdownShortcutPlugin transformers={CUSTOM_TRANSFORMERS} />
      <DndPlugin pageId={pageId} projectId={projectId} />
    </LexicalExtensionComposer>
  );
}
